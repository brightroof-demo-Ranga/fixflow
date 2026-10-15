-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "System" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "systemId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "systemId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "critical" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "originalContactAt" DATETIME,
    "trackingTokenHash" TEXT NOT NULL,
    "onSiteAt" DATETIME,
    "remoteDiagnosisCompletedAt" DATETIME,
    "completedAt" DATETIME,
    "cancelledAt" DATETIME,
    "createTimestampResult" TEXT,
    "originalContactResult" TEXT,
    CONSTRAINT "ServiceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ServiceRequest_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "System" ("systemId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "System_systemId_key" ON "System"("systemId");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_trackingTokenHash_key" ON "ServiceRequest"("trackingTokenHash");
