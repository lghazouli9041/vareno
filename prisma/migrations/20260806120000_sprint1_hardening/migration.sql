-- Sprint 1 production hardening
-- Review status/featured, coupon usage limits, contact messages, indexes

CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "Coupon"
  ADD COLUMN IF NOT EXISTS "usageLimit" INTEGER,
  ADD COLUMN IF NOT EXISTS "usedCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "Coupon_active_startsAt_endsAt_idx"
  ON "Coupon"("active", "startsAt", "endsAt");

ALTER TABLE "Review"
  ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING';

UPDATE "Review"
SET "status" = CASE
  WHEN "published" = true THEN 'APPROVED'::"ReviewStatus"
  ELSE 'PENDING'::"ReviewStatus"
END;

CREATE INDEX IF NOT EXISTS "Review_status_featured_idx"
  ON "Review"("status", "featured");

CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "company" TEXT,
  "message" TEXT NOT NULL,
  "ipHash" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ContactMessage_ipHash_createdAt_idx"
  ON "ContactMessage"("ipHash", "createdAt");

CREATE INDEX IF NOT EXISTS "ContactMessage_email_createdAt_idx"
  ON "ContactMessage"("email", "createdAt");

CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");

CREATE INDEX IF NOT EXISTS "Variant_inventory_idx" ON "Variant"("inventory");

CREATE INDEX IF NOT EXISTS "Variant_inStock_idx" ON "Variant"("inStock");
