import { Injectable } from "@nestjs/common";
import { LoggerService } from "nest-logger";
import { BscApiService } from "../bsc-api/bsc-api.service";
import { config } from "../config";
import { Transaction } from "./entities/Transaction";
import { TransactionsRepository } from "./TransactionsRepository";
import uuid from "uuid";
import { TransactionStatus } from "./types/TransactionStatus.enum";
import { TransactionSubject } from "./types/TransactionSubject.enum";
import { TokenTransfer } from "../bsc-api/types";
import { Cron, NestSchedule } from "nest-schedule";
import _ from "lodash";

@Injectable()
export class TransactionsWithBlockchainSync extends NestSchedule {
    constructor(
        private readonly transactionsRepository: TransactionsRepository,
        private readonly bscApiService: BscApiService,
        private readonly logger: LoggerService,
    ) {
        super();
    }

    @Cron("*/10 * * * *", {
        waiting: true,
        enable: !config.DISABLE_NEW_TOKEN_TRANSFERS_SYNC,
        immediate: true,
    })
    async newTransactionsSynchronizerCron() {
        await this.synchronizeNewTransactions();
    }

    /**
     * Synchronizes new transactions.
     * It takes the latest non-reward transaction from the 'transactions' table,
     * then finds all non-reward token transfers in the blockchain that happened after that latest transaction.
     * Found token transfers are then added to 'transactions' table.
     * If no "latest" transaction where found in the 'transactions' table then
     * the last non-reward token transfers will be added to 'transactions' table from the blockchain.
     */
    public async synchronizeNewTransactions() {
        const lastTransaction = await this.transactionsRepository.getLastNonRewardTransaction();

        if (!lastTransaction) {
            this.logger.warn(
                "synchronizeNewTransactions: Last token transfer not found. Synchronizing the latest non-reward token-transfer",
            );

            const lastNonRewardTokenTransfer = await this.getLastNonRewardTransactionFromBscApi();

            this.logger.info(
                `synchronizeNewTransactions: last non-reward token transfer: ${JSON.stringify(
                    lastNonRewardTokenTransfer,
                )}`,
            );

            await this.upsertTokenTransfers([lastNonRewardTokenTransfer]);

            return;
        }

        for await (const tokenTransfersChunk of this.bscApiService.getTokenTransfersSinceTokenTransfer(
            config.PROM_TOKENS_CONTRACT_ADDRESS,
            // @ts-ignore
            lastTransaction.txnDetails.tokenTransfer,
        )) {
            await this.upsertTokenTransfers(tokenTransfersChunk);
        }
    }

    /**
     * @todo check, if transactions already exists
     */
    private async upsertTokenTransfers(
        tokenTransfers: TokenTransfer[],
    ): Promise<Transaction[]> {
        this.logger.info(
            `upsertTokenTransfers: upserting these tokenTransfers ${JSON.stringify(
                tokenTransfers.map((tt) => tt.hash),
            )}`,
        );

        const rewardTokenTransfersHashes: string[] = [];

        const tokenTransfersWithoutRewards = tokenTransfers.filter((tt) => {
            if (
                tt.from.toLowerCase() ===
                config.MEMEZATOR_PRIZE_FUND_ACCOUNT_ADDRESS.toLowerCase()
            ) {
                rewardTokenTransfersHashes.push(tt.hash);
                return false;
            }

            return true;
        });

        this.logger.info(
            `upsertTokenTransfers: ignoring reward transactions ${JSON.stringify(
                rewardTokenTransfersHashes,
            )}`,
        );

        const transactions: Transaction[] = tokenTransfersWithoutRewards.map(
            (tt) =>
                new Transaction({
                    id: uuid(),
                    createdAt: new Date(),
                    txnFrom: tt.from.toLowerCase(),
                    txnTo: tt.to.toLowerCase(),
                    txnSum: tt.amount,
                    txnStatus: TransactionStatus.PERFORMED,
                    txnSubj: TransactionSubject.TRANSFER,
                    txnHash: tt.hash,
                    txnDate: tt.date,
                    txnDetails: {
                        tokenTransfer: tt,
                    },
                }),
        );

        // TODO: exclude duplicate transactions
        const duplicateTransactions: Transaction[] = await this.transactionsRepository.findDuplicates(
            transactions,
        );

        this.logger.warn(
            `upsertTokenTransfers: skipping duplicate transactions: ${JSON.stringify(
                duplicateTransactions,
            )}`,
        );

        const transactionWithoutDups: Transaction[] = _.difference(
            transactions,
            duplicateTransactions,
        );

        this.logger.info(
            `upsertTokenTransfers: creating transactions with IDs: ${JSON.stringify(
                transactions.map((t) => t.id),
            )}`,
        );

        await this.transactionsRepository.save(transactionWithoutDups);

        this.logger.info(
            `upsertTokenTransfers: created transactions with IDs: ${JSON.stringify(
                transactions.map((t) => t.id),
            )}`,
        );

        return transactions;
    }

    private async getLastNonRewardTransactionFromBscApi(): Promise<
        TokenTransfer | never
    > {
        for await (const tokenTransfers of this.bscApiService.getAllTokenTransfers(
            config.PROM_TOKENS_CONTRACT_ADDRESS,
        )) {
            const nonRewardTokenTransfer = tokenTransfers.find(
                (tokenTransfer) =>
                    tokenTransfer.from.toLowerCase() !==
                    config.MEMEZATOR_PRIZE_FUND_ACCOUNT_ADDRESS.toLowerCase(),
            );

            if (nonRewardTokenTransfer) {
                return nonRewardTokenTransfer;
            }
        }
    }
}
