-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QR" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "table" TEXT NOT NULL,
    "noScans" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "QR_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QR" ("businessId", "id", "link", "menuId", "noScans", "table", "type") SELECT "businessId", "id", "link", "menuId", "noScans", "table", "type" FROM "QR";
DROP TABLE "QR";
ALTER TABLE "new_QR" RENAME TO "QR";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
