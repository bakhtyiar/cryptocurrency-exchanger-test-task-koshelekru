import {IOrderBook} from "../../entities/orderBook";

export async function getOrderBook(symbol: string, limit?: number): Promise<IOrderBook> {
    let query = `${import.meta.env.VITE_BINANCE_URL_API_V3}/depth`
    query += `?symbol=${symbol}`
    if (limit) {
        query += `&limit=${limit}`
    }
    return await fetch(query).then(response => response.json())
}

export function openWebsocketOrderBookDifferences(symbol: string, frequency?: 100 | 1000) {
    let query = `${import.meta.env.VITE_BINANCE_URL_API_WS}/${symbol.toLowerCase()}@depth`;
    if (frequency) {
        query += `@${frequency}ms`
    } else {
        query += `@${1000}ms`
    }
    const wsocket = new WebSocket(query);
    window.onbeforeunload = function () {
        wsocket.onclose = function () {
        };
        wsocket.close();
    };
    return wsocket;
}
