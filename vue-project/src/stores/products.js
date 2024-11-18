import { defineStore } from 'pinia';

export const productsStore = defineStore('products', {
  state: () => ({
    products: [],
    cart: []
  }),

  actions: {
    async fetchProductsFromDB(page = 1, limit = 10) {
      try {
        const response = await fetch(`https://api.escuelajs.co/api/v1/products?page=${page}&limit=${limit}`);
        const data = await response.json();
        this.products = data.map(product => ({
          id: product.id,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category.name,
          image: product.images[0]
        }));
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      }
    }
    ,

    addToCart(product) {
      this.cart.push(product);
    },

    removeFromCart(id) {
      this.cart = this.cart.filter(item => item.id !== id);
    }
  }
});
