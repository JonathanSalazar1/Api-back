/*
  Warnings:

  - You are about to drop the column `tokenJWT` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `tokenJWT`,
    ADD COLUMN `ValidarToken` VARCHAR(191) NULL;
