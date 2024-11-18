<template>
  <div>
    <header v-if="route.name !== 'NotFound'">
      <v-toolbar title="Application">
      
      </v-toolbar>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { productsStore } from './stores/products';

const router = useRouter();
const route = useRoute();
const store = productsStore();
</script>

<style scoped>
.cart-items {
  text-align: end;
  padding: 16px;
  font-weight: bold;
  font-size: 24px;
  cursor: pointer;
}
</style>