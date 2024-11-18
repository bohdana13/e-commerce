import { defineStore } from 'pinia';

export const productsStore = defineStore('products', {
  state: () => ({
    products: [],
    cart: []
  }),

  actions: {
    async fetchProductsFromDB(page = 1, limit = 10) {
      try {
        const maxPages = 4;
    
        if (page > maxPages) {
          console.log('Досягнуто максимальну кількість сторінок');
          return;
        }
    
        const response = await fetch(`https://api.escuelajs.co/api/v1/products?page=${page}&limit=${limit}`);
        const data = await response.json();
    
        this.products = [
          ...this.products,
          ...data.map(product => ({
            id: product.id,
            title: product.title || 'No title',
            price: product.price || 0,
            description: product.description || 'No description available',
            category: product.category?.name || 'Uncategorized',
            image: (product.images && product.images[0]) ? product.images[0] : 'https://via.placeholder.com/150?text=No+Image'
          }))
        ];
      } catch (error) {
        console.error('Помилка завантаження продуктів:', error);
      }
    },

    addToCart(product) {
      this.cart.push(product);
    },

    removeFromCart(id) {
      this.cart = this.cart.filter(item => item.id !== id);
    }
  }
});
