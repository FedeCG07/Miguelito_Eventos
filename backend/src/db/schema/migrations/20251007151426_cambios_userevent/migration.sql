/*
  Warnings:

  - You are about to drop the column `maximumAttendees` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `UserEvent` table. All the data in the column will be lost.
  - Added the required column `maximumCapacity` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservationsMade` to the `UserEvent` table without a default value. This is not possible if the table is not empty.

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
    CONSTRAINT "Event_userCreatorId_fkey" FOREIGN KEY ("userCreatorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_category_fkey" FOREIGN KEY ("category") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("address", "assistingUsers", "cancelled", "category", "date", "id", "longDescription", "price", "shortDescription", "title", "userCreatorId") SELECT "address", "assistingUsers", "cancelled", "category", "date", "id", "longDescription", "price", "shortDescription", "title", "userCreatorId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_UserEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reservationsMade" INTEGER NOT NULL,
    "reservationsCancelled" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "UserEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserEvent" ("eventId", "id", "userId") SELECT "eventId", "id", "userId" FROM "UserEvent";
DROP TABLE "UserEvent";
ALTER TABLE "new_UserEvent" RENAME TO "UserEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
