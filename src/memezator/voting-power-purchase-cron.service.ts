import { Injectable } from "@nestjs/common";
import { LoggerService } from "nest-logger";
import { NestSchedule, Cron } from "nest-schedule";
import { config } from "../config";
import { VotingPowerPurchaseRepository } from "./voting-power-purchase.repository";
import { UsersRepository } from "../users";
import uuid from "uuid";
import { TransactionsRepository } from "../transactions/TransactionsRepository";
import {
    getCurrentMemezatorContestStartTime,
    getVotingPowerTransactionsConditionDate,
} from "./utils";
import { MoreThanOrEqual } from "typeorm";
import Big from "big.js";

@Injectable()
export class VotingPowerPurchaseCronService extends NestSchedule {
    constructor(
        private readonly transactionsRep: TransactionsRepository,
        private readonly votingPowerPurchaseRepository: VotingPowerPurchaseRepository,
        private readonly usersRepository: UsersRepository,
        private readonly logger: LoggerService,
    ) {
        super();
    }

    @Cron("*/10 * * * *", { waiting: true, immediate: true })
    public async getVotingPowerPurchaseTransactions() {
        this.logger.log("getVotingPowerPurchaseTransactions: Cron tick");
        const transactions = await this.transactionsRep.find({
            where: {
                txnTo: config.VOTING_POWER_PURCHASE_ADDRESS.toLowerCase(),
                txnDate: MoreThanOrEqual(
                    getVotingPowerTransactionsConditionDate(),
                ),
            },
        });
        if (!transactions) {
            this.logger.log(
                `getVotingPowerPurchaseTransactions: No transactions found`,
            );
        } else {
            this.logger.log(
                `getVotingPowerPurchaseTransactions: Found ${transactions.length} transactions`,
            );
        }

        for (const transaction of transactions) {
            this.logger.log(
                `getVotingPowerPurchaseTransactions: Transaction: ${transaction.id}`,
            );
            const user = await this.usersRepository.findByEthereumAddressIgnoreCase(
                transaction.txnFrom,
            );

            if (!user) {
                this.logger.warn(
                    `getVotingPowerPurchaseTransactions: user for transaction ${JSON.stringify(
                        transaction,
                    )} not found. Skipping`,
                );
                continue;
            }

            const votingPowerPurchaseExist = await this.votingPowerPurchaseRepository.findOne(
                {
                    where: {
                        txnId: transaction.id,
                    },
                },
            );

            if (!votingPowerPurchaseExist) {
                const newVotingPowerPurchase = this.votingPowerPurchaseRepository.create(
                    {
                        id: uuid(),
                        createdAt: new Date(),
                        txnHash: transaction.txnHash,
                        txnDate: transaction.txnDate,
                        userId: user.id,
                        txnSum: transaction.txnSum,
                        txnFrom: transaction.txnFrom.toLowerCase(),
                        txnId: transaction.id,
                        votingPower: Number(
                            new Big(transaction.txnSum).mul(
                                config.PROM_TO_VOTING_POWER_RATIO,
                            ),
                        ),
                    },
                );
                await this.votingPowerPurchaseRepository.save(
                    newVotingPowerPurchase,
                );
                this.logger.log(
                    `getVotingPowerPurchaseTransactions: New voting power purchase: ${newVotingPowerPurchase.id}`,
                );
            } else {
                this.logger.warn(
                    `getVotingPowerPurchaseTransactions: Record for transaction ${transaction.id} already exists.`,
                );
            }
        }
    }
}
