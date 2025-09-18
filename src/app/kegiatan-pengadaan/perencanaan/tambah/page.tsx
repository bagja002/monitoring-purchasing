"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { toast } from "sonner";
import Mainlayout from "@/component/layout";
import axios from "axios";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PerencanaanKegiatan {
  IdPerencanaanKegiatan?: number;
  IdSatdik: number;
  Satdik: string;
  NamaPekerjaan: string;

  ManajemenResiko: string;
  ManajemenResikoFile1: FileList | string;
  ManajemenResikoFile2: FileList | string;
  Anggaran: number;
  JadwalPengadaan: string;
  KategoriPengadaan: string;
  TimeLine: FileList | string;

  // Bagian Pengadaan Barang
  SirupPBarang: FileList | string;
  MetodePemilihanPBarang: string;
  JustifikasiPemilihanPBarang: string;
  KakPBarang: FileList | string;
  RabPBarang: FileList | string;
  HpsPenetapanPBarang: FileList | string;
  HpsNilaiPBarang: number;
  HasilSurveiPBarang: string;
  RancanganKontrakPBarang: FileList | string;
  HasilPendampinganPBarang: string;

  // Konsultan Perencana
  SirupPKonsultanPerencanaan: FileList | string;
  MetodePemilihanPKonsultanPerencanaan: string;
  JustifikasiPemilihanPKonsultanPerencanaan: string;
  KakPKonsultanPerencanaan: FileList | string;
  RabPKonsultanPerencanaan: FileList | string;
  HpsPenetapanPKonsultanPerencanaan: FileList | string;
  HpsNilaiPKonsultanPerencanaan: number;
  RancanganKontrakPKonsultanPerencanaan: FileList | string;
  HasilPendampinganPKonsultanPerencanaan: string;

  // Konstruksi
  SirupPKontruksi: FileList | string;
  MetodePemilihanPKontruksi: string;
  JustifikasiPemilihanPKontruksi: string;
  KakPKontruksi: FileList | string;
  RabPKontruksi: FileList | string;
  GambarPerencanaan: FileList | string;
  SpesifikasiTeknis: string;
  RekomendasiPupr: FileList | string;
  HpsPenetapanPKontruksi: FileList | string;
  HpsNilaiPKontruksi: number;
  RancanganKontrakPKontruksi: FileList | string;
  HasilPendampinganPKontruksi: string;

  // Konsultan Pengawas
  SirupPKonsultanPengawas: FileList | string;
  MetodePemilihanPKonsultanPengawas: string;
  JustifikasiPemilihanPKonsultanPengawas: string;
  KakPKonsultanPengawas: FileList | string;
  RabPKonsultanPengawas: FileList | string;
  HpsUraianPKonsultanPengawas: FileList | string;
  HpsNilaiPKonsultanPengawas: number;
  RancanganKontrakPKonsultanPengawas: FileList | string;
  HasilPendampinganPKonsultanPengawas: string;

  CreatedAt?: string;
  UpdatedAt?: string;

  showKakPengadaan?: boolean;
  showHpsPenetapanPengadaan?: boolean;
  showRabPengadaan?: boolean;
  showSpkPengadaan?: boolean;
  showGambar?: boolean;
  showPupr?: boolean;
}

