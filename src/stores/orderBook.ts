import {defineStore, storeToRefs} from 'pinia'
import {computed, reactive, ref, toValue, watch} from "vue";
import {getOrderBook, openWebsocketOrderBookDifferences} from "../services/binanceAPI/binanceAPI";
import {useCurrencyStore} from "./currency";
import {IOrderBookUpdateRecord} from "../entities/orderBookUpdateRecord";
import {TOrderRecord} from "../entities/orderRecord";
import {IOrderBook} from "../entities/orderBook";
import {waitForOpenConnection} from "../utilities/websocket/waitForOpenConnection";
import {waitForClosedConnection} from "../utilities/websocket/waitForClosedConnection";

export const useOrderBookStore = function (id: string = 'index') {
    const definedStore = defineStore('orderBookStore_' + id, baseOrderBookStore);
    return definedStore();
}

const asksMinAmount = 50;
const bidsMinAmount = 50;

const baseOrderBookStore = () => {
    const orderBook = reactive<IOrderBook>({
        lastUpdateId: undefined,
        bids: undefined,
        asks: undefined,
    });
    const lastUpdateId = computed<number>({
        get() {
            return orderBook.lastUpdateId;
        },
        set(newValue) {
            orderBook.lastUpdateId = newValue;
        }
    });
    const bids = computed<TOrderRecord[]>({
        get() {
            return orderBook.bids;
        },
        set(newValue) {
            orderBook.bids = newValue;
        }
    });
    const asks = computed<TOrderRecord[]>({
        get() {
            return orderBook.asks;
        },
        set(newValue) {
            orderBook.asks = newValue;
        }
    });
    const updatesBuffer = ref([]);
    let currentProcessedEvent = undefined;
    const amountLimit = ref<number>(100);
    watch(amountLimit, async (newVal) => {
        loading.value = true;
        await fetchData(toValue(newVal));
        loading.value = false;
    })

    const currencyStore = useCurrencyStore();
    const {selectedPair} = storeToRefs(currencyStore);
    watch(selectedPair, async () => {
        if (initialized.value && !loading.value) {
            loading.value = true;
            await fetchData(toValue(amountLimit));
            loading.value = false;
        }
    })
    let wsocket: WebSocket;
    let initialized = ref<boolean>(false);
    let loading = ref<boolean>(false);

    async function initialize() {
        loading.value = true;
        await fetchData(toValue(amountLimit));
        initialized.value = true;
        loading.value = false;
    }
    async function fetchData(amountLimit: number) {
        updatesBuffer.value = [];
        currentProcessedEvent = undefined;
        loading.value = true;
        if (!wsocket || wsocket.readyState === wsocket.CLOSED) {
            await subscribeToDiff();
        } else if (wsocket.readyState === wsocket.CLOSING) {
            await waitForClosedConnection(wsocket)
            await subscribeToDiff();
        } else {
            unsubscribeFromDiff();
            await subscribeToDiff();
        }
        await waitForOpenConnection(wsocket);
        const snapshotREST = await getOrderBook(toValue(selectedPair), amountLimit);
        for (let key in orderBook) {
            if (orderBook.hasOwnProperty(key)) {
                delete orderBook[key];
            }
        }
        Object.assign(orderBook, snapshotREST);
        processBuffer();
        loading.value = false;
    }

    async function subscribeToDiff() {
        wsocket = openWebsocketOrderBookDifferences(toValue(selectedPair));
        wsocket.onopen = async function open() {
            console.log('Opened diff depth orderBook stream.');
        };
        wsocket.onmessage = async function incoming(data: MessageEvent<string>) {
            const payload: IOrderBookUpdateRecord = JSON.parse(data.data);
            if (payload.e !== "depthUpdate") {
                return
            }
            if (payload.s.toLowerCase() !== toValue(selectedPair).toLowerCase()) {
                return;
            }
            if (lastUpdateId.value && payload.u <= lastUpdateId.value) {
                return;
            }
            updatesBuffer.value.push(payload);
            if (initialized.value) {
                processBuffer();
                if (orderBook.bids.length < bidsMinAmount || orderBook.asks.length < asksMinAmount) {
                    loading.value = true;
                    await fetchData(toValue(amountLimit));
                    loading.value = false;
                }
            }
        };
        wsocket.onclose = function close() {
            console.log('Closed diff depth orderBook stream.');
        };
        wsocket.onerror = function error(error) {
            console.error('Failed diff depth orderBook stream: ', error);
        };
        return wsocket;
    }

    function unsubscribeFromDiff() {
        if (wsocket) wsocket.close();
        wsocket = undefined;
    }

    function processBuffer() {
        for (let i = 0; i < updatesBuffer.value.length; i++) {
            if (!currentProcessedEvent && lastUpdateId.value && updatesBuffer.value[i].U <= lastUpdateId.value + 1 && lastUpdateId.value + 1 <= updatesBuffer.value[i].u) {
                currentProcessedEvent = updatesBuffer.value[i];
                processUpdate(updatesBuffer.value[i])
                if (0 < i) {
                    updatesBuffer.value.splice(0, i);
                    i = 0;
                }
            }
            if (currentProcessedEvent && currentProcessedEvent.u + 1 === updatesBuffer.value[i].U) {
                currentProcessedEvent = updatesBuffer.value[i];
                processUpdate(updatesBuffer.value[i])
                if (0 < i) {
                    updatesBuffer.value.splice(0, i);
                    i = 0;
                }
            }
        }
    }

    function processUpdate(payload: IOrderBookUpdateRecord) {
        let localBids = bids.value;
        payload.b.forEach(gotBid => {
            if (Number(gotBid[1]) == 0) {
                localBids = localBids.filter(localBid => {
                    return gotBid[0] != localBid[0];
                })
            } else {
                localBids.forEach(item => {
                    if (item[0] == gotBid[0]) {
                        item[1] = gotBid[1];
                    }
                })
            }
        })
        bids.value = localBids;
        let localAsks = asks.value;
        payload.a.forEach(gotAsk => {
            if (Number(gotAsk[1]) == 0) {
                localAsks = localAsks.filter(localAsk => gotAsk[0] != localAsk[0])
            } else {
                localAsks.forEach(item => {
                    if (item[0] == gotAsk[0]) {
                        item[1] = gotAsk[1];
                    }
                })
            }
        })
        asks.value = localAsks;
    }

    return {
        initialize,
        initialized,
        loading,
        orderBook,
        lastUpdateId,
        bids,
        asks,
        amountLimit,
        updatesBuffer,
        subscribeToDiff,
        unsubscribeFromDiff
    }
}
