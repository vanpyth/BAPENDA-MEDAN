import prisma from "@/lib/prisma";
import { TaxObject, Payment } from "@prisma/client";

export class TaxService {
  /**
   * Cek Tagihan Pajak (Contoh: PBB)
   * Berdasarkan Nomor Objek Pajak (NOP)
   */
  static async getTaxBillByNOP(nop: string) {
    try {
      const taxObject = await prisma.taxObject.findUnique({
        where: { nop },
        include: {
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });

      if (!taxObject) {
         throw new Error("Nomor Objek Pajak tidak ditemukan.");
      }

      const pendingPayments = taxObject.payments.filter(p => p.status === 'PENDING');
      const paidHistory = taxObject.payments.filter(p => p.status === 'PAID');

      return {
        success: true,
        data: {
          objectInfo: taxObject,
          pendingAmount: pendingPayments.reduce((acc, curr) => acc + Number(curr.amount), 0),
          recentPayments: paidHistory
        }
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan tidak dikenal.";
      return { success: false, error: message };
    }
  }

  /**
   * Simulasi Pembayaran Pajak
   */
  static async calculateSimulation(type: string, value: number) {
    // Logika simulasi (contoh sederhana)
    // Sesuai PMK atau Perda yang berlaku
    const rate = type === 'PBB' ? 0.003 : 0.05; // 0.3% untuk PBB, 5% untuk BPHTB (Contoh)
    const result = value * rate;

    return {
      success: true,
      data: {
        simulationResult: result,
        breakdown: [
          { label: "Nilai Dasar (NJOP)", value },
          { label: "Tarif Pajak (%)", value: rate * 100 },
          { label: "Total Estimasi", value: result }
        ]
      }
    };
  }

  /**
   * Membuat Kode Bayar (E-Billing)
   */
  static async createBillingCode(taxObjectId: string, amount: number, userId: string) {
     const invoiceNumber = `BILL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
     
     try {
       const payment = await prisma.payment.create({
         data: {
           invoiceNumber,
           amount,
           taxPeriod: new Date().getFullYear().toString(),
           status: "PENDING",
           expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
           taxObjectId,
           userId
         }
       });

       return {
         success: true,
         data: payment
       };
     } catch (error: unknown) {
       const message = error instanceof Error ? error.message : "Gagal membuat kode bayar.";
       return { success: false, error: message };
     }
  }
}
