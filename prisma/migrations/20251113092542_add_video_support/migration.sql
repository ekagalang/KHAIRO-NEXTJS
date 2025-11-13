-- AlterTable
ALTER TABLE `media` ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `mediaType` VARCHAR(191) NOT NULL DEFAULT 'image';
