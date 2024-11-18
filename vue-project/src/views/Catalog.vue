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
          @click="goToProductPage(product.id)"
      >
        <product-item
            :product-data="product"
            @item-clicked="goToProductPage"
        />
      </v-col>
    </v-row>

    <div class="pagination">
      <v-btn @click="previousPage" :disabled="currentPage === 1">Previous</v-btn>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <v-btn @click="nextPage" :disabled="currentPage === totalPages">Next</v-btn>
    </div>
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

    const search = ref(typeof route.query.search === 'string' ? route.query.search : '');
    const minPrice = ref(typeof route.query.minPrice === 'string' ? route.query.minPrice : '');
    const maxPrice = ref(typeof route.query.maxPrice === 'string' ? route.query.maxPrice : '');
    const selectedCategory = ref(typeof route.query.category === 'string' ? route.query.category : '');
    const currentPage = ref(Number(route.query.page) || 1);
    const productsPerPage = 10;

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

    watch([search, minPrice, maxPrice, selectedCategory, currentPage], updateQueryParams);

    onMounted(async () => {
      await store.fetchProductsFromDB();
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
      clearFilters
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
</style>
