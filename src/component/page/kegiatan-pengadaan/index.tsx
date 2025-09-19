"use client";
import SummaryCards from "@/component/card";
import DynamicBarChart from "@/component/chart/grafikDashboard";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import { dataTablePercanaan } from "@/component/interface/dataTablePerencanaan";
import Mainlayout from "@/component/layout";
import DataTable from "@/component/tabel/dataTable";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTablePembangunan from "@/component/tabel/dataTablePembangunan";
import { perencaanKegiatan } from "@/component/interface/perencanaanInterface";
import { PerencanaanKegiatanReal } from "@/component/interface/dataReal";
import DataTablePembangunanRenovasi from "@/component/tabel/dataTableRenovAndBangun";
import PaguAwal from "@/component/tabel/tableDataIdentifikasiPagu";
import axios from "axios";

interface DataItem {
  name: string; // Nama poltek / satdik
  pagu: number; // Total pagu (misal: 3000000000)
  realisasi: number; // Total realisasi (misal: 2500000000)
  kegiatan?: number; // Optional: jumlah kegiatan
}

export default function KegiatanPengadaanPage() {
  const [IdSatdik, setSelectedSatdikId] = useState<number>(0);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [dataPengadaan, setDataPengadaan] = useState<PerencanaanKegiatanReal[]>(
    []
  );

  const [dataRevitalisasi, setdataRevitalisasi] = useState<
    PerencanaanKegiatanReal[]
  >([]);

  const [dataPembangunan, setDataPembangunan] = useState<
    PerencanaanKegiatanReal[]
  >([]);

  const BASE_URL = "http://103.177.176.202:6402";

  const fetchDataByKategori = async (
    kategori: string,
    selectedSatdikId: number
  ) => {
    const baseUrl = `${BASE_URL}/operator/getRencanaPengadaan`;
    let queryParams = `kategory=${kategori}`;

    if (selectedSatdikId && selectedSatdikId !== 0) {
      queryParams += `&id_satdik=${selectedSatdikId}`;
    }

    const finalUrl = `${baseUrl}?${queryParams}`;
    const response = await axios.get<PerencanaanKegiatanReal[]>(finalUrl);
    return response.data;
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [pengadaan, revitalisasi, pembangunan] = await Promise.all([
        fetchDataByKategori("Pengadaan Barang", IdSatdik),
        fetchDataByKategori("Perbaikan Gedung dan Bangunan", IdSatdik),
        fetchDataByKategori("Pembangunan Gedung Baru", IdSatdik),
      ]);

      setDataPengadaan(pengadaan);
      console.log("data sama", pengadaan.length)
      //
    
      setdataRevitalisasi(revitalisasi);
      console.log("data sama", revitalisasi.length)
      //
      setDataPembangunan(pembangunan);
      console.log("data sama", pembangunan.length)
      //
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal fetch data pengadaan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [IdSatdik]);

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

        <div className="">
          <div className="flex justify-center items-center w-full py-6">
            <h2 className="text-xl font-semibold mb-4">Pagu Awal</h2>
          </div>
          <PaguAwal />
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
            <DataTable data={dataPengadaan} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Perbaikan Gedung dan Bangunan
            </h2>
            <DataTablePembangunanRenovasi data={dataRevitalisasi} />
          </section> 

      

          <section>
            <h2 className="text-lg font-semibold mb-2">
              Pembangunan Gedung dan Bangunan Baru
            </h2>
            <DataTablePembangunanRenovasi data={dataPembangunan} />
          </section>
        </div>
      </div>
    </Mainlayout>
  );
}
