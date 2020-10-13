import { IsBoolean } from 'class-validator';
import { Expose } from 'class-transformer';

export class CheckSubscriptionToCommunity {

    @Expose()
    @IsBoolean()
    isSubscribedToCommunity: boolean
}