import prisma from "./prisma.js";

/**
 * Allocates the next display ticket number (T-001, T-002, ...).
 * Uses a Postgres sequence so concurrent creates stay unique.
 */
export async function nextTicketNumber(client = prisma) {
  const rows = await client.$queryRaw`
    SELECT nextval('ticket_number_seq') AS n
  `;
  const n = Number(rows[0].n);
  return `T-${String(n).padStart(3, "0")}`;
}
