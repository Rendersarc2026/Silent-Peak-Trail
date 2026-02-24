/*
  Warnings:

  - You are about to drop the column `package` on the `enquiry` table. All the data in the column will be lost.
  - You are about to drop the column `packageName` on the `review` table. All the data in the column will be lost.
  - Made the column `packageId` on table `enquiry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `packageId` on table `review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `enquiry` DROP FOREIGN KEY `Enquiry_packageId_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_packageId_fkey`;

-- AlterTable
ALTER TABLE `enquiry` DROP COLUMN `package`,
    MODIFY `packageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `review` DROP COLUMN `packageName`,
    MODIFY `packageId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Enquiry` ADD CONSTRAINT `Enquiry_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `Package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
