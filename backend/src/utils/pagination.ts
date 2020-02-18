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

export interface PaginationRequest {
    page: number,
    pageSize: number
}
