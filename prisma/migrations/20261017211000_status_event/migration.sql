-- CreateTable
CREATE TABLE "StatusEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requestId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "actorStaffUserId" TEXT,
    "at" DATETIME NOT NULL,
    CONSTRAINT "StatusEvent_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StatusEvent_actorStaffUserId_fkey" FOREIGN KEY ("actorStaffUserId") REFERENCES "StaffUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StatusEvent_requestId_idx" ON "StatusEvent"("requestId");
