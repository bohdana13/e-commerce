import { createRouter, createWebHistory } from 'vue-router'
import Catalog from "../views/Catalog.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Cart from "../views/Cart.vue";
import FavoritesView from '../views/FavoritesView.vue';



import NotFound from '../views/NotFound.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Catalog',
      component: Catalog
    },
    {
      path: '/product/:id',
      name: 'ProductView',
      component: ProductDetail
    },
    {
      path: '/cart',
      name: 'CartView',
      component: Cart
    },
    
    {
      path: '/favorites',
      name: 'FavoritesView',
      component: FavoritesView
    },
    
    {
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: NotFound,
        },
    
      ]
})

export default router
