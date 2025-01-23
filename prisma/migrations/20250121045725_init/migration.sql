-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_spent` DECIMAL(65, 30) NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `view_count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubCategory` (
    `sub_category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`sub_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `category_id` INTEGER NULL,
    `sub_category_id` INTEGER NULL,
    `img` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `total_sales` INTEGER NOT NULL DEFAULT 0,
    `total_revenue` DECIMAL(65, 30) NOT NULL DEFAULT 0,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `total_price` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('pending', 'paid', 'shipped', 'delivered', 'canceled') NOT NULL DEFAULT 'pending',
    `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `total_order_price` DECIMAL(65, 30) NOT NULL DEFAULT 0,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetail` (
    `order_detail_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`order_detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `payment_method` ENUM('credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery') NOT NULL,
    `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `transaction_id` VARCHAR(191) NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `payment_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Payment_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cart` (
    `cart_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`cart_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubCategory` ADD CONSTRAINT `SubCategory_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_sub_category_id_fkey` FOREIGN KEY (`sub_category_id`) REFERENCES `SubCategory`(`sub_category_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
