<template>
  <div class="cart-page">
    <h1 class="text-center mb-4">Your Cart</h1>

    <v-container v-if="cart.length">
      <v-row dense justify="center">
        <v-col v-for="item in cart" :key="item.id" cols="12" sm="6" md="4" lg="3">
          <v-card class="mx-2 my-3" outlined>
            <v-img :src="item.image" height="200" class="mb-2"></v-img>
            <v-card-title class="headline text-truncate">{{ item.title }}</v-card-title>
            <v-card-subtitle class="price-text">Price: ${{ item.price }}</v-card-subtitle>
            <v-card-actions class="d-flex justify-space-between">
              <v-btn text color="error" @click="removeFromCart(item)">Remove</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <div class="total-section d-flex justify-space-between align-center">
        <h3>Total:</h3>
        <h3 class="total-price">${{ cartTotal }}</h3>
      </div>
    </v-container>

    <div v-else class="text-center">
      <h3>Your cart is empty!</h3>
      <v-btn color="primary" @click="goBackToCatalog">Go to Catalog</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CartView',
  setup() {
    const cart = ref<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));
    const router = useRouter();

    const removeFromCart = (item: any) => {
      const index = cart.value.findIndex(cartItem => cartItem.id === item.id);
      if (index !== -1) {
        cart.value.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    };

    const cartTotal = computed(() => {
      return cart.value.reduce((total, item) => total + item.price, 0).toFixed(2);
    });

    const goBackToCatalog = () => {
      router.push({ name: 'Catalog' });
    };

    return {
      cart,
      cartTotal,
      removeFromCart,
      goBackToCatalog
    };
  }
});
</script>

<style scoped>
.cart-page {
  margin: 20px auto;
  max-width: 100%;
  padding: 0 20px;
}

.v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.v-card-title {
  font-size: 1.2rem;
  font-weight: bold;
}

.price-text {
  font-size: 1rem;
  color: #444;
}

.total-section {
  padding: 10px 20px;
  font-weight: bold;
}

.total-price {
  color: #1976d2;
}

@media (min-width: 1200px) {
  .cart-page {
    max-width: 1200px;
  }
}

.text-center {
  margin-top: 40px;
}
</style>
