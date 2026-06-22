import { z } from "zod";

export const variantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Color is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().max(2000).optional().default(""),
  price: z.number().positive("Price must be positive"),
  category_id: z.string().uuid("Invalid category").optional().nullable(),
  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  variants: z.array(variantSchema).optional().default([]),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
});

export const stockSchema = z.object({
  stock: z.number().int().min(0, "Stock cannot be negative"),
});

export const couponSchema = z.object({
  code: z.string().min(1, "El código es obligatorio").max(30).transform((v) => v.toUpperCase().trim()),
  discount_type: z.enum(["percentage", "fixed"]),
  discount_value: z.number().positive("El valor debe ser positivo"),
  min_purchase: z.number().min(0).default(0),
  max_uses: z.number().int().positive("Debe ser positivo").nullable().optional(),
  active: z.boolean().default(true),
  expires_at: z.string().nullable().optional(),
});

export const createOrderSchema = z.object({
  customer_name: z.string().min(1, "Name is required").max(200),
  customer_phone: z.string().min(1, "Phone is required").max(50),
  customer_address: z.string().min(1, "Address is required").max(500),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid(),
    product_name: z.string().min(1),
    variant_label: z.string().optional().default(""),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, "At least one item is required"),
});
