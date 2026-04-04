import prisma from "@/lib/prisma";

/**
 * Log a user action to the database.
 * @param action - the action name (e.g. 'CREATE_NEWS', 'APPROVE_RESEARCH')
 * @param table - the table affected
 * @param recordId - the ID of the affected record
 * @param userId - the user performing the action
 * @param oldValue - optional JSON of the old state
 * @param newValue - optional JSON of the new state
 */
export async function createAuditLog(
  action: string,
  table: string,
  recordId: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oldValue?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newValue?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        table,
        recordId,
        userId,
        oldValue: oldValue || null,
        newValue: newValue || null,
      },
    });
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}
