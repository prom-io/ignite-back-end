import {Between, EntityRepository, In, LessThan, MoreThan, Repository, SelectQueryBuilder} from "typeorm";
import {HashTag, Status, StatusAdditionalInfo, StatusInfoMap, StatusLike, StatusReferenceType} from "./entities";
import {Language, User} from "../users/entities";
import { PaginationRequest, calculateOffset } from "../utils/pagination";
import { MEMEZATOR_HASHTAG } from "../common/constants";
import {StatusesRepository} from "./StatusesRepository"

@EntityRepository(Status)
export class StatusesWithoutMemesRepository extends Repository<Status> {
    constructor(private statusesRepository: StatusesRepository){
        super();
    }

    public async findByAuthorInAndCreatedAtBefore(authors: User[], createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."authorId" in (:...authors) `, {authors: authors.map(user => user.id)})
                    .andWhere(`status."createdAt" < :createdAt`, {createdAt: createdAt})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findByAuthorInAndCreatedAfter(authors: User[], createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."authorId" in (:...authors) `, {authors: authors.map(user => user.id)})
                    .andWhere(`status."createdAt" > :createdAt`, {createdAt: createdAt})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findByAuthorInAndCreatedAtBetween(
        authors: User[], 
        createdAtBefore: Date, 
        createdAtAfter: Date, 
        paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."authorId" in (:...authors) `, {authors: authors.map(user => user.id)})
                    .andWhere(`status."createdAt" between(:createdAtBefore, :createdAtAfter)`, {createdAtBefore, createdAtAfter})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findByCreatedAtBetween( 
        createdAtBefore: Date, 
        createdAtAfter: Date, 
        paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."createdAt" between(:createdAtBefore, :createdAtAfter)`, {createdAtBefore, createdAtAfter})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findByCreatedAtBefore(createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."createdAt" < :createdAt`, {createdAt: createdAt})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findByCreatedAtAfter(createdAt: Date, paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."createdAt" > :createdAt`, {createdAt: createdAt})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findByAuthorIn(authors: User[], paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .andWhere(`status."authorId" in (:...authors) `, {authors: authors.map(user => user.id)})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }

    public async findAllBy(paginationRequest: PaginationRequest): Promise<Status[]> {
        return  await this.statusesRepository.createStatusQueryBuilder()
                    .where(`"filteredHashTag"."name" != :hashTag`, {hashTag: MEMEZATOR_HASHTAG})
                    .orderBy(`status."createdAt"`, "DESC")
                    .offset(calculateOffset(paginationRequest.page, paginationRequest.pageSize))
                    .limit(paginationRequest.pageSize)
                    .getMany();
    }
}