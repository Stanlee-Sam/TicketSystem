-- CreateSequence
CREATE SEQUENCE IF NOT EXISTS "ticket_number_seq" START WITH 1 INCREMENT BY 1;

-- AlterTable: add nullable first so existing rows can be backfilled
ALTER TABLE "Ticket" ADD COLUMN "ticketNumber" TEXT;

-- Backfill existing tickets in creation order
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) AS n
  FROM "Ticket"
  WHERE "ticketNumber" IS NULL
)
UPDATE "Ticket" t
SET "ticketNumber" = 'T-' || LPAD(numbered.n::text, 3, '0')
FROM numbered
WHERE t.id = numbered.id;

-- Advance sequence past any backfilled values
SELECT setval(
  'ticket_number_seq',
  GREATEST(
    (SELECT COALESCE(MAX(CAST(SUBSTRING("ticketNumber" FROM 3) AS INTEGER)), 0) FROM "Ticket"),
    1
  ),
  (SELECT COUNT(*) > 0 FROM "Ticket")
);

-- Enforce uniqueness going forward
ALTER TABLE "Ticket" ALTER COLUMN "ticketNumber" SET NOT NULL;

CREATE UNIQUE INDEX "Ticket_ticketNumber_key" ON "Ticket"("ticketNumber");
