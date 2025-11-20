-- CreateTable
CREATE TABLE `hero_buttons` (
    `id` VARCHAR(191) NOT NULL,
    `heroSectionId` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NOT NULL,
    `variant` VARCHAR(191) NOT NULL DEFAULT 'primary',
    `bgColor` VARCHAR(191) NULL,
    `textColor` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hero_buttons` ADD CONSTRAINT `hero_buttons_heroSectionId_fkey` FOREIGN KEY (`heroSectionId`) REFERENCES `hero_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
