-- CreateTable
CREATE TABLE `social_media` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `bgColor` VARCHAR(191) NOT NULL DEFAULT 'bg-blue-500',
    `hoverColor` VARCHAR(191) NOT NULL DEFAULT 'bg-blue-600',
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
