import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database Bapenda Medan...");

  // Seed Admin User
  const hashedPassword = await bcrypt.hash("admin123", 12);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@bapendamedan.go.id" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@bapendamedan.go.id",
      password: hashedPassword,
      role: "ADMIN",
      nik: "1271000000000001",
      phone: "061-4567890",
      address: "Jl. Jenderal Ahmad Yani No. 1, Medan"
    }
  });
  console.log("✅ Admin dibuat:", admin.email);

  // Seed Officer User
  const officerPassword = await bcrypt.hash("officer123", 12);
  const officer = await prisma.user.upsert({
    where: { email: "petugas@bapendamedan.go.id" },
    update: {},
    create: {
      name: "Petugas Pajak",
      email: "petugas@bapendamedan.go.id",
      password: officerPassword,
      role: "OFFICER",
      nik: "1271000000000002",
      phone: "061-4567891"
    }
  });
  console.log("✅ Officer dibuat:", officer.email);

  // Seed Wajib Pajak (USER)
  const userPassword = await bcrypt.hash("user123", 12);
  const wpUser = await prisma.user.upsert({
    where: { email: "wp@mail.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      email: "wp@mail.com",
      password: userPassword,
      role: "USER",
      nik: "1271000000000099",
      phone: "081234567890",
      address: "Jl. Diponegoro No. 5, Medan Petisah, Kota Medan"
    }
  });
  console.log("✅ Wajib Pajak dibuat:", wpUser.email);

  // Seed Mahasiswa
  const mahasiswaPassword = await bcrypt.hash("mahasiswa123", 12);
  const mhs = await prisma.user.upsert({
    where: { email: "mhs@usu.ac.id" },
    update: {},
    create: {
      name: "Andi Wijaya",
      email: "mhs@usu.ac.id",
      password: mahasiswaPassword,
      role: "MAHASISWA",
      nik: "1271000000000095",
      phone: "089876543210",
      institution: "Universitas Sumatera Utara"
    }
  });
  console.log("✅ Mahasiswa dibuat:", mhs.email);

  // Seed Tax Objects with Coordinates (Medan Area)
  const taxObjects = [
    {
      nop: "12.72.01.001.001.0001",
      name: "Gedung Kantor Pusat",
      address: "Jl. Kapten Maulana Lubis No. 1",
      lat: 3.5912,
      lng: 98.6723,
      status: "ACTIVE",
      type: "PBB",
      ownerId: admin.id,
      payments: {
        create: {
          invoiceNumber: `BILL-KANTOR-${Date.now()}`,
          amount: 5000000,
          taxPeriod: "2025",
          status: "PAID",
          paidAt: new Date(),
          expiredAt: new Date(),
          userId: admin.id
        }
      }
    },
    {
      nop: "12.72.01.001.002.0002",
      name: "Rumah Budi Santoso",
      address: "Jl. Diponegoro No. 5",
      lat: 3.5850,
      lng: 98.6700,
      status: "ACTIVE",
      type: "PBB",
      ownerId: wpUser.id,
      payments: {
        create: {
          invoiceNumber: `BILL-BUDI-${Date.now()}`,
          amount: 2500000,
          taxPeriod: "2025",
          status: "PENDING",
          expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          userId: wpUser.id
        }
      }
    },
    {
      nop: "12.72.01.001.003.0003",
      name: "Apartment Center Point",
      address: "Jl. Jawa No. 8",
      lat: 3.5930,
      lng: 98.6800,
      status: "ACTIVE",
      type: "PBB",
      ownerId: officer.id,
      payments: {
        create: {
          invoiceNumber: `BILL-CP-${Date.now()}`,
          amount: 15000000,
          taxPeriod: "2025",
          status: "PAID",
          paidAt: new Date(),
          expiredAt: new Date(),
          userId: officer.id
        }
      }
    },
    {
      nop: "12.72.01.001.004.0004",
      name: "Ruko Thamrin Plaza",
      address: "Jl. Thamrin No. 75",
      lat: 3.5880,
      lng: 98.6920,
      status: "ACTIVE",
      type: "PBB",
      ownerId: wpUser.id,
      payments: {
        create: {
          invoiceNumber: `BILL-THAMRIN-${Date.now()}`,
          amount: 7500000,
          taxPeriod: "2025",
          status: "PENDING",
          expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          userId: wpUser.id
        }
      }
    }
  ];

  for (const obj of taxObjects) {
    await prisma.taxObject.upsert({
      where: { nop: obj.nop },
      update: {},
      create: {
        nop: obj.nop,
        name: obj.name,
        address: obj.address,
        lat: obj.lat,
        lng: obj.lng,
        status: obj.status,
        type: obj.type,
        ownerId: obj.ownerId,
        payments: obj.payments
      }
    });
  }

  // Seed News (Berita)
  const newsData = [
    {
      title: "Digitalisasi Pajak Daerah: Bapenda Medan Luncurkan SIPADA",
      summary: "Inovasi terbaru Pemko Medan untuk mempermudah wajib pajak dalam melaporkan dan membayar pajak daerah secara online.",
      content: "Badan Pendapatan Daerah (Bapenda) Kota Medan resmi meluncurkan Sistem Informasi Pajak Daerah (SIPADA). Sistem ini dirancang untuk mengintegrasikan seluruh jenis pajak daerah dalam satu platform yang transparan dan akuntabel. Walikota Medan menekankan bahwa langkah ini adalah bagian dari upaya reformasi birokrasi menuju Medan Smart City. Pengguna kini dapat melakukan pendaftaran objek pajak, pelaporan omzet bulanan, hingga pencetakan bukti bayar secara mandiri dari rumah.",
      category: "Berita",
      authorId: admin.id,
      isActive: true,
    },
    {
      title: "Kenaikan Target PAD Kota Medan Tahun 2026",
      summary: "DPRD dan Pemko Medan sepakat menetapkan target Pendapatan Asli Daerah yang lebih optimis untuk mendukung pembangunan infrastruktur.",
      content: "Dalam rapat paripurna terbaru, target Pendapatan Asli Daerah (PAD) Kota Medan tahun 2026 diproyeksikan mengalami kenaikan signifikan. Hal ini didorong oleh membaiknya iklim investasi dan kepatuhan wajib pajak yang terus meningkat. Bapenda Medan berkomitmen untuk melakukan jemput bola melalui mobil layanan keliling dan intensifikasi pendataan objek pajak baru di wilayah Medan Utara dan Medan Johor.",
      category: "Berita",
      authorId: officer.id,
      isActive: true,
    },
    {
      title: "Tutorial: Cara Menggunakan Fitur Hitung Pajak Mandiri",
      summary: "Panduan lengkap penggunaan fitur kalkulator PBB dan BPHTB pada portal Bapenda untuk estimasi beban pajak tahunan.",
      content: "Portal Bapenda Medan kini dilengkapi fitur simulasi perhitungan pajak. Wajib pajak cukup memasukkan data luas tanah dan bangunan sesuai SPPT PBB untuk mendapatkan estimasi nilai NJOP dan besaran pajak terutang. Untuk BPHTB, pengguna dapat mensimulasikan nilai perolehan hak berdasarkan transaksi jual beli. Fitur ini bertujuan memberikan kepastian hukum dan transparansi bagi masyarakat sebelum melakukan validasi formal ke kantor pajak.",
      category: "Artikel",
      authorId: admin.id,
      isActive: true,
    },
    {
      title: "Relaksasi Pajak: Bebas Denda PBB S/D Juni 2026",
      summary: "Pemerintah Kota Medan memberikan keringanan penghapusan denda bagi wajib pajak yang memiliki tunggakan tahun-tahun sebelumnya.",
      content: "PENGUMUMAN RESMI: Dalam rangka memperingati Hari Jadi Kota Medan, Pemerintah Kota memberikan program relaksasi berupa penghapusan denda administratif untuk Pajak Bumi dan Bangunan (PBB) dan Pajak Restoran. Program ini berlaku mulai tanggal 1 Maret hingga 30 Juni 2026. Masyarakat dihimbau untuk memanfaatkan momentum ini guna melunasi tunggakan tanpa dikenakan sanksi bunga tambahan.",
      category: "Pengumuman",
      authorId: admin.id,
      isActive: true,
    }
  ];

  for (const news of newsData) {
    const slug = news.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
    await prisma.news.upsert({
      where: { slug: slug },
      update: {},
      create: {
        ...news,
        slug,
      }
    });
  }

  console.log("✅ Seed Data News & Artikel berhasil!");
  console.log("\n🎉 Seeding selesai!");
  console.log("\n📋 Akun yang tersedia:");
  console.log("   Admin     → admin@bapendamedan.go.id  / admin123");
  console.log("   Officer   → petugas@bapendamedan.go.id / officer123");
  console.log("   Wajib Pajak → wp@mail.com             / user123");
  console.log("   NOP Demo  → 12.71.100.001.001-0001.0");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
