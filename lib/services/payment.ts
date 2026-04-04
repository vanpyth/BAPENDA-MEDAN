import prisma from "@/lib/prisma";
import { NotificationService } from "@/lib/services/notification";
import { AuditService } from "./audit";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export class PaymentService {
  /**
   * Initialize a payment with Midtrans Snap
   */
  static async createSnapToken(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        taxObject: true,
      },
    });

    if (!payment) throw new Error("Tagihan tidak ditemukan");
    if (payment.status === "PAID") throw new Error("Tagihan sudah dibayar");

    const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

    const payload = {
      transaction_details: {
        order_id: payment.invoiceNumber,
        gross_amount: Number(payment.amount),
      },
      customer_details: {
        first_name: payment.user.name || "User",
        email: payment.user.email,
        phone: payment.user.phone,
      },
      item_details: [
        {
          id: payment.taxObject.nop,
          price: Number(payment.amount),
          quantity: 1,
          name: `${payment.taxObject.type} - ${payment.taxObject.nop}`,
        },
      ],
      usage_limit: 1,
    };

    const response = await fetch(MIDTRANS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authHeader}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[MIDTRANS_ERROR]", errorData);
      throw new Error(errorData.error_messages?.[0] || "Gagal inisialisasi pembayaran");
    }

    const data = await response.json();
    return data.token; // SNAP Token
  }

  /**
   * Handle Webhook from Midtrans
   */
  static async handleWebhook(notification: { 
    order_id: string; 
    transaction_status: string; 
    payment_type: string; 
    fraud_status?: string; 
  }) {
    const {
      order_id,
      transaction_status,
      payment_type,
      fraud_status,
    } = notification;

    console.info(`[MIDTRANS_WEBHOOK] Received: ${order_id} - ${transaction_status}`);

    let status = "PENDING";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") status = "PAID";
    } else if (transaction_status === "settlement") {
      status = "PAID";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      status = "FAILED";
    } else if (transaction_status === "pending") {
      status = "PENDING";
    }

    const updatedPayment = await prisma.payment.update({
      where: { invoiceNumber: order_id },
      data: {
        status,
        method: payment_type,
        paidAt: status === "PAID" ? new Date() : null,
      },
    });

    // ─── Trigger Internal Notification ─────────────────────────────────────────
    if (status === "PAID") {
      await NotificationService.notify({
        userId: updatedPayment.userId,
        title: "Pembayaran Berhasil!",
        message: `Terima kasih! Pembayaran ${updatedPayment.taxPeriod} senilai ${Number(updatedPayment.amount).toLocaleString("id-ID")} telah kami terima.`,
        type: "SUCCESS",
      });
    } else if (status === "FAILED") {
      await NotificationService.notify({
        userId: updatedPayment.userId,
        title: "Pembayaran Gagal!",
        message: `Maaf, pembayaran untuk invoice ${order_id} gagal diproses. Silakan coba lagi.`,
        type: "ERROR",
      });
    }

    // Log the update with centralized AuditService
    await AuditService.log({
      userId: updatedPayment.userId,
      action: `WEBHOOK_PAYMENT_${status}`,
      table: "Payment",
      recordId: updatedPayment.id,
      newValue: notification,
    });

    return updatedPayment;
  }
}
