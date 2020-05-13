import {IsInt, IsPositive} from "class-validator";
import {Transform} from "class-transformer";

export const getValidPage = (page?: string | number, fallback: number = 1, startFromZero: boolean = false): number => {
    let returnedPage = Number(page);

    if (startFromZero) {
        if (isNaN(returnedPage) || returnedPage < 0) {
            returnedPage = fallback;
        }
    } else {
        if (isNaN(returnedPage) || returnedPage < 1) {
            returnedPage = fallback;
        }
    }

    return returnedPage;
};

export const getValidPageSize = (pageSize?: string | number, fallback: number = 500): number => {
    let returnedPageSize = Number(pageSize);

    if (isNaN(returnedPageSize) || returnedPageSize < 1) {
        returnedPageSize = fallback
    }

    return returnedPageSize;
};

export const calculateOffset = (page: number, pageSize: number): number => (page - 1) * pageSize;

export class PaginationRequest {
    @IsInt({message: "Page must be integer number"})
    @IsPositive({message: "Page must be positive"})
    @Transform(value => Number(value))
    page: number = 1;

    @IsInt({message: "Page size must be integer number"})
    @IsPositive({message: "Page size must be positive"})
    @Transform(value => Number(value))
    pageSize: number = 30;

    constructor(page: number = 1, pageSize: number = 30) {
        this.page = page;
        this.pageSize = pageSize;
    }
}
