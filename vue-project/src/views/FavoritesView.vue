<template>
    <div class="favorites-list">
      <h1>Your Favorites</h1>
      <v-row>
        <v-col
          v-for="favorite in favorites"
          :key="favorite.id"
          cols="12"
          sm="4"
        >
          <v-card outlined>
            <v-img :src="favorite.image" height="150" class="mb-2"></v-img>
            <v-card-title>{{ favorite.title }}</v-card-title>
            <v-card-subtitle>\${{ favorite.price }}</v-card-subtitle>
            <v-card-actions>
              <v-btn color="error" @click="removeFavorite(favorite)">Remove</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="goBack">Back to Catalog</v-btn>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'FavoritesView',
    setup() {
      const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'));
      const router = useRouter();
  
      const removeFavorite = (product) => {
        const index = favorites.value.findIndex((fav) => fav.id === product.id);
        if (index !== -1) {
          favorites.value.splice(index, 1);
          localStorage.setItem('favorites', JSON.stringify(favorites.value));
        }
      };
  
      const goBack = () => {
        router.push({ name: 'Catalog' });
      };
  
      return {
        favorites,
        removeFavorite,
        goBack,
      };
    },
  };
  </script>
  
  <style scoped>
  .favorites-list {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>
  