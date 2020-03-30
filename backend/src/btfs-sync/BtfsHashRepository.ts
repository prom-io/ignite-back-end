import {EntityRepository, Repository} from "typeorm";
import {BtfsHash} from "./entities";

@EntityRepository(BtfsHash)
export class BtfsHashRepository extends Repository<BtfsHash> {

    public findByBtfsCid(btfsCid: string): Promise<BtfsHash | undefined> {
        return this.findOne({
            btfsCid
        })
    }

    public findAllNotSynced(): Promise<BtfsHash[]> {
        return this.find({
            synced: false
        })
    }

    public async existsByBtfsCid(btfsCid: string): Promise<boolean> {
        return (await this.count({btfsCid})) !== 0;
    }
}
