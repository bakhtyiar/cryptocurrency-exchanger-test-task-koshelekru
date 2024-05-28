import { defineStore } from 'pinia'
import {computed, nextTick, ref} from "vue";
import {useInitializeStore} from "../composables/useInitializeStore";
import {getOrderBook} from "../services/binanceAPI/binanceAPI";
import {useCurrencyStore} from "./currency";
export const useOrderBookStore = function(id: string = 'index') {
    const definedStore = defineStore('orderBookStore_' + id, baseOrderBookStore);
    return definedStore();
}

const baseOrderBookStore = () => {
    const orderBook = ref();
    const lastUpdateId = computed(() => orderBook.value.lastUpdateId);
    const bids = computed(() => orderBook.value?.bids);
    const asks = computed(() => orderBook.value?.asks);

    const currencyStore = useCurrencyStore();
    const { initialized, loading } = useInitializeStore(async () => {
        orderBook.value = await getOrderBook(currencyStore.selectedPair);
    });

    return {
        initialized,
        loading,
        orderBook,
        lastUpdateId,
        bids,
        asks,
    }
}
