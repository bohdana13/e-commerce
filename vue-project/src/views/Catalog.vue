<template>
  <div class="products-list">
    <v-text-field v-model="search" clearable label="Search products"></v-text-field>
    <v-row>
      <v-col cols="6" sm="3">
        <v-text-field v-model="minPrice" type="number" label="Min Price" clearable></v-text-field>
      </v-col>
      <v-col cols="6" sm="3">
        <v-text-field v-model="maxPrice" type="number" label="Max Price" clearable></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select 
          v-model="selectedCategory" 
          :items="categories" 
          label="Select Category" 
          clearable>
        </v-select>
      </v-col>
      <v-col cols="12" sm="3">
        <v-btn @click="clearFilters">All Products</v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col
          v-for="product in paginatedProducts"
          :key="product.id"
          cols="12"
          sm="4"
      >
        <product-item
            :product-data="product"
            @item-clicked="goToProductPage"
        />
        <v-icon 
          class="favorite-icon" 
          :color="isFavorite(product) ? 'red' : 'grey'" 
          @click="toggleFavorite(product)"
        >mdi-heart</v-icon>
      </v-col>
    </v-row>

    <div class="pagination">
      <v-btn @click="previousPage" :disabled="currentPage === 1">Previous</v-btn>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <v-btn @click="nextPage" :disabled="currentPage === totalPages">Next</v-btn>
    </div>

    <div class="favorites">
      <h3>Favorites</h3>
      <v-row>
        <v-col
          v-for="favorite in favorites"
          :key="favorite.id"
          cols="12"
          sm="4"
        >
          <product-item
              :product-data="favorite"
              @item-clicked="goToProductPage"
          />
          <v-icon 
            class="favorite-icon" 
            color="red" 
            @click="toggleFavorite(favorite)"
          >mdi-heart</v-icon>
        </v-col>
      </v-row>
    </div>

    <div class="cart">
      <h3>Cart</h3>
      <v-row>
        <v-col
          v-for="item in cart"
          :key="item.id"
          cols="12"
          sm="4"
        >
          <product-item
              :product-data="item"
              @item-clicked="goToProductPage"
          />
          <v-btn @click="removeFromCart(item.id)">Remove from Cart</v-btn>
        </v-col>
      </v-row>
    </div>

    <footer class="team-footer">
      <div class="container mx-auto py-4 text-center">
        <h4 class="font-bold text-lg mb-3">Team Members</h4>
        <ul class="list-none">
          <li v-for="student in students" :key="student.id" class="mb-2">
            <a :href="student.github" target="_blank" class="text-blue-500 hover:underline">
              {{ student.name }} - {{ student.group }}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductItem from "../components/ProductItem.vue";
import { computed, ref, onMounted, watch } from "vue";
import { productsStore } from "../stores/products";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: 'CatalogView',
  components: {
    ProductItem
  },
  setup() {
    const store = productsStore();
    const router = useRouter();
    const route = useRoute();

    const search = ref<string>(typeof route.query.search === 'string' ? route.query.search : '');
    const minPrice = ref<string>(typeof route.query.minPrice === 'string' ? route.query.minPrice : '');
    const maxPrice = ref<string>(typeof route.query.maxPrice === 'string' ? route.query.maxPrice : '');
    const selectedCategory = ref<string>(typeof route.query.category === 'string' ? route.query.category : '');
    const currentPage = ref<number>(Number(route.query.page) || 1);
    const productsPerPage = 10;

    const favorites = ref<any[]>(JSON.parse(localStorage.getItem('favorites') || '[]'));
    const cart = ref<any[]>(JSON.parse(localStorage.getItem('cart') || '[]'));

    const students = ref([
      { id: 1, name: 'Mamontova Tetiana', group: '343-2', github: 'https://github.com/tani4kaa' },
      { id: 2, name: 'Redko Bohdana', group: '343-2', github: 'https://github.com/bohdana13' },
      { id: 3, name: 'Rotar Elizabeth', group: '343-2', github: 'https://github.com/BessieLili' }
    ]);

    const categories = computed(() => {
      return Array.from(new Set(store.products.map(product => product.category)));
    });

    const goToProductPage = (id: number) => {
      router.push({ name: 'ProductView', params: { id } });
    };

    const filteredProducts = computed(() => {
      return store.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(search.value.toLowerCase());
        const matchesCategory = selectedCategory.value ? product.category === selectedCategory.value : true;
        const matchesPrice = 
          (!minPrice.value || product.price >= Number(minPrice.value)) &&
          (!maxPrice.value || product.price <= Number(maxPrice.value));

        return matchesSearch && matchesCategory && matchesPrice;
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / productsPerPage);
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * productsPerPage;
      const end = start + productsPerPage;
      return filteredProducts.value.slice(start, end);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        updateQueryParams();
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        updateQueryParams();
      }
    };

    const clearFilters = () => {
      search.value = '';
      minPrice.value = '';
      maxPrice.value = '';
      selectedCategory.value = '';
      currentPage.value = 1;
      updateQueryParams();
    };

    const toggleFavorite = (product: any) => {
      const index = favorites.value.findIndex(fav => fav.id === product.id);
      if (index !== -1) {
        favorites.value.splice(index, 1);
      } else {
        favorites.value.push(product);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites.value));
    };

    const isFavorite = (product: any) => {
      return favorites.value.some(fav => fav.id === product.id);
    };

    const addToCart = (product: any) => {
      if (!cart.value.find(item => item.id === product.id)) {
        cart.value.push(product);
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    };

    const removeFromCart = (id: number) => {
      const index = cart.value.findIndex(item => item.id === id);
      if (index !== -1) {
        cart.value.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart.value));
      }
    };

    const updateQueryParams = () => {
      router.replace({
        query: {
          search: search.value || undefined,
          minPrice: minPrice.value || undefined,
          maxPrice: maxPrice.value || undefined,
          category: selectedCategory.value || undefined,
          page: currentPage.value !== 1 ? currentPage.value : undefined
        }
      });
    };

    watch(
      cart,
      (newCart) => {
        localStorage.setItem('cart', JSON.stringify(newCart));
      },
      { deep: true }
    );

    onMounted(async () => {
      await store.fetchProductsFromDB();
      cart.value = JSON.parse(localStorage.getItem('cart') || '[]');
    });

    return {
      search,
      minPrice,
      maxPrice,
      selectedCategory,
      categories,
      goToProductPage,
      paginatedProducts,
      currentPage,
      totalPages,
      nextPage,
      previousPage,
      clearFilters,
      toggleFavorite,
      isFavorite,
      favorites,
      cart,
      addToCart,
      removeFromCart,
      students
    };
  }
});
</script>

<style scoped>
.products-list {
  margin: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination v-btn {
  margin: 0 10px;
}

.favorites {
  margin-top: 40px;
}

.cart {
  margin-top: 40px;
}

.favorite-icon {
  cursor: pointer;
  font-size: 24px;
}

.team-footer {
  background-color: #f8f9fa;
  padding: 20px 0;
}

.team-footer ul {
  padding: 0;
}

.team-footer li {
  list-style-type: none;
}
</style>
