import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import cheerio from "cheerio";
import { TokenTransfer, TokenTransfersResult } from "./types";
import moment from "moment";
import { sleep } from "../utils/sleep";

@Injectable()
export class BscApiService {
    private readonly axios: AxiosInstance;

    constructor() {
        this.axios = axios.create();
    }

    async *getTokenTransfersSinceTokenTransfer(
        tokenContractAddress: string,
        sinceTokenTransfer: TokenTransfer,
    ): AsyncGenerator<TokenTransfer[]> {
        let collectedAllTransactionsSinceHash = false;
        let nextPageCursor: string | undefined;

        while (true) {
            const tokenTransfersResult = await this.getTokenTransfers(
                tokenContractAddress,
                nextPageCursor,
            );

            const tokenTransfersAfterHash: TokenTransfer[] = [];

            for (const tokenTransfer of tokenTransfersResult.tokenTransfers) {
                if (
                    sinceTokenTransfer.blockNumber ===
                        tokenTransfer.blockNumber &&
                    sinceTokenTransfer.from.toLowerCase() ===
                        tokenTransfer.from.toLowerCase() &&
                    sinceTokenTransfer.to.toLowerCase() ===
                        tokenTransfer.to.toLowerCase() &&
                    sinceTokenTransfer.amount === tokenTransfer.amount &&
                    sinceTokenTransfer.hash === tokenTransfer.hash
                ) {
                    collectedAllTransactionsSinceHash = true;
                    break;
                }
                tokenTransfersAfterHash.push(tokenTransfer);
            }

            yield tokenTransfersAfterHash;

            if (collectedAllTransactionsSinceHash) {
                break;
            }

            nextPageCursor = tokenTransfersResult.nextPageCursor;

            await sleep(10000);
        }
    }

    async *getTokenTransfersSinceDate(
        tokenContractAddress: string,
        sinceTxnDate: Date,
    ): AsyncGenerator<TokenTransfer> {
        let nextPageCursor: string | undefined;

        while (true) {
            const tokenTransfersResult = await this.getTokenTransfers(
                tokenContractAddress,
                nextPageCursor,
            );

            for (const tokenTransfer of tokenTransfersResult.tokenTransfers) {
                if (moment(tokenTransfer.date).isBefore(sinceTxnDate)) {
                    return;
                }

                yield tokenTransfer;
            }

            nextPageCursor = tokenTransfersResult.nextPageCursor;

            await sleep(10000);
        }
    }

    async *getAllTokenTransfers(tokenContractAddress: string) {
        let nextPageCursor: string | undefined;

        while (true) {
            const tokenTransfersResult = await this.getTokenTransfers(
                tokenContractAddress,
                nextPageCursor,
            );

            yield tokenTransfersResult.tokenTransfers;

            nextPageCursor = tokenTransfersResult.nextPageCursor;

            await sleep(10000);
        }
    }

    async getTokenTransfers(
        tokenContractAddress: string,
        nextPageCursor?: string,
    ): Promise<TokenTransfersResult> {
        const page = await this.axios.get<{
            items: string[];
            next_page_path: string;
        }>(
            nextPageCursor
                ? `https://explorer.binance.org${nextPageCursor}&type=JSON`
                : `https://explorer.binance.org/smart/tokens/${tokenContractAddress}/token_transfers?type=JSON`,
        );

        return {
            tokenContractAddress,
            nextPageCursor: page.data.next_page_path,
            tokenTransfers: page.data.items.map((item) =>
                this.parseTokenTransferItem(item),
            ),
        };
    }

    private parseTokenTransferItem(tokenTransferItem: string): TokenTransfer {
        const parsedItem = cheerio.load(tokenTransferItem);

        const hash = parsedItem("a[data-test=transaction_hash_link]")
            .first()
            .text()
            .trim();
        const from = parsedItem("span[data-address-hash]")
            .first()
            .attr("data-address-hash")
            .trim();

        const to = parsedItem("span[data-address-hash]")
            .last()
            .attr("data-address-hash")
            .trim();

        const amountWithSymbolText = parsedItem("span.tile-title")
            .first()
            .text()
            .trim();

        const amount = amountWithSymbolText.split(" ")[0].replace(",", "");
        const tokenSymbol = amountWithSymbolText.split(" ")[1];

        const date = new Date(
            parsedItem("span[data-from-now]").first().attr("data-from-now"),
        );

        const blockNumber = parseInt(
            parsedItem(`a[href^="/smart/blocks/"]`)
                .first()
                .text()
                .trim()
                .split("#")[1],
            10,
        );

        return {
            hash,
            from,
            to,
            amount,
            tokenSymbol,
            date,
            blockNumber,
        };
    }
}
