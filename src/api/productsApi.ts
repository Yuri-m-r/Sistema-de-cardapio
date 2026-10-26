import type { Product, NewProduct } from "../types/productType";
import { api } from "./api";

// ------------- Get products -------------
export const searchProducts = async (search: string = "") => {
  const term = search.trim();

  const response = await api.get<Product[]>("/products", {
    params: {
      ...(term && {
        _where: JSON.stringify({
          or: [
            { name: { contains: term } },
            { category: { contains: term } },
          ],
        }),
      }),
    },
  });
  return response.data;
};

// ------------- Delete products -------------
export const deleteProduct = async (id: string) => {
  const response = await api.delete<Product>(`/products/${id}`);
  return response.data;
};

// ------------- Create products -------------
export const createProduct = async (product: NewProduct) => {
  const response = await api.post<Product>("/products", product);
  return response.data;
};

// ------------- Update products -------------
export const updateProduct = async (product: Product) => {
  const response = await api.put<Product>(`/products/${product.id}`, product);
  return response.data;
};
