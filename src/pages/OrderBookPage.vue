<template>
  <div class="d-flex flex-column h-screen">
    <the-header/>
    <v-container class="flex-grow-1 h-0 pa-0">
      <v-select v-model="itemsPerPage" :hide-details="true" :items="pageOptions" class="mt-4 ml-0 w-auto"
                label="Rows per page" variant="outlined"></v-select>
      <v-row class="flex-grow-1 h-75 ma-0">
        <v-col class="flex-grow-1 h-100 pl-0" cols="12" sm="6">
          <v-data-table-virtual :fixed-header="true" :headers="headers" :items="bids"
                        :items-per-page="itemsPerPage"
                        class="flex-grow-1 h-100" density="compact" item-key="id">
            <template v-slot:top>
              <v-toolbar class="d-flex align-center justify-space-between" flat>
                <v-toolbar-title>Bids</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:bottom>
            </template>
          </v-data-table-virtual>
        </v-col>
        <v-col class="flex-grow-1 h-100 pl-0 pr-0" cols="12" sm="6">
          <v-data-table-virtual :fixed-header="true" :headers="headers" :items="asks" :items-per-page="itemsPerPage"
                        class="flex-grow-1 h-100"
                        density="compact" item-key="id">
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Asks</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
            </template>
            <template v-slot:bottom>
            </template>
          </v-data-table-virtual>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useOrderBookStore} from "../stores/orderBook";
import {useDisplay} from "vuetify";
import {storeToRefs} from "pinia";

const orderBookStore = useOrderBookStore();
const {amountLimit} = storeToRefs(orderBookStore);
const display = useDisplay();
let initialHeaders = [];
initialHeaders.push({title: 'Price', value: 'price'});
if (!display.mobile.value && !display.smAndDown.value) {
  initialHeaders.push({title: 'Quantity', value: 'quantity'});
}
initialHeaders.push({title: 'Total', value: 'total'});
const headers = ref(initialHeaders);

const bids = computed(() => {
  orderBookStore.bids;
  if (!orderBookStore.initialized) return undefined;
  return orderBookStore.bids?.map(bid => ({
    price: bid[0],
    quantity: bid[1],
    total: Number(bid[0]) * Number(bid[1])
  }));
})
const asks = computed(() => {
  orderBookStore.asks;
  if (!orderBookStore.initialized) return undefined;
  return orderBookStore.asks?.map(ask => ({
    price: ask[0],
    quantity: ask[1],
    total: Number(ask[0]) * Number(ask[1])
  }));
})
const itemsPerPage = ref(amountLimit);
const pageOptions = ref([100, 500, 1000]);

onMounted(async () => {
  if (!orderBookStore.initialized) {
    await orderBookStore.initialize()
  }
})
onBeforeUnmount(() => {
  orderBookStore.unsubscribeFromDiff();
})
</script>
<style lang="scss">
</style>
