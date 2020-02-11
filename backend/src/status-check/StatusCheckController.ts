import {Controller, Get} from "@nestjs/common";

@Controller("api/v1/status")
export class StatusCheckController {

    @Get()
    public getStatus(): {status: string} {
        return {status: "UP"};
    }
}
