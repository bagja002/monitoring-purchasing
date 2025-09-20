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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";

interface DecodedToken {
  exp: number;
  id_admin: string;
  id_unit_kerja: string;
  satdik: string;
  name: string;
  role: string;
  type: string;
}

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
  MetodePemilihanPKonstruksi: string;
  JustifikasiPemilihanPKonstruksi: string;
  KakPKonstruksi: FileList | string;
  RabPKonstruksi: FileList | string;
  GambarPerencanaan: FileList | string;
  SpesifikasiTeknis: FileList | string;
  RekomendasiPUPR: FileList | string;
  HpsPenetapanPKonstruksi: FileList | string;
  HpsNilaiPKonstruksi: number;
  RancanganKontrakPKonstruksi: FileList | string;
  HasilPendampinganPKonstruksi: string;

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

  showKakPerencanaan?: boolean;
  showHpsPenetapanPerencanaan?: boolean;
  showRabPerencaan?: boolean;
  showSpkPerencaan?: boolean;

  showKakKonstruksi?: boolean;
  showHpsPenetapanKonstruksi?: boolean;
  showRabKonstruksi?: boolean;
  showSpkKonstruksi?: boolean;

  showKakPengawasan?: boolean;
  showHpsPenetapanPengawasan?: boolean;
  showRabPengawasan?: boolean;
  showSpkPengawasan?: boolean;
}

