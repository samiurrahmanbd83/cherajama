export type UserModel = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
};

export type AdminModel = {
  id: string;
  email: string;
};

export type CategoryModel = {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
};

export type ProductModel = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  sale_price?: number | null;
  stock: number;
  category_id?: string | null;
};

export type OrderModel = {
  id: string;
  user_id?: string | null;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
};