export default function TambahKegiatanForm() {
  const router = useRouter();
  const [Loading, setLoading] = useState<boolean>(false);
  const { register, handleSubmit, watch, control } =
    useForm<PerencanaanKegiatan>();
  const kategori = watch("KategoriPengadaan");

  const onSubmit: SubmitHandler<PerencanaanKegiatan> = async (data) => {
    const formData = new FormData();

    setLoading(true)

    const baseUrl = "http://103.177.176.202:6402";
    // Loop semua key di data
    Object.entries(data).forEach(([key, value]) => {
      // Skip checkbox helper fields
      if (key.startsWith("show")) return;

      if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]); // ambil file pertama
        }
      } else if (typeof value === "number") {
        formData.append(key, value.toString());
      } else if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value as string);
      }
    });

    try {
      const Response = await axios.post(
        `${baseUrl}/operator/createRencanaPengadaan`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Data berhasil dikirim!", {
        description: "Perencanaan kegiatan telah tersimpan",
        duration: 4000,
      });
    } catch (error) {
      // Toast error
      toast.error("Gagal mengirim data!", {
        description:
          "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
        duration: 5000,
      });
    } finally {
    // Always reset loading state
    setLoading(false);
  }
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Mainlayout>
      <div className="mx-auto p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Tambah Rencana Pengadaan</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">Satuan Pendidikan</Label>
            <Input {...register("Satdik")} placeholder="Satuan Pendidikan" />
          </div>

          <div>
            <Label className="mb-2">Nama Pekerjaan</Label>
            <Input
              {...register("NamaPekerjaan")}
              placeholder="Nama Pekerjaan"
            />
          </div>

          <div>
            <Label className="mb-2">Manajemen Resiko</Label>
            <select
              {...register("ManajemenResiko")}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Manajemen Resiko</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
          </div>

          {watch("ManajemenResiko") && (
            <div className="mt-4 space-y-2">
              <div>
                <Label>Upload Dokumen 1</Label>
                <input
                  type="file"
                  {...register("ManajemenResikoFile1")}
                  className="w-full p-2 border rounded"
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <div>
                <Label>Upload Dokumen 2</Label>
                <input
                  type="file"
                  {...register("ManajemenResikoFile2")}
                  className="w-full p-2 border rounded"
                  accept=".pdf,.doc,.docx"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="mb-2">Anggaran</Label>
            <Controller
              name="Anggaran"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Anggaran"
                  value={field.value ? formatRupiah(field.value) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const parsed = raw ? parseInt(raw, 10) : 0;
                    field.onChange(parsed);
                  }}
                />
              )}
            />
          </div>

          <div>
            <Label className="mb-2">Jadwal Pengadaan</Label>
            <Input
              {...register("JadwalPengadaan")}
              placeholder="Jadwal Pengadaan"
            />
          </div>

          <div>
            <Label className="mb-2">Time Line</Label>
            <input
              type="file"
              {...register("TimeLine")}
              className="w-full p-2 border rounded"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </div>

          <div>
            <Label className="mb-2">Kategori Pengadaan</Label>
            <select
              {...register("KategoriPengadaan")}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Kategori Pengadaan</option>
              <option value="Pengadaan Barang">Pengadaan Barang</option>
              <option value="Perbaikan Gedung dan Bangunan">
                Perbaikan Gedung dan Bangunan
              </option>
              <option value="Pembangunan Gedung Baru">
                Pembangunan Gedung Baru
              </option>
            </select>
          </div>

          {kategori === "Pengadaan Barang" && (
            <>
              <div>
                <Label className="mb-2">SiRUP</Label>
                <input
                  type="file"
                  {...register("SirupPBarang")}
                  className="w-full p-2 border rounded"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              <div>
                <Label className="mb-2">Metode Pemilihan</Label>
                <select
                  {...register("MetodePemilihanPBarang")}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Pilih Metode Pemilihan</option>
                  <option value="E-purchasing">E-purchasing</option>
                  <option value="Penunjukan Langsung">
                    Penunjukan Langsung
                  </option>
                  <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                  <option value="Tender Cepat">Tender Cepat</option>
                </select>
              </div>

              <div>
                <Label className="mb-2">Justifikasi Pemilihan</Label>
                <Textarea
                  {...register("JustifikasiPemilihanPBarang")}
                  placeholder="Justifikasi Pemilihan"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showKakPengadaan")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>KAK</span>
                  </label>

                  {watch("showKakPengadaan") && (
                    <div className="mt-2">
                      <Label className="mb-2">Upload KAK</Label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...register("KakPBarang")}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showRabPengadaan")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>RAB</span>
                  </label>

                  {watch("showRabPengadaan") && (
                    <div className="mt-2">
                      <Label className="mb-2">Upload RAB</Label>
                      <input
                        type="file"
                        accept=".pdf,.xls,.xlsx"
                        {...register("RabPBarang")}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showSpkPengadaan")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>Rancangan Kontrak/SPK</span>
                  </label>

                  {watch("showSpkPengadaan") && (
                    <div className="mt-2">
                      <Label className="mb-2">
                        Upload Rancangan Kontrak/SPK
                      </Label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...register("RancanganKontrakPBarang")}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showHpsPenetapanPengadaan")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>HPS Penetapan</span>
                  </label>

                  {watch("showHpsPenetapanPengadaan") && (
                    <div className="mt-2">
                      <Label className="mb-2">Upload HPS Penetapan</Label>
                      <input
                        type="file"
                        accept=".pdf,.xls,.xlsx"
                        {...register("HpsPenetapanPBarang")}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="mb-2">HPS Nilai</Label>
                <Controller
                  name="HpsNilaiPBarang"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="HPS Nilai"
                      value={field.value ? formatRupiah(field.value) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const parsed = raw ? parseInt(raw, 10) : 0;
                        field.onChange(parsed);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <Label className="mb-2">Hasil Survei</Label>
                <Textarea
                  {...register("HasilSurveiPBarang")}
                  placeholder="Hasil Survei"
                />
              </div>

              <div>
                <Label className="mb-2">Hasil Pendampingan</Label>
                <Textarea
                  {...register("HasilPendampinganPBarang")}
                  placeholder="Hasil Pendampingan"
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={Loading}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </Button>
        </form>
      </div>
    </Mainlayout>
  );
}
