import {TOrderRecord} from "./orderRecord";

export interface IOrderBook {
    "lastUpdateId": number,
    "bids": TOrderRecord[],
    "asks": TOrderRecord[],
}
