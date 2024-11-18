<template>
  <div class="products-list">
    <v-container>
    <v-container class="cart-button-container">
      <v-btn color="primary" class="ma-4" large @click="goToCartPage">
        View Cart ({{ cart.length }})
      </v-btn>
      <v-btn color="primary" class="ma-4" large @click="goToFavoritesPage">
    View Favorites
  </v-btn>
    </v-container>
    
      <v-row class="mb-4" align="center">
        <v-col cols="12" sm="4">
          <v-text-field 
            v-model="search" 
            clearable 
            label="Search Products" 
            outlined
            class="ma-2"
          />
        </v-col>

        <v-col cols="6" sm="3">
          <v-text-field 
            v-model="minPrice" 
            type="number" 
            label="Min Price" 
            clearable 
            outlined
            class="ma-2"
          />
        </v-col>
        <v-col cols="6" sm="3">
          <v-text-field 
            v-model="maxPrice" 
            type="number" 
            label="Max Price" 
            clearable 
            outlined
            class="ma-2"
          />
        </v-col>

        
        <v-col cols="12" sm="4">
          <v-select 
            v-model="selectedCategory" 
            :items="categories" 
            label="Category" 
            clearable 
            outlined
            class="ma-2"
          />
        </v-col>

        <v-col cols="12" sm="2">
          <v-btn color="secondary" @click="clearFilters" class="ma-2">
            Reset Filters
          </v-btn>
        </v-col>
      </v-row>
    </v-container>


    <v-row no-gutters>
      <v-col
        v-for="product in paginatedProducts"
        :key="product.id"
        cols="12"
        sm="4"
      >
        <v-card
          class="mx-2 my-3"
          outlined
        >
          <v-img
            :src="product.image"
            height="150"
            class="mb-2"
          ></v-img>
          <v-card-title class="headline">{{ product.title }}</v-card-title>
          <v-card-subtitle>\${{ product.price }}</v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="addToCart(product)">Add to Cart</v-btn>
            <v-icon 
              class="favorite-icon ml-auto" 
              :color="isFavorite(product) ? 'red' : 'grey'" 
              @click="toggleFavorite(product)">
              mdi-heart
            </v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <div class="pagination mt-4">
      <v-btn icon @click="previousPage" :disabled="currentPage === 1">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <v-btn icon @click="nextPage" :disabled="currentPage === totalPages">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>


    

    <footer class="team-footer text-center pa-4">
      <h4 class="font-weight-bold mb-3">Meet Our Team</h4>
      <v-row justify="center">
        <v-col 
          v-for="student in students" 
          :key="student.id" 
          cols="12" 
          sm="4"
          class="text-center">
          <a :href="student.github" target="_blank" class="text-decoration-none">
            <v-avatar size="80" class="mb-2">
              <v-icon color="primary">mdi-account-circle</v-icon>
            </v-avatar>
            <p class="mb-0">{{ student.name }}</p>
            <p class="text-muted">{{ student.group }}</p>
          </a>
        </v-col>
      </v-row>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { computed, ref, onMounted, watch } from "vue";
import { productsStore } from "../stores/products";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: 'CatalogView',
  setup() {
    const store = productsStore();
    const router = useRouter();
    const route = useRoute();

    const search = ref<string>('');
    const minPrice = ref<string>('');
    const maxPrice = ref<string>('');
    const selectedCategory = ref<string>('');
    const currentPage = ref<number>(1);
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
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};


    const clearFilters = () => {
      search.value = '';
      minPrice.value = '';
      maxPrice.value = '';
      selectedCategory.value = '';
      currentPage.value = 1;
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

    const goToCartPage = () => {
      router.push({ name: 'CartView' });
    };
    const goToFavoritesPage = () => {
  router.push({ name: 'FavoritesView' });
};

    onMounted(async () => {
      await store.fetchProductsFromDB();
    });

    return {
      search,
      minPrice,
      maxPrice,
      selectedCategory,
      categories,
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
      students,
      goToCartPage,
        goToFavoritesPage,

    };
  }
});
</script>

<style scoped>
.products-list {
  margin: 20px auto;
  max-width: 1200px;
}

.v-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.favorite-icon:hover {
  cursor: pointer;
  transform: scale(1.3);
  transition: transform 0.2s ease;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.pagination span {
  font-weight: bold;
}

.team-footer {
  background-color: #f3f3f3;
  color: #34495e;
  padding: 20px 0;
  border-top: 2px solid #e0e0e0;
}

.team-footer a {
  text-decoration: none;
  color: #1abc9c;
}

@media (max-width: 600px) {
  .products-list {
    margin: 10px;
  }

  .pagination {
    font-size: 0.8rem;
  }
}
</style>
