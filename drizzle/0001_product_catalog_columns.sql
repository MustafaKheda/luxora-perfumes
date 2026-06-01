ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "model_no" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "detailed_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "product_detail_html" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_title" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_keywords" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "google_shopping_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "purchase_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "brand" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "scent_options" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "parent_product_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_parent_product_id_products_id_fk" FOREIGN KEY ("parent_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_parent_product_id_idx" ON "products" USING btree ("parent_product_id");
