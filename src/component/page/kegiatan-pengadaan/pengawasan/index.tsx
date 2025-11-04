"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

import Mainlayout from "@/component/layout";
import SelectSatdik from "@/component/dropdown/satdikDropdown";

import { PelaksaanKegiatan } from "@/component/interface/pelaksaanInterface";
import DataTablePelaksaan from "@/component/tabel/dataTablePelaksaan";

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

export default function KegiatanPelaksananPage() {
  const router = useRouter();
  const BASE_URL = "http://103.177.176.202:6402";

  const [IdSatdik, setSelectedSatdikId] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<Record<KategoriKey, PelaksaanKegiatan[]>>({
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

  const fetchData = useCallback(
    async (kategori: string, selectedSatdikId: number) => {
      const baseUrl = `${BASE_URL}/getPelaksanaanKegiatan`;
      let queryParams = ``;

      // Add kategori parameter
      if (kategori) {
        queryParams += `kategori=${encodeURIComponent(kategori)}`;
      }

      // Add satdik parameter only if selected (not 0 or "all")
      if (selectedSatdikId > 0) {
        if (queryParams) queryParams += "&";
        queryParams += `id_satdik=${selectedSatdikId}`;
      }

      const finalUrl = queryParams ? `${baseUrl}?${queryParams}` : baseUrl;
      console.log("Fetching URL:", finalUrl);
      const response = await axios.get(finalUrl);
      console.log("Response data for", kategori, ":", response.data);
      return response.data.data || [];
    },
    [BASE_URL]
  );

  const fetchAllData = useCallback(async () => {
    // Skip if user role is not set yet (still loading)
    if (!userRole) {
      console.log("User role belum diset, skip fetch");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log(
        "Fetching data with IdSatdik:",
        IdSatdik,
        "and userRole:",
        userRole
      );

      const results = await Promise.all(
        (
          Object.entries(kategoriConfig) as [
            KategoriKey,
            (typeof kategoriConfig)[KategoriKey]
          ][]
        ).map(async ([key, cfg]) => {
          const res = await fetchData(cfg.query, IdSatdik);
          return [key, res] as [KategoriKey, PelaksaanKegiatan[]];
        })
      );

      const fetchedData = Object.fromEntries(results) as typeof data;
      console.log("Fetched data:", fetchedData);
      setData(fetchedData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data kegiatan.");
    } finally {
      setLoading(false);
    }
  }, [fetchData, IdSatdik, userRole]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSatdikSelect = (id: number) => {
    setSelectedSatdikId(id);
  };

  return (
    <Mainlayout>
      <div className="space-y-6 p-4 text-black">
        {/* Dropdown Satdik */}
        {userRole === "Admin Pusat" && (
          <div className="max-w-xs">
            {" "}
            <SelectSatdik selectTedOption={handleSatdikSelect} />{" "}
          </div>
        )}

        {/* Pagu Awal */}

        {/* Button tambah */}
        {/* <div className="flex justify-start mb-4">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={handleClick}
          >
            Tambahkan Pelaksanaan
          </button>
        </div> */}

        {/* Loading & Error state */}
        {loading && <p className="text-gray-500">Loading data...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Data sections */}
        {!loading && !error && (
          <>
            {/* Pengadaan Barang */}
            {data.pengadaan.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                  Pengadaan Barang
                </h2>
                <DataTablePelaksaan data={data.pengadaan} />
              </div>
            )}

            {/* Perbaikan Gedung dan Bangunan */}
            {data.revitalisasi.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-green-700">
                  Perbaikan Gedung dan Bangunan
                </h2>
                <DataTablePelaksaan data={data.revitalisasi} />
              </div>
            )}

            {/* Pembangunan Gedung Baru */}
            {data.pembangunan.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-purple-700">
                  Pembangunan Gedung dan Bangunan Baru
                </h2>
                <DataTablePelaksaan data={data.pembangunan} />
              </div>
            )}

            {/* Jika semua data kosong */}
            {data.pengadaan.length === 0 &&
              data.revitalisasi.length === 0 &&
              data.pembangunan.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Tidak ada data pelaksanaan kegiatan
                </p>
              )}
          </>
        )}
      </div>
    </Mainlayout>
  );
}
