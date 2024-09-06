<template>
  <v-row class="d-flex justify-center">
    در حال بارگزاری...
  </v-row>
</template>

<script setup>

import {navigateTo, useCookie} from "#app";
import {onBeforeMount}         from 'vue';

onBeforeMount(() => {
  const user = useCookie('user');
  if (user.value) {
    navigateTo('/messenger');
  } else {
    navigateTo('/login');
  }
});

</script>

<style scoped>

</style>
