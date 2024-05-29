import {TOrderRecord} from "./orderRecord";

export interface IOrderBookUpdateRecord {
    "e": string, // Event type eg "depthUpdate"
    "E": number, // Event time eg 1672515782136
    "s": string,      // Symbol eg "BNBBTC"
    "U": number,           // First update ID in event eg 157
    "u": number,           // Final update ID in event eg 160
    "b": TOrderRecord[], // Bids to be updated
    "a": TOrderRecord[],              // Asks to be updated
}
