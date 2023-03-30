/*
  Warnings:

  - You are about to drop the column `ValidarToken` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `usuarios` DROP COLUMN `ValidarToken`,
    ADD COLUMN `Activar2fa` BOOLEAN NULL;
