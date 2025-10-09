"use client";

import Mainlayout from "@/component/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FormPengawasan } from "@/component/form/form-pengawasan";
import TabelMingguan from "@/component/tabel/TableLaporanMingguan";

// --- Interfaces ---
interface ResponseData {
  satdik: string;
  nama_pekerjaan: string;
  kategori_pengadaan: string;
  anggaran: number;
  hps: number;
  id_pelaksanaan_pengadaan: string;
  id_perencanaan_kegiatan: string;
  lokasi_pekerjaan: string;
  link_cctv: string;
  nama_penyedia: string;
  npwp: string;
  alamat_penyedia: string;
  no_tanggal_kontrak_spk: string;
  tanggal_kontrak_berakhir: string;
  lama_pekerjaan: number;
  nilai_kontrak: number;
  sisa_pagu: number;
  metode_pemilihan: string; 
  status_pekerjaan: string;
}

interface ApiResponse {
  data: ResponseData[];
  message: string;
}

interface DataPengawasan {
  id_pengawasan: number;
  satdik: string;
  nama_pekerjaan: number;
  kategori_pengadaan: string;
  lokasi_kerja: string;
  link_cctv: string;
  nama_penyedia: string;
  npwp: string;
  metode_pemilihan: string;
  alamat_penyedia: string;
  no_tanggal_kontrak_spk: string;
  tanggal_kontrak_berakhir: string;
  lama_pekerjaan: string;
  anggaran: string;
  hps: string;
  nilai_kontrak: string;
  sisa_pagu: string;
  status_pekerjaan :string
}

interface LaporanMingguan {
  minggu: string;
  target_fisik_perminggu: string;
  realisasi_fisik_perminggu: string;
  deviasi: string;
  termin: string;
  target_realisasi_anggaran_per_termin: string;
  reaisasi_per_termin: string;
  sisa_kontrak: string;
  tingkat_capaiannya_keberhasilan: string;
  tindak_lanjut_rekomendasi_sebelumnya: string;
  permasalahan: string;
  rekomendasi: string;
}

type FormData = DataPengawasan & LaporanMingguan;

export default function DetailPelaksaan() {
  const BASE_URL = "http://103.177.176.202:6402";
  const { register, handleSubmit, watch, reset } = useForm<FormData>();
  const params = useParams();
  const id = params?.id;

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<ResponseData | null>(null);
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setLoading(false);
        setHasData(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(
          `${BASE_URL}/getPerencanaanKegiatanLaporan?id_perencanaan_kegiatan=${id}`
        );

        const data = response.data.data;
        
        if (data && data.length > 0) {
          setOriginalData(data[0]);
          setHasData(true);
        } else {
          setOriginalData(null);
          setHasData(false);
        }
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Terjadi kesalahan saat mengambil data");
        setHasData(false);
        setOriginalData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const onSubmit = (data: DataPengawasan) => {
    console.log("Submitted data:", data);
    setIsEdit(false);
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  return (
    <Mainlayout>
      <div className="">
        {/* Loading State */}
        {loading && (
          <div className="mx-auto p-6 bg-white shadow rounded-lg">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="ml-4 text-gray-600">Memuat data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mx-auto p-6 bg-white shadow rounded-lg">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-red-600 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-red-600 font-semibold">
                    Error saat mengambil data
                  </p>
                  <p className="text-red-500 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !hasData && (
          <div className="mx-auto p-6 bg-white shadow rounded-lg">
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="w-20 h-20 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tidak Ada Data Pengawasan
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Belum ada data pengawasan untuk ID perencanaan kegiatan ini.
                Silakan tambahkan data terlebih dahulu.
              </p>
            </div>
          </div>
        )}

        {/* Form with Data */}
        {!loading && !error && hasData && originalData && (
          <div className="mx-auto p-6 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Data Pengawasan</h2>
              {!isEdit && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            <FormPengawasan
              data={originalData}
              isEdit={isEdit}
              onSubmit={onSubmit}
              onCancel={handleCancel}
            />
            <div className="my-6 mt-6 border-t">
              <TabelMingguan
                idPelaksaan={originalData.id_pelaksanaan_pengadaan}
              />
            </div>
          </div>
        )}
      </div>
    </Mainlayout>
  );
}