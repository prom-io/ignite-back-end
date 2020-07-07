import {Global, Module} from "@nestjs/common";
import {LoggerService} from "nest-logger";

@Global()
@Module({
    providers: [
        {
            provide: LoggerService,
            useFactory: () => {
                const loggers = [
                    LoggerService.console({
                        consoleOptions: {
                            level: "debug"
                        }
                    })
                ];
                return new LoggerService(
                    "debug",
                    loggers
                );
            }
        }
    ],
    exports: [LoggerService]
})
export class LoggerModule {
}
