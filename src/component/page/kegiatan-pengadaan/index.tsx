"use client";
import SummaryCards from "@/component/card";
import DynamicBarChart from "@/component/chart/grafikDashboard";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import { dataTablePercanaan } from "@/component/interface/dataTablePerencanaan";
import Mainlayout from "@/component/layout";
import DataTable from "@/component/tabel/dataTable";
import { useState } from "react";
import { useRouter } from "next/navigation";


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
            <DataTable data={apiKKonstruksi} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Pembangunan Gedung Baru
            </h2>
            <DataTable data={apiDataArray} />
          </section>
        </div>
      </div>
    </Mainlayout>
  );
}
