import {Module} from "@nestjs/common";
import {TransactionsController} from "./TransactionsController";
import {TransactionsService} from "./TransactionsService";
import {FilesModule} from "../files";
import {AccountsModule} from "../accounts";

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [FilesModule, AccountsModule]
})
export class TransactionsModule {}
