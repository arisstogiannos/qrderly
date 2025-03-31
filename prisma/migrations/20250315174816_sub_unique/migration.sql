/*
  Warnings:

  - A unique constraint covering the columns `[businessId,product]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subscription_businessId_product_key" ON "Subscription"("businessId", "product");
