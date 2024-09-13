-- DropForeignKey
ALTER TABLE "chapter" DROP CONSTRAINT "chapter_storyId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_storyId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "current_reads" DROP CONSTRAINT "current_reads_userId_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_storyId_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_userId_fkey";

-- DropForeignKey
ALTER TABLE "story" DROP CONSTRAINT "story_authorId_fkey";

-- DropIndex
DROP INDEX "story_thumbnail_idx";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "chapter_storyId_sn_idx" ON "chapter"("storyId", "sn");

-- CreateIndex
CREATE INDEX "genre_slug_idx" ON "genre"("slug");

-- CreateIndex
CREATE INDEX "story_categoryName_idx" ON "story"("categoryName");

-- AddForeignKey
ALTER TABLE "current_reads" ADD CONSTRAINT "current_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story" ADD CONSTRAINT "story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "chapter_story_id_slug_idx" RENAME TO "chapter_storyId_slug_idx";

-- RenameIndex
ALTER INDEX "story_author_id_idx" RENAME TO "story_authorId_idx";
