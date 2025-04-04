/*
  Warnings:

  - You are about to alter the column `targetTime` on the `Banner` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Banner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "targetTime" DATETIME NOT NULL
);
INSERT INTO "new_Banner" ("id", "targetTime", "text") SELECT "id", "targetTime", "text" FROM "Banner";
DROP TABLE "Banner";
ALTER TABLE "new_Banner" RENAME TO "Banner";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
