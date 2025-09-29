"use client";

import Mainlayout from "@/component/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

// --- Interfaces ---
interface DataPengawasan {
  id_pengawasan: number;
  satuan_pendidikan: number;
  nama_pekerjaan: number;
  kategori_pengadaan: string;
  lokasi_kerja: string;
  link_cctv: string;
  nama_penyedia_alamat_dan_npwp: string;
  nomor_tanggal_kontrak_dan_spmk: string;
  tanggal_kontrak_berakhir: string;
  lama_pekerjaan: string;
  anggaran: string;
  hps: string;
  nilai_kontrak: string;
  sisa_pagu: string;
}

interface LaporanMingguan {
  minggu: string;
  target_fisik_perminggu: string;
  realisasi_fisik_perminggu: string;
  deviasi: string;
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
  const [hasData, setHasData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/getPerencanaanKegiatanLaporan?id_perencanaan_kegiatan=${id}`
        );
        
        const data = response.data.data;
        
        if (data && data.length > 0) {
          setHasData(true);
          // Reset form dengan data dari API
          reset(data[0]);
        } else {
          setHasData(false);
        }
        
        setError(null);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat mengambil data");
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset]);

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
                  <p className="text-red-600 font-semibold">Error saat mengambil data</p>
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
        {!loading && !error && hasData && (
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

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label className="mb-2">Satuan Pendidikan</Label>
                <Input
                  readOnly
                  {...register("satuan_pendidikan")}
                  placeholder="Satuan Pendidikan"
                />
              </div>

              <div>
                <Label className="mb-2">Nama Pekerjaan</Label>
                <Input
                  readOnly
                  {...register("nama_pekerjaan")}
                  placeholder="Nama Pekerjaan"
                />
              </div>

              <div className="grid grid-cols-3 space-x-5">
                <div>
                  <Label className="mb-2">Kategori Pengadaan</Label>
                  <Input
                    readOnly
                    {...register("kategori_pengadaan")}
                    placeholder="Kategori Pengadaan"
                  />
                </div>

                <div>
                  <Label className="mb-2">Lokasi Kerja</Label>
                  <Input
                    readOnly={!isEdit}
                    {...register("lokasi_kerja")}
                    placeholder="Lokasi Kerja"
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <Label className="mb-2">Link CCTV</Label>
                  <Input
                    readOnly={!isEdit}
                    {...register("link_cctv")}
                    placeholder="Link CCTV"
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 space-x-5">
                <div>
                  <Label className="mb-2">Nama Penyedia, Alamat, dan NPWP</Label>
                  <Textarea
                    readOnly={!isEdit}
                    {...register("nama_penyedia_alamat_dan_npwp")}
                    placeholder="Nama Penyedia, Alamat, NPWP"
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <Label className="mb-2">Nomor / Tanggal Kontrak & SPMK</Label>
                  <Textarea
                    readOnly={!isEdit}
                    {...register("nomor_tanggal_kontrak_dan_spmk")}
                    placeholder="Nomor / Tanggal Kontrak & SPMK"
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 space-x-5">
                <div>
                  <Label className="mb-2">Tanggal Kontrak Berakhir</Label>
                  <Input
                    type="date"
                    readOnly={!isEdit}
                    {...register("tanggal_kontrak_berakhir")}
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <Label className="mb-2">Lama Pekerjaan</Label>
                  <Input
                    readOnly={!isEdit}
                    {...register("lama_pekerjaan")}
                    placeholder="Lama Pekerjaan"
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-5">
                <div>
                  <Label className="mb-2">Anggaran</Label>
                  <Input
                    readOnly
                    {...register("anggaran", {
                      setValueAs: (v) => Number(v),
                    })}
                    value={
                      watch("anggaran")
                        ? `Rp ${Number(watch("anggaran")).toLocaleString(
                            "id-ID"
                          )}`
                        : ""
                    }
                    placeholder="Anggaran"
                  />
                </div>

                <div>
                  <Label className="mb-2">HPS</Label>
                  <Input
                    readOnly
                    {...register("hps", {
                      setValueAs: (v) => Number(v),
                    })}
                    value={
                      watch("hps")
                        ? `Rp ${Number(watch("hps")).toLocaleString("id-ID")}`
                        : ""
                    }
                    placeholder="HPS"
                  />
                </div>

                <div>
                  <Label className="mb-2">Nilai Kontrak</Label>
                  <Input
                    readOnly={!isEdit}
                    {...register("nilai_kontrak", {
                      setValueAs: (v) => Number(v),
                    })}
                    value={
                      watch("nilai_kontrak")
                        ? `Rp ${Number(watch("nilai_kontrak")).toLocaleString(
                            "id-ID"
                          )}`
                        : ""
                    }
                    placeholder="Nilai Kontrak"
                    className={!isEdit ? "bg-gray-50" : ""}
                  />
                </div>

                <div>
                  <Label className="mb-2">Sisa Pagu</Label>
                  <Input
                    readOnly
                    {...register("sisa_pagu", {
                      setValueAs: (v) => Number(v),
                    })}
                    value={
                      watch("sisa_pagu")
                        ? `Rp ${Number(watch("sisa_pagu")).toLocaleString(
                            "id-ID"
                          )}`
                        : ""
                    }
                    placeholder="Sisa Pagu"
                  />
                </div>
              </div>

              {isEdit && (
                <div className="pt-4 flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </Mainlayout>
  );
}