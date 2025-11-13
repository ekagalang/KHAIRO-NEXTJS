-- CreateTable
CREATE TABLE `visitor_stats` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `pageViews` INTEGER NOT NULL DEFAULT 0,
    `uniqueVisitors` INTEGER NOT NULL DEFAULT 0,
    `productViews` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `visitor_stats_date_idx`(`date`),
    UNIQUE INDEX `visitor_stats_date_key`(`date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
