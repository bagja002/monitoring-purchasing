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

interface DecodedToken {
  exp: number;
  id_admin: string;
  id_unit_kerja: string;
  name: string;
  role: string;
  type: string;
}

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

export default function KegiatanPengadaanPage() {
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
   // if (!IdSatdik || IdSatdik === 0) return; // 🚀 skip kalau belum ada IdSatdik

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
        <div>
          <div className="flex justify-center items-center w-full py-6">
            <h2 className="text-xl font-semibold mb-4">Pagu Awal</h2>
          </div>
          <PaguAwal />
        </div>

        {/* Button tambah */}

        {userRole ==="Operator"&&(
          <div className="flex justify-start mb-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleClick}
          >
            Tambahkan Kegiatan Pengadaan
          </button>
        </div>

        )}
        

        {/* Loading & Error state */}
        {loading && <p className="text-gray-500">Loading data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Data sections */}
        {!loading && !error && (
          <div className="space-y-8">
            {(
              Object.entries(kategoriConfig) as [
                KategoriKey,
                typeof kategoriConfig[KategoriKey]
              ][]
            ).map(([key, cfg]) => (
              <section key={key}>
                <h2 className="text-lg font-semibold mb-2">{cfg.label}</h2>
                {cfg.table === "default" ? (
                  <DataTable data={data[key]} />
                ) : (
                  <DataTablePembangunanRenovasi data={data[key]} />
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </Mainlayout>
  );

}
