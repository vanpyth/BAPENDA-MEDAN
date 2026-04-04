import React from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Register fonts if needed (using default ones for now to avoid complexity)
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
  },
  header: {
    backgroundColor: '#0f172a',
    padding: 20,
    color: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  statusBadge: {
    backgroundColor: '#22c55e',
    color: '#fff',
    padding: '4 12',
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: '1 solid #e2e8f0',
    paddingBottom: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  amountSection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1 solid #e2e8f0',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 8,
    borderTop: '1 solid #cbd5e1',
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTop: '1 solid #e2e8f0',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.5,
  },
  qrCodePlaceholder: {
    width: 60,
    height: 60,
    border: '1 dashed #cbd5e1',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  qrText: {
    fontSize: 6,
    color: '#94a3b8',
    textAlign: 'center',
  }
});

interface DigitalReceiptProps {
  data: {
    invoiceNumber: string;
    amount: number;
    taxPeriod: string;
    paidAt?: string | Date;
    method?: string | null;
    user: {
      name: string;
      email: string;
      nik?: string;
      phone?: string;
    };
    taxObject: {
      nop: string;
      type: string;
      name: string;
      address: string;
    };
  };
}

const METHOD_LABELS: Record<string, string> = {
  VA_BRI: "Virtual Account BRI",
  VA_BNI: "Virtual Account BNI",
  VA_MANDIRI: "Virtual Account Mandiri",
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer Bank",
};

export const DigitalReceipt: React.FC<DigitalReceiptProps> = ({ data }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR", 
      maximumFractionDigits: 0 
    }).format(val);
  };

  const paidDate = data.paidAt ? new Date(data.paidAt) : new Date();

  return (
    <Document title={`Receipt-${data.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>BAPENDA KOTA MEDAN</Text>
            <Text style={styles.subtitle}>Sistem Informasi Pendapatan Daerah</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.statusBadge}>LUNAS ✓</Text>
          </View>
        </View>

        {/* Invoice Info */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>BUKTI PEMBAYARAN PAJAK</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 4 }}>{data.invoiceNumber}</Text>
          <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
            {data.paidAt 
              ? `Dibayar pada ${format(paidDate, "dd MMMM yyyy HH:mm", { locale: id })} WIB`
              : "Menunggu Pembayaran"}
          </Text>
        </View>

        {/* Wajib Pajak & Objek Pajak Grid */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          {/* Data Wajib Pajak */}
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Data Wajib Pajak</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Nama</Text>
                <Text style={styles.value}>{data.user.name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>NIK</Text>
                <Text style={styles.value}>{data.user.nik || "-"}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{data.user.email}</Text>
              </View>
            </View>
          </View>

          {/* Data Objek Pajak */}
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={styles.sectionTitle}>Data Objek Pajak</Text>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>NOP</Text>
                <Text style={styles.value}>{data.taxObject.nop}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Jenis & Nama</Text>
                <Text style={styles.value}>{data.taxObject.type} - {data.taxObject.name}</Text>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Periode</Text>
                <Text style={styles.value}>{data.taxPeriod}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Alamat Objek</Text>
          <Text style={styles.value}>{data.taxObject.address}</Text>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
          <View style={styles.amountSection}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Metode Pembayaran</Text>
                <Text style={styles.value}>{data.method ? (METHOD_LABELS[data.method] || data.method) : "Midtrans"}</Text>
              </View>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Total Dibayar</Text>
              <Text style={styles.amountValue}>{formatCurrency(data.amount)}</Text>
            </View>
          </View>
        </View>

        {/* QR Section */}
        <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrText}>QR VERIFIED</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Verifikasi Keaslian Dokumen</Text>
            <Text style={{ fontSize: 8, color: '#64748b', marginTop: 2 }}>
              Dokumen ini diterbitkan secara elektronik oleh Sistem SIPADA Bapenda Kota Medan. 
              Gunakan aplikasi SIPADA untuk memverifikasi keaslian dokumen ini.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Badan Pendapatan Daerah (Bapenda) Kota Medan{"\n"}
            Jl. Jend. Ahmad Yani No. 1, Medan · Telp. 061-4567890 · bapenda.pemkomedan.go.id{"\n"}
            Bukti pembayaran ini merupakan dokumen resmi yang sah.
          </Text>
          <Text style={[styles.footerText, { marginTop: 10, fontFamily: 'Courier' }]}>
            TIMESTAMP: {data.paidAt instanceof Date ? data.paidAt.toISOString() : data.paidAt} | VERIFIED DOCUMENT
          </Text>
        </View>
      </Page>
    </Document>
  );
};
