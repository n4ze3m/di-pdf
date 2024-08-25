-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "active_version" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
