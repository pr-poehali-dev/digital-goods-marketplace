const API_URLS = {
  auth: 'https://functions.poehali.dev/984f1f7f-8a0a-47b4-9ced-eff8492aff62',
  products: 'https://functions.poehali.dev/47e477d3-da36-4dd8-a267-1a114e9023cd',
  orders: 'https://functions.poehali.dev/e1a9ea77-d4e0-47e0-9bc2-c1c6dc0ef4c9'
};

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_admin: boolean;
  balance: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string;
  price: number;
  discount?: number;
  badge?: string;
  stock: number;
  image_url?: string;
}

export interface Order {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: Array<{
    name: string;
    price: number;
    key: string;
  }>;
}

export const api = {
  async register(email: string, password: string, full_name: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, full_name })
    });
    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password })
    });
    return response.json();
  },

  async getProducts(category?: string): Promise<Product[]> {
    const url = category 
      ? `${API_URLS.products}?category=${encodeURIComponent(category)}`
      : API_URLS.products;
    const response = await fetch(url);
    return response.json();
  },

  async createOrder(userId: number, items: Array<{ product_id: number; name: string; price: number; quantity: number }>) {
    const response = await fetch(API_URLS.orders, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, items })
    });
    return response.json();
  },

  async getUserOrders(userId: number): Promise<Order[]> {
    const response = await fetch(`${API_URLS.orders}?user_id=${userId}`);
    return response.json();
  },

  async createProduct(product: Omit<Product, 'id'> & { product_key: string }) {
    const response = await fetch(API_URLS.products, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    return response.json();
  }
};
