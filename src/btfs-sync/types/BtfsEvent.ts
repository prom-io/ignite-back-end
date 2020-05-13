import {BtfsEventType} from "./BtfsEventType";

export interface BtfsEvent<P> {
    type: BtfsEventType,
    payload: P
}
