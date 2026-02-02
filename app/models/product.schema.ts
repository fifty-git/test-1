import { z } from "zod";

export const CategoryEnum = z.enum(["roses", "tulips", "lilies", "mixed"]);

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  stock_quantity: z.coerce.number().int().min(0, "Stock must be 0 or more"),
  description: z.string().min(10).max(200),
  category: CategoryEnum,
  images: z.array(z.string()).default([]),
});

export type Product = z.infer<typeof ProductSchema>;
