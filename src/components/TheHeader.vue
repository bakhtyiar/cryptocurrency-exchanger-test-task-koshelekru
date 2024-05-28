<template>
  <v-toolbar>
    <v-toolbar-title>
      <router-link :to="indexRoute">
        <v-img
          height="48"
          src="@/assets/logo.png"
          width="48"
        />
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <router-link :to="settingsRoute">
      <v-btn text>Настройки</v-btn>
    </router-link>
    <router-link :to="orderBookRoute">
      <v-btn text>Order Book</v-btn>
    </router-link>
  </v-toolbar>
</template>

<script lang="ts" setup>
//
import {indexRoute, orderBookRoute, settingsRoute} from "../constants/routes";
</script>
