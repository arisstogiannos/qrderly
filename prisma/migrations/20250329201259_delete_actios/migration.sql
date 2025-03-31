-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "menuId" TEXT NOT NULL,
    "translations" TEXT,
    CONSTRAINT "Category_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "description", "id", "menuId", "name", "translations", "updatedAt") SELECT "createdAt", "description", "id", "menuId", "name", "translations", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "noScans" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL DEFAULT 'QR_MENU',
    "template" TEXT NOT NULL DEFAULT 'T1',
    CONSTRAINT "Menu_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("businessId", "id", "languages", "noScans", "published", "template", "theme", "type") SELECT "businessId", "id", "languages", "noScans", "published", "template", "theme", "type" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
CREATE UNIQUE INDEX "Menu_businessId_key" ON "Menu"("businessId");
CREATE TABLE "new_MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "preferences" TEXT,
    "priceInCents" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "imagePath" TEXT,
    "stock" INTEGER,
    "translations" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MenuItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MenuItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MenuItem" ("categoryId", "createdAt", "description", "id", "imagePath", "isAvailable", "menuId", "name", "preferences", "priceInCents", "stock", "translations", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "imagePath", "isAvailable", "menuId", "name", "preferences", "priceInCents", "stock", "translations", "updatedAt" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
CREATE TABLE "new_QR" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT,
    "link" TEXT NOT NULL,
    "qrOptions" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "QR_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QR" ("businessId", "id", "link", "qrOptions") SELECT "businessId", "id", "link", "qrOptions" FROM "QR";
DROP TABLE "QR";
ALTER TABLE "new_QR" RENAME TO "QR";
CREATE UNIQUE INDEX "QR_businessId_key" ON "QR"("businessId");
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
    CONSTRAINT "Subscription_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("billing", "businessId", "expiresAt", "hasExpired", "id", "product", "purchasedAt", "renewedAt", "stripeSubId", "userId") SELECT "billing", "businessId", "expiresAt", "hasExpired", "id", "product", "purchasedAt", "renewedAt", "stripeSubId", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_businessId_key" ON "Subscription"("businessId");
CREATE UNIQUE INDEX "Subscription_stripeSubId_key" ON "Subscription"("stripeSubId");
CREATE UNIQUE INDEX "Subscription_businessId_product_key" ON "Subscription"("businessId", "product");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