export default function TambahKegiatanForm() {
  const router = useRouter();
  const [Loading, setLoading] = useState<boolean>(false);
  const { register, setValue, handleSubmit, watch, control } =
    useForm<PerencanaanKegiatan>();
  const kategori = watch("KategoriPengadaan");

  useEffect(() => {
    try {
      // Get token from cookie
      const token = getCookie("XSX01");

      if (typeof token === "string" && token) {
        // Decode token
        const decoded = jwtDecode<DecodedToken>(token);

        // Set user data
        setValue("IdSatdik", Number(decoded.id_unit_kerja));
        setValue("Satdik", decoded.satdik);

        console.log("Decoded token:", decoded);
      } else {
        console.log("No token found or token is not a string");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<PerencanaanKegiatan> = async (data) => {
    const formData = new FormData();

    setLoading(true);

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
      console.log(Response.data)
      toast.success("Data berhasil dikirim!", {
        description: "Perencanaan kegiatan telah tersimpan",
        duration: 4000,
      });
      router.push("/kegiatan-pengadaan/perencanaan")
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
          {/* IdSatdik field - hidden input */}
          <input type="hidden" {...register("IdSatdik")} />
          <div>
            <Label className="mb-2"> Satuan Pendidikan</Label>
            <Input
              readOnly
              {...register("Satdik")}
              placeholder="Satuan Pendidikan"
            />
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
          {["Perbaikan Gedung dan Bangunan", "Pembangunan Gedung Baru"].includes(kategori) && (
            <>
              <Accordion type="single" collapsible className="w-full">
                {/* Konsultan Perencana */}
                <AccordionItem value="konsultan_perencana">
                  <AccordionTrigger>Konsultan Perencana</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <Label className="mb-2">SiRUP Konsultan Perencana</Label>
                      <input
                        type="file"
                        {...register("SirupPKonsultanPerencanaan")}
                        className="w-full p-2 border rounded"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Metode Pemilihan</Label>
                      <select
                        {...register("MetodePemilihanPKonsultanPerencanaan")}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Pilih Metode Pemilihan</option>
                        <option value="Tender Terbuka">Tender Terbuka</option>
                        <option value="Tender Terbatas">Tender Terbatas</option>
                        <option value="Penunjukan Langsung">
                          Penunjukan Langsung
                        </option>
                        <option value="Pengadaan Langsung">
                          Pengadaan Langsung
                        </option>
                      </select>
                    </div>

                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register(
                          "JustifikasiPemilihanPKonsultanPerencanaan"
                        )}
                        placeholder="Justifikasi Pemilihan Konsultan Perencana"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showKakPerencanaan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>KAK</span>
                        </label>

                        {watch("showKakPerencanaan") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload KAK</Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("KakPKonsultanPerencanaan")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showRabPerencaan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>RAB</span>
                        </label>

                        {watch("showRabPerencaan") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload RAB</Label>
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("RabPKonsultanPerencanaan")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showSpkPerencaan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rancangan Kontrak/SPK</span>
                        </label>

                        {watch("showSpkPerencaan") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rancangan Kontrak/SPK
                            </Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register(
                                "RancanganKontrakPKonsultanPerencanaan"
                              )}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showHpsPenetapanPerencanaan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>HPS Penetapan</span>
                        </label>

                        {watch("showHpsPenetapanPerencanaan") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload HPS Penetapan</Label>
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("HpsPenetapanPKonsultanPerencanaan")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">HPS Nilai</Label>
                      <Controller
                        name="HpsNilaiPKonsultanPerencanaan"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Nilai Konsultan Perencana"
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
                      <Label className="mb-2">Hasil Pendampingan</Label>
                      <Textarea
                        {...register("HasilPendampinganPKonsultanPerencanaan")}
                        placeholder="Hasil Pendampingan Konsultan Perencana"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Konstruksi */}
                <AccordionItem value="konstruksi">
                  <AccordionTrigger>Konstruksi</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <Label className="mb-2">SiRUP Konstruksi</Label>
                      <input
                        type="file"
                        {...register("SirupPKontruksi")}
                        className="w-full p-2 border rounded"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Metode Pemilihan</Label>
                      <select
                        {...register("MetodePemilihanPKonstruksi")}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Pilih Metode Pemilihan</option>
                        <option value="Tender Terbuka">Tender Terbuka</option>
                        <option value="Tender Terbatas">Tender Terbatas</option>
                        <option value="Penunjukan Langsung">
                          Penunjukan Langsung
                        </option>
                        <option value="Pengadaan Langsung">
                          Pengadaan Langsung
                        </option>
                      </select>
                    </div>

                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register("JustifikasiPemilihanPKonstruksi")}
                        placeholder="Justifikasi Pemilihan Konstruksi"
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Spesifikasi Teknis</Label>
                      <Textarea
                        {...register("SpesifikasiTeknis")}
                        placeholder="Spesifikasi Teknis"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showKakKonstruksi")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>KAK</span>
                        </label>

                        {watch("showKakKonstruksi") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload KAK</Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("KakPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showRabKonstruksi")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>RAB</span>
                        </label>

                        {watch("showRabKonstruksi") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload RAB</Label>
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("RabPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showSpkKonstruksi")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rancangan Kontrak/SPK</span>
                        </label>

                        {watch("showSpkKonstruksi") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rancangan Kontrak/SPK
                            </Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("RancanganKontrakPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showHpsPenetapanKonstruksi")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>HPS Penetapan</span>
                        </label>

                        {watch("showHpsPenetapanKonstruksi") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload HPS Penetapan</Label>
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("HpsPenetapanPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showGambar")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Gambar Perencanaan</span>
                        </label>

                        {watch("showGambar") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Gambar Perencanaan/DED
                            </Label>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.dwg"
                              {...register("GambarPerencanaan")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showPupr")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rekomendasi PUPR</span>
                        </label>

                        {watch("showPupr") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rekomendasi PUPR
                            </Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("RekomendasiPUPR")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">HPS Nilai</Label>
                      <Controller
                        name="HpsNilaiPKonstruksi"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Nilai Konstruksi"
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
                      <Label className="mb-2">Hasil Pendampingan</Label>
                      <Textarea
                        {...register("HasilPendampinganPKonstruksi")}
                        placeholder="Hasil Pendampingan Konstruksi"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Konsultan Pengawas */}
                <AccordionItem value="konsultan_pengawas">
                  <AccordionTrigger>Konsultan Pengawas</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <Label className="mb-2">SiRUP Konsultan Pengawas</Label>
                      <input
                        type="file"
                        {...register("SirupPKonsultanPengawas")}
                        className="w-full p-2 border rounded"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Metode Pemilihan</Label>
                      <select
                        {...register("MetodePemilihanPKonsultanPengawas")}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Pilih Metode Pemilihan</option>
                        <option value="Tender Terbuka">Tender Terbuka</option>
                        <option value="Tender Terbatas">Tender Terbatas</option>
                        <option value="Penunjukan Langsung">
                          Penunjukan Langsung
                        </option>
                        <option value="Pengadaan Langsung">
                          Pengadaan Langsung
                        </option>
                      </select>
                    </div>

                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register("JustifikasiPemilihanPKonsultanPengawas")}
                        placeholder="Justifikasi Pemilihan Konsultan Pengawas"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showKakPengawasan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>KAK</span>
                        </label>

                        {watch("showKakPengawasan") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload KAK</Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("KakPKonsultanPengawas")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showRabPengawasan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>RAB</span>
                        </label>

                        {watch("showRabPengawasan") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload RAB</Label>
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("RabPKonsultanPengawas")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showSpkPengawasan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rancangan Kontrak/SPK</span>
                        </label>

                        {watch("showSpkPengawasan") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rancangan Kontrak/SPK
                            </Label>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register(
                                "RancanganKontrakPKonsultanPengawas"
                              )}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showHpsPenetapanPengawasan")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>HPS Uraian</span>
                        </label>

                        {watch("showHpsPenetapanPengawasan") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload HPS Uraian</Label>
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("HpsUraianPKonsultanPengawas")}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">HPS Nilai</Label>
                      <Controller
                        name="HpsNilaiPKonsultanPengawas"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Nilai Konsultan Pengawas"
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
                      <Label className="mb-2">Hasil Pendampingan</Label>
                      <Textarea
                        {...register("HasilPendampinganPKonsultanPengawas")}
                        placeholder="Hasil Pendampingan Konsultan Pengawas"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
