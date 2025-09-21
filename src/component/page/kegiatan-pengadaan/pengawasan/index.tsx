"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

import Mainlayout from "@/component/layout";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import DataTable from "@/component/tabel/dataTable";
import DataTablePembangunanRenovasi from "@/component/tabel/dataTableRenovAndBangun";
import PaguAwal from "@/component/tabel/tableDataIdentifikasiPagu";
import { PerencanaanKegiatanReal } from "@/component/interface/dataReal";
import DataTablePelaksaan, { PengawasanKegiatan } from "@/component/tabel/dataTablePelaksaan";

interface DecodedToken {
  exp: number;
  id_admin: string;
  id_unit_kerja: string;
  name: string;
  role: string;
  type: string;
}

const dummyPelaksanaan: PengawasanKegiatan[] = [
  {
    id_perencanaan_kegiatan: 1,
    satdik: "SMP Negeri 1 Jakarta",
    nama_pekerjaan: "Renovasi Gedung Kelas",
    metode_pengadaan: "Tender",
    lokasi_pekerjaan: "Jakarta Selatan",
    link_cctv: "http://cctv.example.com/1",
    informasi_penyedia: "PT Maju Jaya",
    no_tanggal_kontrak: "001/SPK/2025 - 01/01/2025",
    no_tanggal_kontrak_berakhir: "001/SPK/2025 - 30/06/2025",
    lama_pekerjaan: 180,
    status_pekerjaan: "Berjalan",
    anggaran: 500000000,
    hps: 480000000,
    nilai_kontrak: 470000000,
    sisa_pagu: 30000000,
    target_fisik: 50,
    realisasi_fisik: 45,
    deviasi: -5,
    target_realisasi_anggaran_termin: 60,
    realisasi_termin: 55,
    sisa_kontrak: 45,
    keeterangan: "Progress sesuai jadwal",
    tindak_lanjut_rekomendasi_sebelumnya: "Sudah diperbaiki",
    permasalahan: "Keterlambatan material",
    rekomendasi: "Percepat distribusi material",
  },
  {
    id_perencanaan_kegiatan: 2,
    satdik: "SMA Negeri 5 Bandung",
    nama_pekerjaan: "Pembangunan Lapangan Olahraga",
    metode_pengadaan: "E-Purchasing",
    lokasi_pekerjaan: "Bandung",
    link_cctv: "http://cctv.example.com/2",
    informasi_penyedia: "CV Sportindo",
    no_tanggal_kontrak: "002/SPK/2025 - 05/02/2025",
    no_tanggal_kontrak_berakhir: "002/SPK/2025 - 31/07/2025",
    lama_pekerjaan: 150,
    status_pekerjaan: "Baru Mulai",
    anggaran: 300000000,
    hps: 290000000,
    nilai_kontrak: 285000000,
    sisa_pagu: 15000000,
    target_fisik: 20,
    realisasi_fisik: 10,
    deviasi: -10,
    target_realisasi_anggaran_termin: 25,
    realisasi_termin: 15,
    sisa_kontrak: 85,
    keeterangan: "Baru tahap persiapan",
    tindak_lanjut_rekomendasi_sebelumnya: "-",
    permasalahan: "Belum ada masalah",
    rekomendasi: "Monitor progress lebih ketat",
  },
  {
    id_perencanaan_kegiatan: 3,
    satdik: "SMK Negeri 2 Surabaya",
    nama_pekerjaan: "Pengadaan Peralatan Praktikum",
    metode_pengadaan: "Penunjukan Langsung",
    lokasi_pekerjaan: "Surabaya",
    link_cctv: "http://cctv.example.com/3",
    informasi_penyedia: "PT Teknologi Nusantara",
    no_tanggal_kontrak: "003/SPK/2025 - 10/03/2025",
    no_tanggal_kontrak_berakhir: "003/SPK/2025 - 30/08/2025",
    lama_pekerjaan: 120,
    status_pekerjaan: "Selesai",
    anggaran: 200000000,
    hps: 190000000,
    nilai_kontrak: 185000000,
    sisa_pagu: 15000000,
    target_fisik: 100,
    realisasi_fisik: 100,
    deviasi: 0,
    target_realisasi_anggaran_termin: 100,
    realisasi_termin: 100,
    sisa_kontrak: 0,
    keeterangan: "Pekerjaan sudah selesai",
    tindak_lanjut_rekomendasi_sebelumnya: "Sesuai rekomendasi",
    permasalahan: "Tidak ada",
    rekomendasi: "Good job",
  },
];

