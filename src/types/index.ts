export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  created_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  category?: Category;
  images: string[];
  featured: boolean;
  active: boolean;
  variants: ProductVariant[];
  avg_rating?: number;
  review_count?: number;
  created_at: string;
};

export type CartItem = {
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  variant_label: string;
  quantity: number;
  price: number;
};

export type Profile = {
  id: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
};

export type Coupon = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_purchase: number;
  max_uses: number | null;
  used_count: number;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};
