import {Global, Module} from "@nestjs/common";
import {LoggerService, LoggerTransport} from "nest-logger";
import {config} from "../config";

@Global()
@Module({
    providers: [
        {
            provide: LoggerService,
            useValue: new LoggerService(
                config.LOGGING_LEVEL,
                "loggingService",
                [LoggerTransport.CONSOLE]
            )
        }
    ],
    exports: [LoggerService]
})
export class LoggerModule {}
