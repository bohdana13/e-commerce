export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }
  
  export interface ProductsStore {
    products: Product[];
    cart: Product[];
    fetchProductsFromDB: () => Promise<void>;
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
  }
  
  export declare const productsStore: () => ProductsStore;
  