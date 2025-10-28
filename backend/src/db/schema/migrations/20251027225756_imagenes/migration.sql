/*
  Warnings:

  - Added the required column `imageLink` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "maximumCapacity" INTEGER NOT NULL,
    "assistingUsers" INTEGER NOT NULL DEFAULT 0,
    "category" INTEGER NOT NULL,
    "userCreatorId" TEXT NOT NULL,
    "imageLink" TEXT NOT NULL,
    CONSTRAINT "Event_userCreatorId_fkey" FOREIGN KEY ("userCreatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("address", "assistingUsers", "cancelled", "category", "date", "id", "longDescription", "maximumCapacity", "price", "shortDescription", "title", "userCreatorId") SELECT "address", "assistingUsers", "cancelled", "category", "date", "id", "longDescription", "maximumCapacity", "price", "shortDescription", "title", "userCreatorId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
