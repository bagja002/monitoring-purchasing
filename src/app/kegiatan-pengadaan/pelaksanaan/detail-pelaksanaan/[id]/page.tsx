"use client";

import Mainlayout from "@/component/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// --- Interfaces ---
interface DataPengawasan {
  id_pengawasan: number;
  satuan_pendidikan: number; // dari API
  nama_pekerjaan: number; // dari API
  kategori_pengadaan: string; // dari API
  lokasi_kerja: string; // input
  link_cctv: string; // input
  nama_penyedia_alamat_dan_npwp: string; // input
  nomor_tanggal_kontrak_dan_spmk: string; // input
  tanggal_kontrak_berakhir: string; // input
  lama_pekerjaan: string; // input

  anggaran: string; // dari API
  hps: string; // dari API
  nilai_kontrak: string; // input
  sisa_pagu: string; // anggaran - nilai kontrak
}

interface LaporanMingguan {
  minggu: string;
  target_fisik_perminggu: string; // persen
  realisasi_fisik_perminggu: string; // persen
  deviasi: string;

  target_realisasi_anggaran_per_termin: string;
  reaisasi_per_termin: string;
  sisa_kontrak: string;

  tingkat_capaiannya_keberhasilan: string;
  tindak_lanjut_rekomendasi_sebelumnya: string;
  permasalahan: string;
  rekomendasi: string;
}

// Gabungan
type FormData = DataPengawasan & LaporanMingguan;

export default function DetailPelaksaan() {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const params = useParams();
  const id = params?.id;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSubmit = (data: DataPengawasan) => {
    console.log("Submitted data:", data);
    setIsEdit(false); // balik lagi jadi readonly setelah simpan
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
    // Optional: reset form ke data awal jika diperlukan
    // reset(originalData);
  };

  return (
    <Mainlayout>
      <div className="">
        <div className="mx-auto p-6 bg-white shadow rounded-lg">
          {/* Header dengan tombol Edit */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Data Pengawasan</h2>
            {!isEdit && (
              <button
                type="button"
                onClick={handleEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Edit
              </button>
            )}
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* --- Data Pengawasan --- */}

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
                    setValueAs: (v) => Number(v), // pastikan number
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

            {/* --- Submit Button (hanya muncul saat edit) --- */}
            {isEdit && (
              <div className="pt-4 flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Batal
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Mainlayout>
  );
}
