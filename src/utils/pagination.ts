import {Expose, Transform} from "class-transformer";

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

export const getValidPageSize = (pageSize?: string | number, fallback: number = 50): number => {
    let returnedPageSize = Number(pageSize);

    if (isNaN(returnedPageSize) || returnedPageSize < 1) {
        returnedPageSize = fallback
    }

    return returnedPageSize;
};

export const calculateOffset = (page: number, pageSize: number): number => (page - 1) * pageSize;

export class PaginationRequest {
    @Transform(value => getValidPage(value))
    page: number = 1;

    @Expose({name: "page_size"})
    @Transform(value => getValidPageSize(value))
    pageSize: number = 30;

    constructor(page: number | string = 1, pageSize: number | string = 30) {
        this.page = getValidPage(page);
        this.pageSize = getValidPageSize(pageSize);
    }
}
