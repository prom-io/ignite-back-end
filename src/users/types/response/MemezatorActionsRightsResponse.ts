import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class MememzatorActionsRightsResponse {
    @ApiProperty()
    can_create: true;
    @ApiPropertyOptional()
    cannot_create_reason_code: null; 
    @ApiProperty()
    can_vote: true;
    @ApiPropertyOptional()
    cannot_vote_reason_code: null 
}