import {IOrderBook} from "../../entities/orderBook";

export async function getOrderBook(symbol: string, limit?: number): Promise<IOrderBook> {
    let query = `${import.meta.env.VITE_BINANCE_URL_API_V3}/depth`
    query += `?symbol=${symbol}`
    if (limit) {
        query += `&limit=${limit}`
    }
    return await fetch(query).then(response => response.json())
}
