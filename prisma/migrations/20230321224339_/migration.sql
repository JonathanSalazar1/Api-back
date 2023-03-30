/*
  Warnings:

  - You are about to drop the column `token` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `token`,
    ADD COLUMN `token2FA` VARCHAR(191) NULL,
    ADD COLUMN `tokenJWT` VARCHAR(191) NULL;
