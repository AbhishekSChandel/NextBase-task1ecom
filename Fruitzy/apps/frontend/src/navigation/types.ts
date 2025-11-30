import { Product } from '../services/productService';

export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  Search: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmed: { orderId: string };
};
