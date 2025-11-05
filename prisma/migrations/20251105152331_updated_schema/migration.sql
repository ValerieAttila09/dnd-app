/*
  Warnings:

  - You are about to drop the column `completed` on the `Todo` table. All the data in the column will be lost.
  - Added the required column `status` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "completed",
ADD COLUMN     "status" TEXT NOT NULL;
