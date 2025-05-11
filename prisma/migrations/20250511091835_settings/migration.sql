-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "receiveMenuNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receiveOrderNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receivePromotionNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receiveNewsletterNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receiveSurveyNotifications" BOOLEAN NOT NULL DEFAULT true,
    "receiveFeedbackNotifications" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
