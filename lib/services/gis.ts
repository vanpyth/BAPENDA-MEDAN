import prisma from "@/lib/prisma";

export class GISService {
  static async getTaxObjectCoordinates() {
    try {
      const taxObjects = await prisma.taxObject.findMany({
        where: {
          lat: { not: null },
          lng: { not: null },
        },
        include: {
          payments: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      return {
        success: true,
        data: (taxObjects as any[]).map((obj) => {
          const lastPayment = obj.payments[0];
          const isCompliant = lastPayment?.status === "PAID";
          
          return {
            id: obj.id,
            nop: obj.nop,
            name: obj.name,
            address: obj.address,
            lat: obj.lat,
            lng: obj.lng,
            isCompliant,
            amount: lastPayment?.amount || 0,
            status: obj.status,
          };
        }),
      };
    } catch (error: unknown) {
      console.error("[GIS_API_ERROR]", error);
      const message = error instanceof Error ? error.message : "Gagal mengambil data GIS.";
      return { success: false, error: message };
    }
  }

  static async getComplianceStats() {
    try {
      const totalObjects = await prisma.taxObject.count();
      const compliantObjects = await prisma.taxObject.count({
        where: {
          payments: {
            some: {
              status: "PAID",
              taxPeriod: new Date().getFullYear().toString(),
            },
          },
        },
      });

      return {
        success: true,
        data: {
          total: totalObjects,
          compliant: compliantObjects,
          nonCompliant: totalObjects - compliantObjects,
          ratio: totalObjects > 0 ? (compliantObjects / totalObjects) * 100 : 0,
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal mengambil statistik kepatuhan.";
      return { success: false, error: message };
    }
  }
}
