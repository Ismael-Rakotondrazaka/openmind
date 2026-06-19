-- AlterTable
ALTER TABLE "email_verification_tokens" ADD COLUMN     "pending_email" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'signup';
