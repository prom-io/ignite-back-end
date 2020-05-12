import {Body, Controller, HttpCode, HttpStatus, Post, Get, UseInterceptors, ClassSerializerInterceptor} from "@nestjs/common";
import {BtfsService} from "./BtfsService";
import {CreateBtfsCidRequest} from "./types/request";
import {BtfsHashResponse} from "./types/response";

@Controller("api/v3/btfs")
export class BtfsController {
    constructor(private readonly btfsService: BtfsService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    public async createBtfsCid(@Body() createBtfsCidRequest: CreateBtfsCidRequest): Promise<void> {
        await this.btfsService.createBtfcCid(createBtfsCidRequest);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public getAllBtfsCids(): Promise<BtfsHashResponse[]> {
        return this.btfsService.getAllBtfsCids();
    }
}
