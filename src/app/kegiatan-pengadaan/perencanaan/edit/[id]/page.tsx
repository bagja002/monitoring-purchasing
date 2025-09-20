"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Mainlayout from "@/component/layout";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Loader2, FileText, Download, Eye } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "cookies-next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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

// File Preview Component
const FilePreview = ({
  fileUrl,
  fileName,
}: {
  fileUrl: string;
  fileName: string;
}) => {
  const baseUrl = "http://103.177.176.202:6402";
  const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${baseUrl}${fileUrl}`;

  const handlePreview = () => {
    window.open(fullUrl, "_blank");
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName || "download";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-gray-700 truncate max-w-xs">
            {fileName || "File tersedia"}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handlePreview}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Preview File"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 text-green-600 hover:text-green-800 transition-colors"
            title="Download File"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function EditKegiatanForm() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [Loading, setLoading] = useState<boolean>(false);
  const { register, setValue, handleSubmit, watch, control, reset } =
    useForm<PerencanaanKegiatan>();

  const kategori = watch("KategoriPengadaan");
  const baseUrl = "http://103.177.176.202:6402";

  // State untuk menyimpan URL file yang ada
  const [existingFiles, setExistingFiles] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    try {
      const token = getCookie("XSX01");
      if (typeof token === "string" && token) {
        const decoded = jwtDecode<DecodedToken>(token);
        setValue("IdSatdik", Number(decoded.id_unit_kerja));
        setValue("Satdik", decoded.satdik);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }

    console.log(existingFiles);
  }, [setValue, existingFiles]);

  const fetchData = useCallback(async () => {
    if (!id) return; // safety
    try {
      const res = await axios.get(
        `${baseUrl}/operator/getRencanaPengadaanByid?id=${id}`
      );
      const k = res.data;

      // Simpan file URLs untuk preview
      const fileUrls: Record<string, string> = {};

      // Map semua field file
      const fileFields = [
        "ManajemenResikoFile1",
        "ManajemenResikoFile2",
        "TimeLine",
        "SirupPBarang",
        "KakPBarang",
        "RabPBarang",
        "HpsPenetapanPBarang",
        "RancanganKontrakPBarang",
        "SirupPKonsultanPerencanaan",
        "KakPKonsultanPerencanaan",
        "RabPKonsultanPerencanaan",
        "HpsPenetapanPKonsultanPerencanaan",
        "RancanganKontrakPKonsultanPerencanaan",
        "SirupPKontruksi",
        "KakPKontruksi",
        "RabPKontruksi",
        "GambarPerencanaan",
        "RekomendasiPupr",
        "HpsPenetapanPKontruksi",
        "RancanganKontrakPKontruksi",
        "SirupPKonsultanPengawas",
        "KakPKonsultanPengawas",
        "RabPKonsultanPengawas",
        "HpsUraianPKonsultanPengawas",
        "RancanganKontrakPKonsultanPengawas",
      ];

      fileFields.forEach((field) => {
        const snakeField = field
          .replace(/([A-Z])/g, "_$1")
          .toLowerCase()
          .replace(/^_/, "");
        if (k[snakeField] && k[snakeField] !== "") {
          fileUrls[field] = k[snakeField];
        }
      });

      setExistingFiles(fileUrls);

      const mappedData: PerencanaanKegiatan = {
        IdPerencanaanKegiatan: k.id_perencanaan_kegiatan,
        IdSatdik: k.id_satdik,
        Satdik: k.satdik,
        NamaPekerjaan: k.nama_pekerjaan,
        ManajemenResiko: k.manajemen_resiko,
        ManajemenResikoFile1: k.manajemen_resiko_file1,
        ManajemenResikoFile2: k.manajemen_resiko_file2,
        Anggaran: k.anggaran,
        JadwalPengadaan: k.jadwal_pengadaan,
        KategoriPengadaan: k.kategori_pengadaan,
        TimeLine: k.timeline || "",

        SirupPBarang: k.sirup_p_barang,
        MetodePemilihanPBarang: k.metode_pemilihan_p_barang,
        JustifikasiPemilihanPBarang: k.justifikasi_pemilihan_p_barang,
        KakPBarang: k.kak_p_barang,
        RabPBarang: k.rab_p_barang,
        HpsPenetapanPBarang: k.hps_penetapan_p_barang,
        HpsNilaiPBarang: Number(k.hps_nilai_p_barang) || 0,
        HasilSurveiPBarang: k.hasil_survei_p_barang,
        RancanganKontrakPBarang: k.rancangan_kontrak_p_barang,
        HasilPendampinganPBarang: k.hasil_pendampingan_p_barang,

        // Set show flags berdasarkan keberadaan file
        showKakPengadaan: !!(k.kak_p_barang && k.kak_p_barang !== ""),
        showRabPengadaan: !!(k.rab_p_barang && k.rab_p_barang !== ""),
        showSpkPengadaan: !!(
          k.rancangan_kontrak_p_barang && k.rancangan_kontrak_p_barang !== ""
        ),
        showHpsPenetapanPengadaan: !!(
          k.hps_penetapan_p_barang && k.hps_penetapan_p_barang !== ""
        ),

        // Konsultan Perencana
        SirupPKonsultanPerencanaan: k.sirup_p_konsultan_perencanaan,
        MetodePemilihanPKonsultanPerencanaan:
          k.metode_pemilihan_p_konsultan_perencanaan,
        JustifikasiPemilihanPKonsultanPerencanaan:
          k.justifikasi_pemilihan_p_konsultan_perencanaan,
        KakPKonsultanPerencanaan: k.kak_p_konsultan_perencanaan,
        RabPKonsultanPerencanaan: k.rab_p_konsultan_perencanaan,
        HpsPenetapanPKonsultanPerencanaan:
          k.hps_penetapan_p_konsultan_perencanaan,
        HpsNilaiPKonsultanPerencanaan: k.hps_nilai_p_konsultan_perencanaan || 0,
        RancanganKontrakPKonsultanPerencanaan:
          k.rancangan_kontrak_p_konsultan_perencanaan,
        HasilPendampinganPKonsultanPerencanaan:
          k.hasil_pendampingan_p_konsultan_perencanaan,

        // Set show flags berdasarkan keberadaan file
        showKakPerencanaan: !!(
          k.kak_p_konsultan_perencanaan && k.kak_p_konsultan_perencanaan !== ""
        ),
        showRabPerencaan: !!(
          k.rab_p_konsultan_perencanaan && k.rab_p_konsultan_perencanaan !== ""
        ),
        showSpkPerencaan: !!(
          k.rancangan_kontrak_p_konsultan_perencanaan &&
          k.rancangan_kontrak_p_konsultan_perencanaan !== ""
        ),
        showHpsPenetapanPerencanaan: !!(
          k.hps_penetapan_p_konsultan_perencanaan &&
          k.hps_penetapan_p_konsultan_perencanaan !== ""
        ),

        // Konstruksi
        SirupPKontruksi: k.sirup_p_kontruksi,
        MetodePemilihanPKonstruksi: k.metode_pemilihan_p_kontruksi,
        JustifikasiPemilihanPKonstruksi: k.justifikasi_pemilihan_p_kontruksi,
        KakPKonstruksi: k.kak_p_kontruksi,
        RabPKonstruksi: k.rab_p_kontruksi,
        GambarPerencanaan: k.gambar_perencanaan,
        SpesifikasiTeknis: k.spesifikasi_teknis,
        RekomendasiPUPR: k.rekomendasi_pupr,
        HpsPenetapanPKonstruksi: k.hps_penetapan_p_kontruksi,
        HpsNilaiPKonstruksi: Number(k.hps_nilai_p_kontruksi) || 0,
        RancanganKontrakPKonstruksi: k.rancangan_kontrak_p_kontruksi,
        HasilPendampinganPKonstruksi: k.hasil_pendampingan_p_kontruksi,
        showKakKonstruksi: !!(k.kak_p_kontruksi && k.kak_p_kontruksi !== ""),
        showHpsPenetapanKonstruksi: !!(
          k.hps_penetapan_p_kontruksi && k.hps_penetapan_p_kontruksi !== ""
        ),
        showRabKonstruksi: !!(k.rab_p_kontruksi && k.rab_p_kontruksi !== ""),
        showSpkKonstruksi: !!(
          k.rancangan_kontrak_p_kontruksi &&
          k.rancangan_kontrak_p_kontruksi !== ""
        ),

        showGambar: !!(k.gambar_perencanaan && k.gambar_perencanaan !== ""),
        showPupr: !!(k.rekomendasi_pupr && k.rekomendasi_pupr !== ""),

        showKakPengawasan: !!(
          k.kak_p_konsultan_pengawas && k.kak_p_konsultan_pengawas !== ""
        ),
        showHpsPenetapanPengawasan: !!(
          k.hps_uraian_p_konsultan_pengawas &&
          k.hps_uraian_p_konsultan_pengawas !== ""
        ),
        showRabPengawasan: !!(
          k.kak_p_konsultan_pengawas && k.kak_p_konsultan_pengawas !== ""
        ),
        showSpkPengawasan: !!(
          k.rancangan_kontrak_p_konsultan_pengawas &&
          k.rancangan_kontrak_p_konsultan_pengawas !== ""
        ),

        // Konsultan Pengawas
        SirupPKonsultanPengawas: k.sirup_p_konsultan_pengawas,
        MetodePemilihanPKonsultanPengawas:
          k.metode_pemilihan_p_konsultan_pengawas,
        JustifikasiPemilihanPKonsultanPengawas:
          k.justifikasi_pemilihan_p_konsultan_pengawas,
        KakPKonsultanPengawas: k.kak_p_konsultan_pengawas,
        RabPKonsultanPengawas: k.rab_p_konsultan_pengawas,
        HpsUraianPKonsultanPengawas: k.hps_uraian_p_konsultan_pengawas,
        HpsNilaiPKonsultanPengawas:
          Number(k.hps_nilai_p_konsultan_pengawas) || 0,
        RancanganKontrakPKonsultanPengawas:
          k.rancangan_kontrak_p_konsultan_pengawas,
        HasilPendampinganPKonsultanPengawas:
          k.hasil_pendampingan_p_konsultan_pengawas,
      };

      reset(mappedData);
    } catch (err) {
      console.error("Gagal fetch data:", err);
      toast.error("Gagal memuat data untuk update");
    }
  }, [id, reset]);

  useEffect(() => {
    
    fetchData();
  }, [fetchData]);

  const onSubmit: SubmitHandler<PerencanaanKegiatan> = async (data) => {
    if (!id) {
      toast.error("ID tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("IdPerencanaanKegiatan", id.toString());

      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith("show") || key === "IdPerencanaanKegiatan") return;

        if (value instanceof FileList) {
          if (value.length > 0) {
            formData.append(key, value[0]);
          }
        } else if (typeof value === "number") {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value as string);
        }
      });

      const response = await axios.put(
        `${baseUrl}/operator/updateRencanaPengadaan?id=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getCookie("XSX01")}`,
          },
          timeout: 60000,
        }
      );

      toast.success("Data berhasil diupdate!", {
        description: "Perencanaan kegiatan telah diperbarui",
        duration: 4000,
      });

      router.push("/kegiatan-pengadaan/perencanaan");
    } catch (error) {
      console.error("Update error:", error);

      let errorMessage = "Gagal menyimpan data!";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Error ${error.response.status}: ${
            error.response.data?.message || "Unknown error"
          }`;
        } else if (error.request) {
          errorMessage = "Tidak dapat terhubung ke server";
        }
      }

      toast.error("Update gagal!", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
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
        <h1 className="text-2xl font-bold mb-4">Edit Rencana Pengadaan</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("IdSatdik")} />

          <div>
            <Label className="mb-2">Satuan Pendidikan</Label>
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
            <div className="mt-4 space-y-4">
              <div>
                <Label>Upload Dokumen 1</Label>
                {existingFiles.ManajemenResikoFile1 && (
                  <FilePreview
                    fileUrl={existingFiles.ManajemenResikoFile1}
                    fileName="Dokumen Manajemen Resiko 1"
                  />
                )}
                <input
                  type="file"
                  {...register("ManajemenResikoFile1")}
                  className="w-full p-2 border rounded mt-2"
                  accept=".pdf,.doc,.docx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload file baru untuk mengganti file yang ada
                </p>
              </div>

              <div>
                <Label>Upload Dokumen 2</Label>
                {existingFiles.ManajemenResikoFile2 && (
                  <FilePreview
                    fileUrl={existingFiles.ManajemenResikoFile2}
                    fileName="Dokumen Manajemen Resiko 2"
                  />
                )}
                <input
                  type="file"
                  {...register("ManajemenResikoFile2")}
                  className="w-full p-2 border rounded mt-2"
                  accept=".pdf,.doc,.docx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload file baru untuk mengganti file yang ada
                </p>
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
            {existingFiles.TimeLine && (
              <FilePreview
                fileUrl={existingFiles.TimeLine}
                fileName="Timeline Document"
              />
            )}
            <input
              type="file"
              {...register("TimeLine")}
              className="w-full p-2 border rounded mt-2"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
            {existingFiles.TimeLine && (
              <p className="text-xs text-gray-500 mt-1">
                Upload file baru untuk mengganti file yang ada
              </p>
            )}
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
                {existingFiles.SirupPBarang && (
                  <FilePreview
                    fileUrl={existingFiles.SirupPBarang}
                    fileName="SiRUP Pengadaan Barang"
                  />
                )}
                <input
                  type="file"
                  {...register("SirupPBarang")}
                  className="w-full p-2 border rounded mt-2"
                  accept=".pdf,.doc,.docx"
                />
                {existingFiles.SirupPBarang && (
                  <p className="text-xs text-gray-500 mt-1">
                    Upload file baru untuk mengganti file yang ada
                  </p>
                )}
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

              <div className="grid grid-cols-2 gap-4">
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
                      {existingFiles.KakPBarang && (
                        <FilePreview
                          fileUrl={existingFiles.KakPBarang}
                          fileName="KAK Pengadaan Barang"
                        />
                      )}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...register("KakPBarang")}
                        className="w-full p-2 border rounded mt-2"
                      />
                      {existingFiles.KakPBarang && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
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
                      {existingFiles.RabPBarang && (
                        <FilePreview
                          fileUrl={existingFiles.RabPBarang}
                          fileName="RAB Pengadaan Barang"
                        />
                      )}
                      <input
                        type="file"
                        accept=".pdf,.xls,.xlsx"
                        {...register("RabPBarang")}
                        className="w-full p-2 border rounded mt-2"
                      />
                      {existingFiles.RabPBarang && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
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
                      {existingFiles.RancanganKontrakPBarang && (
                        <FilePreview
                          fileUrl={existingFiles.RancanganKontrakPBarang}
                          fileName="Rancangan Kontrak Pengadaan Barang"
                        />
                      )}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        {...register("RancanganKontrakPBarang")}
                        className="w-full p-2 border rounded mt-2"
                      />
                      {existingFiles.RancanganKontrakPBarang && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
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
                      {existingFiles.HpsPenetapanPKonsultanPerencanaan && (
                        <FilePreview
                          fileUrl={
                            existingFiles.HpsPenetapanPKonsultanPerencanaan
                          }
                          fileName="HPS Penetapan Pengadaan Barang"
                        />
                      )}
                      <input
                        type="file"
                        accept=".pdf,.xls,.xlsx"
                        {...register("HpsPenetapanPKonsultanPerencanaan")}
                        className="w-full p-2 border rounded mt-2"
                      />
                      {existingFiles.HpsPenetapanPKonsultanPerencanaan && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
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

          {/* Section untuk Perbaikan Gedung dan Bangunan */}
          {kategori === "Perbaikan Gedung " && (
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
          {["Perbaikan Gedung dan Bangunan", "Pembangunan Gedung Baru"].includes(kategori)  && (
            <>
              <Accordion type="single" collapsible className="w-full">
                {/* Konsultan Perencana */}
                {/* Konsultan Perencana */}
                <AccordionItem value="konsultan_perencana">
                  <AccordionTrigger>Konsultan Perencana</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <Label className="mb-2">SiRUP</Label>
                      {existingFiles.SirupPKonsultanPerencanaan && (
                        <FilePreview
                          fileUrl={existingFiles.SirupPKonsultanPerencanaan}
                          fileName="SiRUP Pengadaan Barang"
                        />
                      )}
                      <input
                        type="file"
                        {...register("SirupPKonsultanPerencanaan")}
                        className="w-full p-2 border rounded mt-2"
                        accept=".pdf,.doc,.docx"
                      />
                      {existingFiles.SirupPKonsultanPerencanaan && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
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
                      {/* KAK */}
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
                            {existingFiles.KakPKonsultanPerencanaan && (
                              <FilePreview
                                fileUrl={existingFiles.KakPKonsultanPerencanaan}
                                fileName="KAK Konsultan Perencanaan"
                              />
                            )}
                            <input
                              type="file"
                              {...register("KakPKonsultanPerencanaan")}
                              className="w-full p-2 border rounded"
                              accept=".pdf,.doc,.docx"
                            />
                            {existingFiles.KakPKonsultanPerencanaan && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* RAB */}
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
                            {existingFiles.RabPKonsultanPerencanaan && (
                              <FilePreview
                                fileUrl={existingFiles.RabPKonsultanPerencanaan}
                                fileName="RAB Konsultan Perencanaan"
                              />
                            )}
                            <input
                              type="file"
                              {...register("RabPKonsultanPerencanaan")}
                              className="w-full p-2 border rounded"
                              accept=".pdf,.xls,.xlsx"
                            />
                            {existingFiles.RabPKonsultanPerencanaan && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rancangan Kontrak / SPK */}
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
                            {existingFiles.RancanganKontrakPKonsultanPerencanaan && (
                              <FilePreview
                                fileUrl={
                                  existingFiles.RancanganKontrakPKonsultanPerencanaan
                                }
                                fileName="Rancangan Kontrak Perencanaan"
                              />
                            )}
                            <input
                              type="file"
                              {...register(
                                "RancanganKontrakPKonsultanPerencanaan"
                              )}
                              className="w-full p-2 border rounded"
                              accept=".pdf,.doc,.docx"
                            />
                            {existingFiles.RancanganKontrakPBarang && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* HPS Penetapan */}
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
                            {existingFiles.HpsPenetapanPKonsultanPerencanaan && (
                              <FilePreview
                                fileUrl={
                                  existingFiles.HpsPenetapanPKonsultanPerencanaan
                                }
                                fileName="HPS Penetapan Pengadaan Barang"
                              />
                            )}
                            <input
                              type="file"
                              {...register("HpsPenetapanPKonsultanPerencanaan")}
                              className="w-full p-2 border rounded"
                              accept=".pdf,.xls,.xlsx"
                            />
                            {existingFiles.HpsPenetapanPBarang && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* HPS Nilai */}
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

                    {/* Hasil Pendampingan */}
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
                      {existingFiles.SirupPKontruksi && (
                        <FilePreview
                          fileUrl={existingFiles.SirupPKontruksi}
                          fileName="SiRUP Konstruksi"
                        />
                      )}
                      <input
                        type="file"
                        {...register("SirupPKontruksi")}
                        className="w-full p-2 border rounded mt-2"
                        accept=".pdf,.doc,.docx"
                      />
                      {existingFiles.SirupPKontruksi && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
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
                      {/* KAK */}
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
                            {existingFiles.KakPKontruksi && (
                              <FilePreview
                                fileUrl={existingFiles.KakPKontruksi}
                                fileName="KAK Konstruksi"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("KakPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.KakPKontruksi && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* RAB */}
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
                            {existingFiles.RabPKontruksi && (
                              <FilePreview
                                fileUrl={existingFiles.RabPKontruksi}
                                fileName="RAB Konstruksi"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("RabPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.RabPKontruksi && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rancangan Kontrak/SPK */}
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

                            {existingFiles.RancanganKontrakPKontruksi && (
                              <FilePreview
                                fileUrl={
                                  existingFiles.RancanganKontrakPKontruksi
                                }
                                fileName="Rancangan Kontrak Konstruksi"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("RancanganKontrakPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.RancanganKontrakPKontruksi && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* HPS Penetapan */}
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
                            {existingFiles.HpsPenetapanPKontruksi && (
                              <FilePreview
                                fileUrl={existingFiles.HpsPenetapanPKontruksi}
                                fileName="HPS Penetapan Konstruksi"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("HpsPenetapanPKonstruksi")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.HpsPenetapanPKontruksi && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Gambar Perencanaan */}
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
                              Upload Gambar Perencanaan
                            </Label>
                            {existingFiles.GambarPerencanaan && (
                              <FilePreview
                                fileUrl={existingFiles.GambarPerencanaan}
                                fileName="Gambar Perencanaan"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.dwg"
                              {...register("GambarPerencanaan")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.GambarPerencanaan && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Rekomendasi PUPR */}
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
                            {existingFiles.RekomendasiPupr && (
                              <FilePreview
                                fileUrl={existingFiles.RekomendasiPupr}
                                fileName="Rekomendasi PUPR"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("RekomendasiPUPR")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.RekomendasiPupr && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
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
                    {/* SiRUP */}
                    <div>
                      <Label className="mb-2">SiRUP Konsultan Pengawas</Label>
                      {existingFiles.SirupPKonsultanPengawas && (
                        <FilePreview
                          fileUrl={existingFiles.SirupPKonsultanPengawas}
                          fileName="SiRUP Konsultan Pengawas"
                        />
                      )}
                      <input
                        type="file"
                        {...register("SirupPKonsultanPengawas")}
                        className="w-full p-2 border rounded mt-2"
                        accept=".pdf,.doc,.docx"
                      />
                      {existingFiles.SirupPKonsultanPengawas && (
                        <p className="text-xs text-gray-500 mt-1">
                          Upload file baru untuk mengganti file yang ada
                        </p>
                      )}
                    </div>

                    {/* Metode Pemilihan */}
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

                    {/* Justifikasi */}
                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register("JustifikasiPemilihanPKonsultanPengawas")}
                        placeholder="Justifikasi Pemilihan Konsultan Pengawas"
                      />
                    </div>

                    {/* File Upload dengan Checkbox */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* KAK */}
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
                            {existingFiles.KakPKonsultanPengawas && (
                              <FilePreview
                                fileUrl={existingFiles.KakPKonsultanPengawas}
                                fileName="KAK Konsultan Pengawas"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register("KakPKonsultanPengawas")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.KakPKonsultanPengawas && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* RAB */}
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
                            {existingFiles.RabPKonsultanPengawas && (
                              <FilePreview
                                fileUrl={existingFiles.RabPKonsultanPengawas}
                                fileName="RAB Konsultan Pengawas"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("RabPKonsultanPengawas")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.RabPKonsultanPengawas && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* SPK */}
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
                            {existingFiles.RancanganKontrakPKonsultanPengawas && (
                              <FilePreview
                                fileUrl={
                                  existingFiles.RancanganKontrakPKonsultanPengawas
                                }
                                fileName="Rancangan Kontrak Konsultan Pengawas"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              {...register(
                                "RancanganKontrakPKonsultanPengawas"
                              )}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.RancanganKontrakPKonsultanPengawas && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* HPS Uraian */}
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
                            {existingFiles.HpsUraianPKonsultanPengawas && (
                              <FilePreview
                                fileUrl={
                                  existingFiles.HpsUraianPKonsultanPengawas
                                }
                                fileName="HPS Uraian Konsultan Pengawas"
                              />
                            )}
                            <input
                              type="file"
                              accept=".pdf,.xls,.xlsx"
                              {...register("HpsUraianPKonsultanPengawas")}
                              className="w-full p-2 border rounded"
                            />
                            {existingFiles.HpsUraianPKonsultanPengawas && (
                              <p className="text-xs text-gray-500 mt-1">
                                Upload file baru untuk mengganti file yang ada
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* HPS Nilai */}
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

                    {/* Hasil Pendampingan */}
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
              "Update Data"
            )}
          </Button>
        </form>
      </div>
    </Mainlayout>
  );
}
