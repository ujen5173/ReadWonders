/*
  Warnings:

  - Made the column `title` on table `chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `chapter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "chapter" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "slug" SET NOT NULL;
