CREATE TABLE `api_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `method` VARCHAR(10) NOT NULL,
    `url` TEXT NOT NULL,
    `headers` LONGTEXT NOT NULL,
    `body` LONGTEXT NULL,
    `status` INTEGER NOT NULL,
    `response_time` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `api_logs_created_at_idx`(`created_at`),
    INDEX `api_logs_method_idx`(`method`),
    INDEX `api_logs_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;