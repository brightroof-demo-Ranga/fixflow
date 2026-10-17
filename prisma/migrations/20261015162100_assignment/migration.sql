-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "assignedAt" DATETIME NOT NULL,
    "expectedArrivalAt" DATETIME,
    "supersededAt" DATETIME,
    CONSTRAINT "Assignment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Assignment_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "StaffUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "StaffUser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Assignment_requestId_idx" ON "Assignment"("requestId");
