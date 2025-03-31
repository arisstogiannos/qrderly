/*
  Warnings:

  - You are about to drop the column `imageSrc` on the `QR` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `QR` table. All the data in the column will be lost.
  - You are about to drop the column `noScans` on the `QR` table. All the data in the column will be lost.
  - You are about to drop the column `table` on the `QR` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `QR` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QR" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessId" TEXT,
    "link" TEXT NOT NULL,
    "qrOptions" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "QR_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QR" ("businessId", "id", "link") SELECT "businessId", "id", "link" FROM "QR";
DROP TABLE "QR";
ALTER TABLE "new_QR" RENAME TO "QR";
CREATE UNIQUE INDEX "QR_businessId_key" ON "QR"("businessId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
