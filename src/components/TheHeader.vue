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
    <router-link :to="settingsRoute" class="mr-4">
      Настройки
    </router-link>
    <router-link :to="orderBookRoute" class="mr-4">
      Order Book
    </router-link>
  </v-toolbar>
</template>

<script lang="ts" setup>
//
import {indexRoute, orderBookRoute, settingsRoute} from "../routing/routes";
</script>
