"use client";
import SummaryCards from "@/component/card";
import DynamicBarChart from "@/component/chart/grafikDashboard";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import { dataTablePercanaan } from "@/component/interface/dataTablePerencanaan";
import Mainlayout from "@/component/layout";
import DataTable from "@/component/tabel/dataTable";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DataTablePembangunan from "@/component/tabel/dataTablePembangunan";
import { perencaanKegiatan } from "@/component/interface/perencanaanInterface";
import DataTablePembangunanRenovasi from "@/component/tabel/dataTableRenovAndBangun";


interface DataItem {
  name: string; // Nama poltek / satdik
  pagu: number; // Total pagu (misal: 3000000000)
  realisasi: number; // Total realisasi (misal: 2500000000)
  kegiatan?: number; // Optional: jumlah kegiatan
}

export default function KegiatanPengadaanPage() {
  const [IdSatdik, setSelectedSatdikId] = useState<number>(0);
   const router = useRouter();
  const handleSatdikSelectSatdik = (id: string) => {
    // Save selected ID
    //
  };
  const handleSatdikSelect = (id: number) => {
    setSelectedSatdikId(id); // Save selected ID
    //
  };

  const handleClick = () => {
    router.push("/kegiatan-pengadaan/perencanaan/tambah"); // ganti dengan route halaman tambah
  };


const dummyPerencanaanKegiatan: perencaanKegiatan[] = [
  {
    id_perencanaan_kegiatan: "PK001",
    id_satdik: "SAT001",
    satdik: "Satuan Pendidikan 1",
    nama_pekerjaan: "Pembangunan Gedung A",
    anggaran: 150000000,
    jadwal_pengadaan: "2025-09-20",
    kategori_pengadaan: "Konsultan Perencanaan",
    
    // Bagian Pengadaan Barang
    sirup_p_barang: "SRP001",
    metode_pemilihan_p_barang: "Tender",
    justifikasi_pemilihan_p_barang: "Efisiensi",
    kak_p_barang: "KAK001",
    rab_p_barang: "RAB001",
    hps_penetapan_p_barang: "HPS001",
    hps_nilai_p_barang: 50000000,
    hasil_survei_p_barang: "OK",
    rancangan_kontrak_p_barang: "Kontrak001",
    hasil_pendampingan_p_barang: "Selesai",

    // Konsultan Perencanaan
    sirup_p_konsultan_perencanaan: "SRP-KP001",
    metode_pemilihan_p_konsultan_perencanaan: "Tender",
    justifikasi_pemilihan_p_konsultan_perencanaan: "Kualitas",
    kak_p_konsultan_perencanaan: "KAK-KP001",
    rab_p_konsultan_perencanaan: "RAB-KP001",
    hps_penetapan_p_konsultan_perencanaan: "HPS-KP001",
    hps_nilai_p_konsultan_perencanaan: 70000000,
    rancangan_kontrak_p_konsultan_perencanaan: "Kontrak-KP001",
    hasil_pendampingan_p_konsultan_perencanaan: "Selesai",

    // Konstruksi
    sirup_p_kontruksi: "SRP-KON001",
    metode_pemilihan_p_kontruksi: "Tender",
    justifikasi_pemilihan_p_kontruksi: "Harga",
    kak_p_kontruksi: "KAK-KON001",
    rab_p_kontruksi: "RAB-KON001",
    gambar_perencanaan: "gambar1.png",
    spesifikasi_teknis: "Spesifikasi A",
    rekomendasi_pupr: "OK",
    hps_penetapan_p_kontruksi: "HPS-KON001",
    hps_nilai_p_kontruksi: 80000000,
    rancangan_kontrak_p_kontruksi: "Kontrak-KON001",
    hasil_pendampingan_p_kontruksi: "Selesai",

    // Konsultan Pengawas
    sirup_p_konsultan_pengawas: "SRP-KPWS001",
    metode_pemilihan_p_konsultan_pengawas: "Tender",
    justifikasi_pemilihan_p_konsultan_pengawas: "Efisiensi",
    kak_p_konsultan_pengawas: "KAK-KPWS001",
    rab_p_konsultan_pengawas: "RAB-KPWS001",
    hps_uraian_p_konsultan_pengawas: "HPS-KPWS001",
    hps_nilai_p_konsultan_pengawas: 30000000,
    rancangan_kontrak_p_konsultan_pengawas: "Kontrak-KPWS001",
    hasil_pendampingan_p_konsultan_pengawas: "Selesai",

    created_at: "2025-09-17T10:00:00Z",
    update_at: "2025-09-17T10:00:00Z",
  },
  {
    id_perencanaan_kegiatan: "PK002",
    id_satdik: "SAT002",
    satdik: "Satuan Pendidikan 2",
    nama_pekerjaan: "Renovasi Lab B",
    anggaran: 120000000,
    jadwal_pengadaan: "2025-10-01",
    kategori_pengadaan: "Konstruksi",
    
    sirup_p_barang: "SRP002",
    metode_pemilihan_p_barang: "Tender",
    justifikasi_pemilihan_p_barang: "Efisiensi",
    kak_p_barang: "KAK002",
    rab_p_barang: "RAB002",
    hps_penetapan_p_barang: "HPS002",
    hps_nilai_p_barang: 40000000,
    hasil_survei_p_barang: "OK",
    rancangan_kontrak_p_barang: "Kontrak002",
    hasil_pendampingan_p_barang: "Selesai",

    sirup_p_konsultan_perencanaan: "SRP-KP002",
    metode_pemilihan_p_konsultan_perencanaan: "Tender",
    justifikasi_pemilihan_p_konsultan_perencanaan: "Kualitas",
    kak_p_konsultan_perencanaan: "KAK-KP002",
    rab_p_konsultan_perencanaan: "RAB-KP002",
    hps_penetapan_p_konsultan_perencanaan: "HPS-KP002",
    hps_nilai_p_konsultan_perencanaan: 60000000,
    rancangan_kontrak_p_konsultan_perencanaan: "Kontrak-KP002",
    hasil_pendampingan_p_konsultan_perencanaan: "Selesai",

    sirup_p_kontruksi: "SRP-KON002",
    metode_pemilihan_p_kontruksi: "Tender",
    justifikasi_pemilihan_p_kontruksi: "Harga",
    kak_p_kontruksi: "KAK-KON002",
    rab_p_kontruksi: "RAB-KON002",
    gambar_perencanaan: "gambar2.png",
    spesifikasi_teknis: "Spesifikasi B",
    rekomendasi_pupr: "OK",
    hps_penetapan_p_kontruksi: "HPS-KON002",
    hps_nilai_p_kontruksi: 90000000,
    rancangan_kontrak_p_kontruksi: "Kontrak-KON002",
    hasil_pendampingan_p_kontruksi: "Selesai",

    sirup_p_konsultan_pengawas: "SRP-KPWS002",
    metode_pemilihan_p_konsultan_pengawas: "Tender",
    justifikasi_pemilihan_p_konsultan_pengawas: "Efisiensi",
    kak_p_konsultan_pengawas: "KAK-KPWS002",
    rab_p_konsultan_pengawas: "RAB-KPWS002",
    hps_uraian_p_konsultan_pengawas: "HPS-KPWS002",
    hps_nilai_p_konsultan_pengawas: 35000000,
    rancangan_kontrak_p_konsultan_pengawas: "Kontrak-KPWS002",
    hasil_pendampingan_p_konsultan_pengawas: "Selesai",

    created_at: "2025-09-17T10:30:00Z",
    update_at: "2025-09-17T10:30:00Z",
  },
  {
    id_perencanaan_kegiatan: "PK003",
    id_satdik: "SAT003",
    satdik: "Satuan Pendidikan 3",
    nama_pekerjaan: "Pembuatan Ruang Kelas C",
    anggaran: 100000000,
    jadwal_pengadaan: "2025-11-01",
    kategori_pengadaan: "Konsultan Pengawas",
    
    sirup_p_barang: "SRP003",
    metode_pemilihan_p_barang: "Tender",
    justifikasi_pemilihan_p_barang: "Efisiensi",
    kak_p_barang: "KAK003",
    rab_p_barang: "RAB003",
    hps_penetapan_p_barang: "HPS003",
    hps_nilai_p_barang: 30000000,
    hasil_survei_p_barang: "OK",
    rancangan_kontrak_p_barang: "Kontrak003",
    hasil_pendampingan_p_barang: "Selesai",

    sirup_p_konsultan_perencanaan: "SRP-KP003",
    metode_pemilihan_p_konsultan_perencanaan: "Tender",
    justifikasi_pemilihan_p_konsultan_perencanaan: "Kualitas",
    kak_p_konsultan_perencanaan: "KAK-KP003",
    rab_p_konsultan_perencanaan: "RAB-KP003",
    hps_penetapan_p_konsultan_perencanaan: "HPS-KP003",
    hps_nilai_p_konsultan_perencanaan: 50000000,
    rancangan_kontrak_p_konsultan_perencanaan: "Kontrak-KP003",
    hasil_pendampingan_p_konsultan_perencanaan: "Selesai",

    sirup_p_kontruksi: "SRP-KON003",
    metode_pemilihan_p_kontruksi: "Tender",
    justifikasi_pemilihan_p_kontruksi: "Harga",
    kak_p_kontruksi: "KAK-KON003",
    rab_p_kontruksi: "RAB-KON003",
    gambar_perencanaan: "gambar3.png",
    spesifikasi_teknis: "Spesifikasi C",
    rekomendasi_pupr: "OK",
    hps_penetapan_p_kontruksi: "HPS-KON003",
    hps_nilai_p_kontruksi: 70000000,
    rancangan_kontrak_p_kontruksi: "Kontrak-KON003",
    hasil_pendampingan_p_kontruksi: "Selesai",

    sirup_p_konsultan_pengawas: "SRP-KPWS003",
    metode_pemilihan_p_konsultan_pengawas: "Tender",
    justifikasi_pemilihan_p_konsultan_pengawas: "Efisiensi",
    kak_p_konsultan_pengawas: "KAK-KPWS003",
    rab_p_konsultan_pengawas: "RAB-KPWS003",
    hps_uraian_p_konsultan_pengawas: "HPS-KPWS003",
    hps_nilai_p_konsultan_pengawas: 25000000,
    rancangan_kontrak_p_konsultan_pengawas: "Kontrak-KPWS003",
    hasil_pendampingan_p_konsultan_pengawas: "Selesai",

    created_at: "2025-09-17T11:00:00Z",
    update_at: "2025-09-17T11:00:00Z",
  },
];


  const apiDataArray: dataTablePercanaan[] = [
    {
      no: 1,
      satdik: "Poltek AUP",
      nama_pekerjaan: "Pembangunan Gedung",
      anggaran: 200000000,
      jadwal_pengadaan: "2024-09-01 s/d 2024-12-01",
      kategori_pengadaan: "Barang",
      sirup: "123456",
      metode_pemilihan: "Tender Terbuka",
      justifikasi_pemilihan: "Nilai proyek besar",
      kak: "KAK-001",
      rab: "RAB-001",
      hps_penetapan: "300000000",
      hps_nilai: 295000000,
      hasil_survei: "Sesuai",
      rancangan_kontrak: "Draft SPK-001",
      hasil_pendampingan: "OK",
      gambar_perencanaan: "gedung.png",
      spesifikasi_teknis: "Standar Nasional",
      rekomendasi_pupr: "Disetujui",
      pagu: 300000000,
      realisasi: 295000000,
    },
    {
      no: 2,
      satdik: "Poltek Lain",
      nama_pekerjaan: "Pengadaan Komputer",
      anggaran: 50000000,
      jadwal_pengadaan: "2024-09-15 s/d 2024-10-15",
      kategori_pengadaan: "Barang",
      sirup: "654321",
      metode_pemilihan: "Tender Cepat",
      justifikasi_pemilihan: "Perlu segera",
      kak: "KAK-002",
      rab: "RAB-002",
      hps_penetapan: "50000000",
      hps_nilai: 49500000,
      hasil_survei: "Sesuai",
      rancangan_kontrak: "Draft SPK-002",
      hasil_pendampingan: "OK",
      gambar_perencanaan: "komputer.png",
      spesifikasi_teknis: "Intel Core i7",
      rekomendasi_pupr: "Disetujui",
      pagu: 50000000,
      realisasi: 49500000,
    },
    {
      no: 3,
      satdik: "Poltek Tiga",
      nama_pekerjaan: "Pengadaan Meja & Kursi",
      anggaran: 20000000,
      jadwal_pengadaan: "2024-09-10 s/d 2024-09-25",
      kategori_pengadaan: "Barang",
      sirup: "789012",
      metode_pemilihan: "Tender Terbuka",
      justifikasi_pemilihan: "Standar perabot",
      kak: "KAK-003",
      rab: "RAB-003",
      hps_penetapan: "20000000",
      hps_nilai: 19800000,
      hasil_survei: "Sesuai",
      rancangan_kontrak: "Draft SPK-003",
      hasil_pendampingan: "OK",
      gambar_perencanaan: "meja.png",
      spesifikasi_teknis: "Kayu Mahoni",
      rekomendasi_pupr: "Disetujui",
      pagu: 20000000,
      realisasi: 19800000,
    },
  ];

  const apiKKonstruksi: dataTablePercanaan[] = [
    {
      no: 1,
      satdik: "Poltek AUP",
      nama_pekerjaan: "Pembangunan Gedung",
      anggaran: 200000000,
      jadwal_pengadaan: "2024-09-01 s/d 2024-12-01",
      kategori_pengadaan: "Konstruksi",
      sirup: "123456",
      metode_pemilihan: "Tender Terbuka",
      justifikasi_pemilihan: "Nilai proyek besar",
      kak: "KAK-001",
      rab: "RAB-001",
      hps_penetapan: "300000000",
      hps_nilai: 295000000,
      hasil_survei: "Sesuai",
      rancangan_kontrak: "Draft SPK-001",
      hasil_pendampingan: "OK",
      gambar_perencanaan: "gedung.png",
      spesifikasi_teknis: "Standar Nasional",
      rekomendasi_pupr: "Disetujui",
      pagu: 300000000,
      realisasi: 295000000,
    },
    {
      no: 2,
      satdik: "Poltek Lain",
      nama_pekerjaan: "Pengadaan Komputer",
      anggaran: 50000000,
      jadwal_pengadaan: "2024-09-15 s/d 2024-10-15",
      kategori_pengadaan: "Konstruksi",
      sirup: "654321",
      metode_pemilihan: "Tender Cepat",
      justifikasi_pemilihan: "Perlu segera",
      kak: "KAK-002",
      rab: "RAB-002",
      hps_penetapan: "50000000",
      hps_nilai: 49500000,
      hasil_survei: "Sesuai",
      rancangan_kontrak: "Draft SPK-002",
      hasil_pendampingan: "OK",
      gambar_perencanaan: "komputer.png",
      spesifikasi_teknis: "Intel Core i7",
      rekomendasi_pupr: "Disetujui",
      pagu: 50000000,
      realisasi: 49500000,
    },
    {
      no: 3,
      satdik: "Poltek Tiga",
      nama_pekerjaan: "Pengadaan Meja & Kursi",
      anggaran: 20000000,
      jadwal_pengadaan: "2024-09-10 s/d 2024-09-25",
      kategori_pengadaan: "Konstruksi",
      sirup: "789012",
      metode_pemilihan: "Tender Terbuka",
      justifikasi_pemilihan: "Standar perabot",
      kak: "KAK-003",
      rab: "RAB-003",
      hps_penetapan: "20000000",
      hps_nilai: 19800000,
      hasil_survei: "Sesuai",
      rancangan_kontrak: "Draft SPK-003",
      hasil_pendampingan: "OK",
      gambar_perencanaan: "meja.png",
      spesifikasi_teknis: "Kayu Mahoni",
      rekomendasi_pupr: "Disetujui",
      pagu: 20000000,
      realisasi: 19800000,
    },
  ];

  return (
    <Mainlayout>
      <div className="space-y-6 p-4 text-black">
        {/* Dropdown Satdik */}
        <div className="max-w-xs">
          <SelectSatdik
            selectTedOption={handleSatdikSelect}
            setNameSatdik={handleSatdikSelectSatdik}
          />
        </div>

        <div className="flex justify-start mb-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleClick}
          >
            Tambahkan Kegiatan Pengadaan
          </button>
        </div>

        {/* Kategori Tables */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-2">Pengadaan Barang</h2>
            <DataTable data={apiDataArray} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Perbaikan Gedung dan Bangunan
            </h2>
            <DataTablePembangunan data={apiKKonstruksi} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Pembangunan Gedung Baru
            </h2>
            <DataTablePembangunanRenovasi data={dummyPerencanaanKegiatan} />
          </section>
        </div>
      </div>
    </Mainlayout>
  );
}
