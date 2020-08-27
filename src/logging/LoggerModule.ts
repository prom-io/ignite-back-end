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
                [
                    LoggerService.console({
                        timeFormat: "HH:mm",
                        consoleOptions: {
                            level: "info",
                        },
                    }),
                    LoggerService.rotate({
                        colorize: false,
                        fileOptions: {
                            filename: "logs/%DATE%.log",
                            level: "info",
                            json: true,
                        },
                    })
                ]
            )
        }
    ],
    exports: [LoggerService]
})
export class LoggerModule {}
