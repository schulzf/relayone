-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BUSINESS_UNIT', 'COMPANY', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('INCOMPLETE', 'PENDING', 'PROVISIONING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "type" "AddressType" NOT NULL DEFAULT 'COMPANY',
    "street" TEXT,
    "number" TEXT,
    "complement" TEXT,
    "city" TEXT,
    "district" TEXT,
    "region" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zip" TEXT,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "logoFileId" TEXT,
    "registrationNumber" TEXT,
    "name" TEXT,
    "dba" TEXT,
    "capital" INTEGER,
    "incorporationDate" TIMESTAMP(3),
    "legalType" TEXT,
    "phoneNumber" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'INCOMPLETE',
    "rejectionMotive" TEXT,
    "metadata" JSONB,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "indexationNumber" BIGSERIAL NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadedFile" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "eTag" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_companyId_key" ON "Address"("companyId");

-- CreateIndex
CREATE INDEX "Address_companyId_idx" ON "Address"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_orgId_key" ON "Company"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_indexationNumber_key" ON "Company"("indexationNumber");

-- CreateIndex
CREATE INDEX "Company_orgId_idx" ON "Company"("orgId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadedFile" ADD CONSTRAINT "UploadedFile_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