type KategoriKey = "pengadaan" | "revitalisasi" | "pembangunan";

const kategoriConfig: Record<
  KategoriKey,
  { label: string; query: string; table: "default" | "renovasi" }
> = {
  pengadaan: {
    label: "Pengadaan Barang",
    query: "Pengadaan Barang",
    table: "default",
  },
  revitalisasi: {
    label: "Perbaikan Gedung dan Bangunan",
    query: "Perbaikan Gedung dan Bangunan",
    table: "renovasi",
  },
  pembangunan: {
    label: "Pembangunan Gedung dan Bangunan Baru",
    query: "Pembangunan Gedung Baru",
    table: "renovasi",
  },
};

export default function KegiatanPelaksananPage() {
  const router = useRouter();
  const BASE_URL = "http://103.177.176.202:6402";

  const [IdSatdik, setSelectedSatdikId] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<Record<KategoriKey, PerencanaanKegiatanReal[]>>({
    pengadaan: [],
    revitalisasi: [],
    pembangunan: [],
  });

  // Decode token sekali di awal
  useEffect(() => {
    try {
      const token = getCookie("XSX01");
      if (typeof token === "string" && token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserRole(decoded.type);
        setSelectedSatdikId(Number(decoded.id_unit_kerja));
      }
    } catch (err) {
      console.error("Error decoding token:", err);
      setUserRole("");
    }
  }, []);

  const fetchDataByKategori = useCallback(
    async (kategori: string, selectedSatdikId: number) => {
      const baseUrl = `${BASE_URL}/operator/getRencanaPengadaan`;
      let queryParams = `kategory=${kategori}`;

      if (selectedSatdikId && selectedSatdikId !== 0) {
        queryParams += `&id_satdik=${selectedSatdikId}`;
      }

      const finalUrl = `${baseUrl}?${queryParams}`;
      const response = await axios.get<PerencanaanKegiatanReal[]>(finalUrl);
      return response.data;
    },
    [BASE_URL]
  );

  const fetchAllData = useCallback(async () => {
    if (!IdSatdik || IdSatdik === 0) return; // 🚀 skip kalau belum ada IdSatdik

    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all(
        (Object.entries(kategoriConfig) as [KategoriKey, typeof kategoriConfig[KategoriKey]][]).map(
          async ([key, cfg]) => {
            const res = await fetchDataByKategori(cfg.query, IdSatdik);
            return [key, res] as [KategoriKey, PerencanaanKegiatanReal[]];
          }
        )
      );

      setData(Object.fromEntries(results) as typeof data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data kegiatan.");
    } finally {
      setLoading(false);
    }
  }, [fetchDataByKategori, IdSatdik]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSatdikSelect = (id: number) => {
    setSelectedSatdikId(id);
  };

  const handleClick = () => {
    router.push("/kegiatan-pengadaan/perencanaan/tambah");
  };


return (
    <Mainlayout>
      <div className="space-y-6 p-4 text-black">
        {/* Dropdown Satdik */}
        {userRole === "Admin Pusat" && (
          <div className="max-w-xs">
            <SelectSatdik
              selectTedOption={handleSatdikSelect}
              setNameSatdik={() => {}}
            />
          </div>
        )}

        {/* Pagu Awal */}

        {/* Button tambah */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleClick}
          >
            Tambahkan Pelaksanaan
          </button>
        </div>

        {/* Loading & Error state */}
        {loading && <p className="text-gray-500">Loading data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Data sections */}
        <DataTablePelaksaan data={dummyPelaksanaan} />
      </div>
    </Mainlayout>
  );

}
