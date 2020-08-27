import { Repository, EntityRepository } from "typeorm";
import { MemezatorContestResult } from "./entities/MemezatorContestResult";

@EntityRepository(MemezatorContestResult)
export class MemezatorContestResultRepository extends Repository<MemezatorContestResult> {}
