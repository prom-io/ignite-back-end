import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BinanceChainSynchronizerModule} from "./binance-chain-syncrhonizer";
import {entities} from "./typeorm-entities";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      logging: false,
      entities,
      synchronize: false
    }),
      BinanceChainSynchronizerModule
  ],
})
export class AppModule {}
