import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
});

export type Products = z.infer<typeof productSchema>;
