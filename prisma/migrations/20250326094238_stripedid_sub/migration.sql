-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product" TEXT NOT NULL,
    "businessId" TEXT,
    "userId" TEXT NOT NULL,
    "stripeSubId" TEXT,
    "billing" TEXT NOT NULL,
    "hasExpired" BOOLEAN NOT NULL DEFAULT false,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "renewedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    CONSTRAINT "Subscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("billing", "businessId", "expiresAt", "id", "product", "purchasedAt", "renewedAt", "userId") SELECT "billing", "businessId", "expiresAt", "id", "product", "purchasedAt", "renewedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_businessId_key" ON "Subscription"("businessId");
CREATE UNIQUE INDEX "Subscription_businessId_product_key" ON "Subscription"("businessId", "product");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
