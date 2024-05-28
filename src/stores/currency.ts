import { defineStore } from 'pinia'
import {ref} from "vue";
export const useCurrencyStore = function(id: string = 'index') {
  const definedStore = defineStore('currenciesStore_' + id, baseCurrencyStore);
  return definedStore();
}

const baseCurrencyStore = () => {
  const selectedPair = ref('BTCUSDT');
  const pairs = ref(['BTCUSDT', 'BNBBTC', 'ETHBTC']);
  const pairLog = ref([]);

  return {
    selectedPair,
    pairs,
    pairLog,
  }
}
