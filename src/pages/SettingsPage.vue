<template>
  <div>
    <the-header/>
    <v-select
        v-model="currencyStore.selectedPair"
        :items="currencyStore.pairs"
        label="Выберите валютную пару"
    ></v-select>
    <div v-if="currencyStore.pairLog.length > 0">
      <h3>Лог изменений валютной пары</h3>
      <ul>
        <li v-for="log in currencyStore.pairLog" :key="log.id">
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
  // Вызов метода restapi для обновления данных в store
  updateCurrencyData(newVal);
  // Подключение по WebSocket для обновления данных по валютной паре
  connectToWebSocket(newVal);
})

// Метод для обновления данных в store с использованием restapi
function updateCurrencyData(newCurrencyPair) {
  // Реализация обновления данных в store с использованием restapi
}

// Метод для подключения по WebSocket для обновления данных по валютной паре
function connectToWebSocket(currencyPair) {
  // Реализация подключения по WebSocket для обновления данных по валютной паре
}
</script>
