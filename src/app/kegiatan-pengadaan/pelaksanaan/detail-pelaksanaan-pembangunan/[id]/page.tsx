"use client";

import Mainlayout from "@/component/layout";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TabelMingguan from "@/component/tabel/TableLaporanMingguan";
import { FormPengawasan } from "@/component/form/form-pengawasan";

// --- Interfaces ---
interface ResponseData {
  satdik: string;
  nama_pekerjaan: string;
  kategori_pengadaan: string;
  anggaran: number;
  hps:number
  id_pelaksanaan_pengadaan: string  ;
  id_perencanaan_kegiatan: string ;
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
  status_pekerjaan: string;
}

//dafh

interface ApiResponse {
  data: ResponseData[];
  message: string;
}

interface DataPengawasan {
  id_pengawasan: number;
  satuan_pendidikan: number;
  nama_pekerjaan: number;
  kategori_pengadaan: string;
  lokasi_kerja: string;
  link_cctv: string;
  nama_penyedia: string;
  npwp: string;
  nama_penyedia_alamat_dan_npwp: string;
  nomor_tanggal_kontrak_dan_spmk: string;
  tanggal_kontrak_berakhir: string;
  lama_pekerjaan: string;
  anggaran: string;
  hps: string;
  nilai_kontrak: string;
  sisa_pagu: string;
}

export interface LaporanMingguan {
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
  const params = useParams();
  const id = params?.id;

  const { handleSubmit } = useForm<FormData>();
  const [isEdit, setIsEdit] = useState(false);
  const [originalData, setOriginalData] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${BASE_URL}/getPerencanaanKegiatanLaporan?id_perencanaan_kegiatan=${id}`
      );
      setOriginalData(response.data.data);
      console.log("Fetched data:", response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id, fetchData]);

  const onSubmit = (data: DataPengawasan) => {
    console.log("Submitted data:", data);
    setIsEdit(false);
  };

  const handleEdit = useCallback(() => setIsEdit(true), []);
  const handleCancel = useCallback(() => setIsEdit(false), []);

  return (
    <Mainlayout>
      {loading && <p className="p-4 text-gray-500">Loading data...</p>}
      {error && (
        <p className="p-4 text-red-500">Error saat ambil data: {error}</p>
      )}

      {!loading && !error && (
        <Accordion type="single" collapsible>
          {originalData.map((item, index) => (
            <AccordionItem
              key={`${item.id_pelaksanaan_pengadaan}-${index}`}
              value={`${item.kategori_pengadaan.toLowerCase()}`}
            >
              <AccordionTrigger>{item.kategori_pengadaan}</AccordionTrigger>
              <AccordionContent>
                <div className="mx-auto p-6 bg-white shadow rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">
                      Data Pengawasan {item.kategori_pengadaan}
                    </h2>
                    {!isEdit ? (
                      <button
                        onClick={handleEdit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <FormPengawasan
                    data={item}
                    isEdit={isEdit}
                    onSubmit={onSubmit}
                    onCancel={handleCancel}
                  />

                  <TabelMingguan idPelaksaan={item.id_pelaksanaan_pengadaan} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </Mainlayout>
  );
}
