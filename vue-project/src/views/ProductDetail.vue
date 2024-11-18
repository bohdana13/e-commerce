<template>
  <div>
    <v-btn
      @click="router.push({ name: 'Catalog' })"
      color="primary"
      variant="elevated">
      Back to catalog
    </v-btn>

    <div v-if="selectedProduct" class="product">
      <div class="product-image">
        <img :src="selectedProduct.image" alt="Product image">
      </div>
      <div class="product-details">
        <p>Title: {{ selectedProduct.title }}</p>
        <p>Description: {{ selectedProduct.description }}</p>
        <h2>Price: ${{ selectedProduct.price }}</h2>
        <v-btn
          variant="elevated"
          color="indigo-lighten-3"
          @click="addToCart"
        >Add to cart</v-btn>
      </div>
    </div>

    <div v-else>
      <p>Product not found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { productsStore } from "../stores/products";
import { useRoute, useRouter } from "vue-router";

const store = productsStore();
const router = useRouter();
const route = useRoute();

const selectedProduct = computed(() => {
  return store.products.find((item) => item.id === Number(route.params.id));
});

const addToCart = () => {
  if (selectedProduct.value) {
    store.addToCart(selectedProduct.value);
    router.push({ name: 'CartView' });
  }
};
</script>

<style scoped>
.product {
  display: flex;
  margin-top: 50px;
}

.product-image {
  margin-right: 24px;
}
</style>
