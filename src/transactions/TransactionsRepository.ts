
import {
    Repository,
    EntityRepository,
    FindConditions,
    Equal,
    IsNull,
    Not,
} from "typeorm";
import { Transaction } from "./entities/Transaction";
import { User } from "../users/entities";
import { GetTransactionsFilters } from "./types/requests/GetTransactionsFilters";
import _ from "lodash";
import { TransactionStatus } from "./types/TransactionStatus.enum";
import { TransactionSubject } from "./types/TransactionSubject.enum";
import { NotStartedRewardTxnsIdsAndReceiverAndRewardsSum } from "./types/NotStartedRewardTxnsIdsAndReceiverAndRewardsSum.interface";
import Big from "big.js";
import { Reward } from "./entities/Reward";

@EntityRepository(Transaction)
export class TransactionsRepository extends Repository<Transaction> {
    /**
     * Этот метод возвращает баланс учитывая только incoming трансферы.
     * А еще, так как здесь производится поиск с учетом регистра "txnTo",
     * то в подсчеты участвуют только выигрыши мемезатора. Этот метод
     * нужно убрать 
     */
    async getBalanceByAddress(address: string): Promise<string> {
        const rawResult = await this.createQueryBuilder("transaction")
            .select(`SUM(transaction."txnSum") as balance`)
            .where(`transaction."txnTo" = :address`, { address })
            .getRawOne();

        return (rawResult.balance || "0") as string;
    }

    /**
     * Баланс пользователя в блокчейне.
     * Работает следующим образом:
     * баланс = (сумма всех входящих трансферов в статусе "ВЫПОЛНЕН") - (сумма всех выходящих трансферов "ВЫПОЛНЕН")
     */
    async getActualBalanceByAddress(address: string): Promise<string> {
        const { incomingTokensSum } = await this.createQueryBuilder("transaction")
            .select(`SUM(transaction."txnSum") as "incomingTokensSum"`)
            .where(`LOWER(transaction."txnTo") = LOWER(:address)`, { address })
            .andWhere(`transaction.txnStatus = :status`, { status: TransactionStatus.PERFORMED })
            .getRawOne();

        const { outgoingTokensSum } = await this.createQueryBuilder("transaction")
            .select(`SUM(transaction."txnSum") as "outgoingTokensSum"`)
            .where(`LOWER(transaction."txnFrom") = LOWER(:address)`, { address })
            .andWhere(`transaction.txnStatus = :status`, { status: TransactionStatus.PERFORMED })
            .getRawOne();

        return new Big(incomingTokensSum || "0").minus(outgoingTokensSum || "0").toString();
    }

    /**
     * Возвращает сумму выигрышей, которые не отправлены, но будут отправлены позже
     */
    async getPendingRewardsSum(address: string): Promise<string> {
        const { pendingRewardsSum } = await this.createQueryBuilder("transaction")
            .select(`SUM(transaction."txnSum") as "pendingRewardsSum"`)
            .where(`LOWER(transaction."txnTo") = LOWER(:address)`, { address })
            .andWhere(`transaction.txnSubj = :subject`, { subject: TransactionSubject.REWARD })
            .andWhere(
                `transaction.txnStatus IN (:...statuses)`,
                { statuses: [TransactionStatus.PERFORMING, TransactionStatus.NOT_STARTED, TransactionStatus.PROBLEM] },
            )
            .getRawOne();

        return pendingRewardsSum || "0";
    }

    async findByUser(
        user: User,
        filters: GetTransactionsFilters,
    ): Promise<Transaction[]> {

        const commonConditions: FindConditions<Transaction> = {};

        if (filters.txnHash) {
            commonConditions.txnHash = filters.txnHash;
        }

        if (filters.txnStatus) {
            commonConditions.txnStatus = filters.txnStatus;
        }

        const qb = this.createQueryBuilder("transaction")
            .where(commonConditions)
            .andWhere(
                `(LOWER(transaction."txnFrom") = LOWER(:ethereumAddress) OR LOWER(transaction."txnTo") = LOWER(:ethereumAddress))`,
                { ethereumAddress: user.ethereumAddress }
            )

        if (filters.skip) {
            qb.skip(filters.skip)
        }

        if (filters.take) {
            qb.take(filters.take)
        }

        qb.orderBy("COALESCE(transaction.txnDate, transaction.createdAt)", "DESC")

        return qb.getMany()
    }

    async getNotStartedRewardTxnsIdsAndReceiversAndRewardsSums(options: {
        createdAtFrom?: Date;
        createdAtTo?: Date;
        receiversLimit?: number;
    }): Promise<NotStartedRewardTxnsIdsAndReceiverAndRewardsSum[]> {
        const qb = this.createQueryBuilder("transaction")
            .select(`LOWER(transaction."txnTo")`, "txnTo") // transaction receiver
            .addSelect(`array_agg(transaction.id)`, "txnIds") // an array, containing ids of transactions
            .addSelect(`SUM(transaction."txnSum")`, "rewardsSum")
            .where(`transaction.txnStatus = :txnStatus`, {
                txnStatus: TransactionStatus.NOT_STARTED,
            })
            .andWhere(`transaction.txnSubj = :txnType`, {
                txnType: TransactionSubject.REWARD,
            });

        if (options.createdAtFrom) {
            qb.andWhere(`transaction."createdAt" >= :createdAtFrom`, {
                createdAtFrom: options.createdAtFrom,
            });
        }

        if (options.createdAtTo) {
            qb.andWhere(`transaction."createdAt" < :createdAtTo`, {
                createdAtTo: options.createdAtTo,
            });
        }

        if (options.receiversLimit) {
            qb.limit(options.receiversLimit);
        }

        qb.groupBy(`LOWER(transaction."txnTo")`).orderBy(
            `LOWER(transaction."txnTo")`,
        );

        return qb.getRawMany() as Promise<
            NotStartedRewardTxnsIdsAndReceiverAndRewardsSum[]
        >;
    }

    async getLastNonRewardTransaction(): Promise<Transaction> {
        return this.findOne({
            where: {
                txnSubj: Not(Equal(TransactionSubject.REWARD)),
                txnHash: Not(IsNull()),
                txnDate: Not(IsNull()),
            },
            order: {
                txnDate: "DESC",
            },
        });
    }

    async findDuplicates<
        T extends Pick<Transaction, "txnTo" | "txnFrom" | "txnSum" | "txnHash">
    >(partialTransactions: T[]): Promise<T[]> {
        const duplicateTransactions = await this.find({
            where: _.map(partialTransactions, (partialTransaction) =>
                _.pick(partialTransaction, [
                    "txnTo",
                    "txnFrom",
                    "txnSum",
                    "txnHash",
                ]),
            ),
        });

        return partialTransactions.filter(
            (partialTransaction) =>
                !!duplicateTransactions.find(
                    (t) =>
                        partialTransaction.txnFrom === t.txnFrom &&
                        partialTransaction.txnTo === t.txnTo &&
                        partialTransaction.txnHash === t.txnHash &&
                        partialTransaction.txnSum === t.txnSum,
                ),
        );
    }
}
