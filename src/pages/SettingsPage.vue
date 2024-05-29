<template>
  <div>
    <the-header/>
    <v-select
        v-model="currencyStore.selectedPair"
        :items="currencyStore.pairs"
        label="Выберите валютную пару"
        variant="outlined"
        class="ma-4"
    ></v-select>
    <div v-if="currencyStore.pairLog.length > 0" class="ma-4">
      <h3>Лог изменений валютной пары</h3>
      <ul>
        <li v-for="log in currencyStore.pairLog" :key="log.id" class="no-bullets">
          Изменение с {{ log.from }} на {{ log.to }} - {{ log.timestamp }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {watch} from "vue";
import {useCurrencyStore} from "../stores/currency";

const currencyStore = useCurrencyStore();
watch(() => currencyStore.selectedPair, (newVal, oldVal) => {
  const timestamp = new Date().toLocaleString();
  currencyStore.pairLog.push({
    id: `${oldVal}_${newVal}_${timestamp}`,
    from: oldVal,
    to: newVal,
    timestamp: timestamp
  });
})
</script>
<style lang="scss">
.no-bullets {
  list-style-type: none;
}
</style>
