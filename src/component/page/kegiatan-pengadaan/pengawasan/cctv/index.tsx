"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import Mainlayout from "@/component/layout";
import LiveStream from "@/component/live-stream";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Constants
const API_BASE_URL = "http://103.177.176.202:6402";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const REQUEST_TIMEOUT = 10000; // 10 seconds

// Types
interface CCTVData {
  id_cctv: number;
  id_pelaksanaan_pengadaan: number;
  nama: string;
  lokasi: string;
  link_cctv: string;
}

interface FormData {
  nama: string;
  id_pelaksanaan_pengadaan: number;
  lokasi: string;
  link_cctv: string;
}

interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

interface PerencanaanKegiatanLaporanData {
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

// Utility Functions
const sanitizeInput = (input: string): string => {
  // Hanya menghapus karakter berbahaya (<>), tetap mempertahankan spasi
  return input.replace(/[<>]/g, "");
};

const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return (
      (urlObj.protocol === "https:" || urlObj.protocol === "http:") &&
      url.endsWith(".m3u8")
    );
  } catch {
    return false;
  }
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Axios Instance Configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Service with Axios and retry logic
class CCTVApiService {
  private static async requestWithRetry<T>(
    requestFn: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && axios.isAxiosError(error)) {
        // Retry untuk network errors atau timeout
        if (
          error.code === "ECONNABORTED" ||
          error.code === "ERR_NETWORK" ||
          !error.response
        ) {
          console.log(
            `Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`
          );
          await sleep(RETRY_DELAY);
          return this.requestWithRetry(requestFn, retries - 1);
        }
      }
      throw error;
    }
  }

  static async getAll(): Promise<CCTVData[]> {
    try {
      const response = await this.requestWithRetry(async () => {
        return await axiosInstance.get<ApiResponse<CCTVData[]>>("/cctv/getAll");
      });

      const data = response.data;
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error fetching CCTV data:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Gagal mengambil data CCTV: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Silakan coba lagi.");
        } else {
          throw new Error("Network error. Periksa koneksi internet Anda.");
        }
      }
      throw new Error("Gagal mengambil data CCTV dari server");
    }
  }

  static async getByPengadaan(idPengadaan: number): Promise<CCTVData[]> {
    try {
      const response = await this.requestWithRetry(async () => {
        return await axiosInstance.get<ApiResponse<CCTVData[]>>(
          `/cctv/getAll?id_pelaksanaan_pengadaan=${idPengadaan}`
        );
      });

      const data = response.data;
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error fetching CCTV data by pengadaan:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Return empty array jika tidak ada data
        } else if (error.response) {
          throw new Error(
            `Gagal mengambil data CCTV: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Silakan coba lagi.");
        } else {
          throw new Error("Network error. Periksa koneksi internet Anda.");
        }
      }
      throw new Error("Gagal mengambil data CCTV dari server");
    }
  }

  static async create(data: FormData): Promise<CCTVData> {
    try {
      const response = await this.requestWithRetry(async () => {
        return await axiosInstance.post<ApiResponse<CCTVData>>(
          "/cctv/create",
          data
        );
      });

      return (response.data.data ?? response.data) as CCTVData;
    } catch (error) {
      console.error("Error creating CCTV data:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          throw new Error("Data tidak valid. Periksa kembali input Anda.");
        } else if (error.response?.status === 409) {
          throw new Error("Data CCTV sudah ada.");
        } else if (error.response) {
          throw new Error(
            `Gagal menambahkan data: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Silakan coba lagi.");
        } else {
          throw new Error("Network error. Periksa koneksi internet Anda.");
        }
      }
      throw new Error("Gagal menambahkan data CCTV");
    }
  }

  static async update(id: number, data: FormData): Promise<CCTVData> {
    try {
      const response = await this.requestWithRetry(async () => {
        return await axiosInstance.put<ApiResponse<CCTVData>>(
          `/cctv/update?id=${id}`,
          data
        );
      });
      console.log("data", data);

      return (response.data.data ?? response.data) as CCTVData;
    } catch (error) {
      console.error("Error updating CCTV data:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Data CCTV tidak ditemukan.");
        } else if (error.response?.status === 400) {
          throw new Error("Data tidak valid. Periksa kembali input Anda.");
        } else if (error.response) {
          throw new Error(
            `Gagal mengupdate data: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Silakan coba lagi.");
        } else {
          throw new Error("Network error. Periksa koneksi internet Anda.");
        }
      }
      throw new Error("Gagal mengupdate data CCTV");
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await this.requestWithRetry(async () => {
        return await axiosInstance.delete(`/cctv/delete?id=${id}`);
      });
    } catch (error) {
      console.error("Error deleting CCTV data:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Data CCTV tidak ditemukan.");
        } else if (error.response) {
          throw new Error(
            `Gagal menghapus data: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Silakan coba lagi.");
        } else {
          throw new Error("Network error. Periksa koneksi internet Anda.");
        }
      }
      throw new Error("Gagal menghapus data CCTV");
    }
  }

  static async getPerencanaanKegiatanLaporan(
    idPerencanaanKegiatan: number
  ): Promise<PerencanaanKegiatanLaporanData[]> {
    try {
      const response = await this.requestWithRetry(async () => {
        return await axiosInstance.get(
          `/getPerencanaanKegiatanLaporan?id_perencanaan_kegiatan=${idPerencanaanKegiatan}`
        );
      });

      console.log("respon Kegiatan", response);

      const data = response.data.data;
      return Array.isArray(data) ? data : data.data || [];
    } catch (error) {
      console.error("Error fetching Perencanaan Kegiatan Laporan:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return []; // Return empty array jika tidak ada data
        } else if (error.response) {
          throw new Error(
            `Gagal mengambil data laporan: ${error.response.status} ${error.response.statusText}`
          );
        } else if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Silakan coba lagi.");
        } else {
          throw new Error("Network error. Periksa koneksi internet Anda.");
        }
      }
      throw new Error("Gagal mengambil data Perencanaan Kegiatan Laporan");
    }
  }
}

export default function PageCCTV() {
  // Get id_pelaksanaan_pengadaan from URL parameters
  const params = useParams();
  const rawId = params?.id;
  const idPelaksanaanPengadaan = Array.isArray(rawId) ? rawId[0] : rawId;

  // State Management
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | null;
    name: string;
  }>({ open: false, id: null, name: "" });

  const [formData, setFormData] = useState<FormData>({
    nama: "",
    lokasi: "",
    link_cctv: "",
    id_pelaksanaan_pengadaan: idPelaksanaanPengadaan
      ? parseInt(idPelaksanaanPengadaan)
      : 0,
  });
  const [cctvData, setCctvData] = useState<CCTVData[]>([]);
  const [laporanData, setLaporanData] =
    useState<PerencanaanKegiatanLaporanData | null>(null);
  console.log("laporan Data", laporanData);
  // Fetch data laporan perencanaan kegiatan
  const fetchLaporanData = useCallback(async () => {
    if (!idPelaksanaanPengadaan) return;

    try {
      const id = parseInt(idPelaksanaanPengadaan);
      const data = await CCTVApiService.getPerencanaanKegiatanLaporan(id);

      if (data && data.length > 0) {
        setLaporanData(data[0]); // Ambil data pertama
      }
    } catch (err) {
      console.error("Error fetching laporan data:", err);
      // Tidak perlu menampilkan error toast karena ini optional data
    }
  }, [idPelaksanaanPengadaan]);

  // Fetch data dengan error handling yang lebih baik
  const fetchCCTVData = useCallback(async () => {
    try {
      setFetching(true);
      setError(null);

      let data: CCTVData[];

      // Jika ada id_pelaksanaan_pengadaan di URL, filter berdasarkan itu
      if (idPelaksanaanPengadaan) {
        const id = parseInt(idPelaksanaanPengadaan);
        data = await CCTVApiService.getByPengadaan(id);
      } else {
        data = await CCTVApiService.getAll();
      }

      setCctvData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      toast.error(errorMessage, {
        description: "Gagal mengambil data CCTV dari server",
      });
    } finally {
      setFetching(false);
    }
  }, [idPelaksanaanPengadaan]);

  useEffect(() => {
    fetchCCTVData();
    fetchLaporanData();
  }, [fetchCCTVData, fetchLaporanData]);

  // Update formData ketika idPelaksanaanPengadaan berubah
  useEffect(() => {
    if (idPelaksanaanPengadaan) {
      setFormData((prev) => ({
        ...prev,
        id_pelaksanaan_pengadaan: parseInt(idPelaksanaanPengadaan),
      }));
    }
  }, [idPelaksanaanPengadaan]);

  // Input validation dan sanitization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.nama || formData.nama.length < 3) {
      toast.error("Validasi Gagal", {
        description: "Nama CCTV minimal 3 karakter",
      });
      return false;
    }

    if (!formData.lokasi || formData.lokasi.length < 3) {
      toast.error("Validasi Gagal", {
        description: "Lokasi minimal 3 karakter",
      });
      return false;
    }

    if (!validateUrl(formData.link_cctv)) {
      toast.error("Validasi Gagal", {
        description:
          "URL playlist tidak valid. Harus HTTPS dan berakhiran .m3u8",
      });
      return false;
    }

    if (
      !formData.id_pelaksanaan_pengadaan ||
      formData.id_pelaksanaan_pengadaan === 0
    ) {
      toast.error("Validasi Gagal", {
        description: "ID Pelaksanaan Pengadaan tidak valid",
      });
      return false;
    }

    return true;
  };

  // Handle submit dengan validasi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEdit && editId !== null) {
        await CCTVApiService.update(editId, formData);
        toast.success("Data CCTV berhasil diupdate");
      } else {
        await CCTVApiService.create(formData);
        toast.success("Data CCTV berhasil ditambahkan");
      }

      await fetchCCTVData();
      handleCancel();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = useCallback((cctv: CCTVData) => {
    setIsEdit(true);
    setEditId(cctv.id_cctv);
    setFormData({
      nama: cctv.nama,
      lokasi: cctv.lokasi,
      link_cctv: cctv.link_cctv,
      id_pelaksanaan_pengadaan: cctv.id_pelaksanaan_pengadaan,
    });
    setShowForm(true);
  }, []);

  // Open delete confirmation dialog
  const openDeleteDialog = useCallback((id: number, name: string) => {
    setDeleteDialog({ open: true, id, name });
  }, []);

  // Handle delete dengan konfirmasi menggunakan shadcn AlertDialog
  const handleDelete = useCallback(async () => {
    if (!deleteDialog.id) return;

    try {
      await CCTVApiService.delete(deleteDialog.id);
      toast.success("Data CCTV berhasil dihapus");
      await fetchCCTVData();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menghapus data";
      toast.error(errorMessage);
    } finally {
      setDeleteDialog({ open: false, id: null, name: "" });
    }
  }, [deleteDialog.id, fetchCCTVData]);

  // Reset form
  const handleCancel = useCallback(() => {
    setFormData({
      nama: "",
      lokasi: "",
      link_cctv: "",
      id_pelaksanaan_pengadaan: idPelaksanaanPengadaan
        ? parseInt(idPelaksanaanPengadaan)
        : 0,
    });
    setShowForm(false);
    setIsEdit(false);
    setEditId(null);
  }, [idPelaksanaanPengadaan]);

  const handleOpenDialog = useCallback(() => {
    setIsEdit(false);
    setEditId(null);
    setFormData({
      nama: "",
      lokasi: "",
      link_cctv: "",
      id_pelaksanaan_pengadaan: idPelaksanaanPengadaan
        ? parseInt(idPelaksanaanPengadaan)
        : 0,
    });
    setShowForm(true);
  }, [idPelaksanaanPengadaan]);

  return (
    <Mainlayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              Monitoring CCTV Pelaksanaan Pekerjaan
            </h1>
            {laporanData ? (
              <div className="mt-1">
                <p className="text-sm text-gray-700 font-medium">
                  {laporanData.nama_pekerjaan}
                </p>
                <p className="text-sm text-gray-500">di {laporanData.satdik}</p>
              </div>
            ) : idPelaksanaanPengadaan ? (
              <p className="text-sm text-gray-500 mt-1">
                ID Pelaksanaan Pengadaan: {idPelaksanaanPengadaan}
              </p>
            ) : null}
          </div>

          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleOpenDialog}
                disabled={!idPelaksanaanPengadaan}
              >
                + Tambah Data CCTV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {isEdit ? "Edit Data CCTV" : "Tambah Data CCTV"}
                </DialogTitle>
                <DialogDescription>
                  {isEdit
                    ? "Ubah data CCTV monitoring pelaksanaan pekerjaan"
                    : "Tambahkan data CCTV baru untuk monitoring pelaksanaan pekerjaan"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">
                      Nama CCTV <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      maxLength={100}
                      placeholder="Contoh: CCTV Area Depan"
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lokasi">
                      Lokasi <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lokasi"
                      name="lokasi"
                      value={formData.lokasi}
                      onChange={handleInputChange}
                      required
                      minLength={3}
                      maxLength={200}
                      placeholder="Contoh: Pintu Masuk Utama"
                      disabled={loading}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link_cctv">
                      URL Playlist (m3u8){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="link_cctv"
                      name="link_cctv"
                      type="url"
                      value={formData.link_cctv}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/stream.m3u8"
                      disabled={loading}
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500">
                      URL harus menggunakan HTTPS dan berakhiran .m3u8
                    </p>
                  </div>

                  {/* Hidden field untuk id_pelaksanaan_pengadaan */}
                  <input
                    type="hidden"
                    name="id_pelaksanaan_pengadaan"
                    value={formData.id_pelaksanaan_pengadaan}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!idPelaksanaanPengadaan && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Parameter ID Pelaksanaan Pengadaan tidak ditemukan di URL. Silakan
              akses halaman ini dengan parameter yang benar.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {fetching ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : cctvData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada data CCTV</p>
            <p className="text-sm text-gray-400 mt-2">
              {idPelaksanaanPengadaan
                ? 'Klik tombol "Tambah Data CCTV" untuk memulai'
                : "Pastikan parameter URL sudah benar"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cctvData.map((cctv) => (
              <div
                key={cctv.id_cctv}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h2
                      className="font-semibold text-lg truncate"
                      title={cctv.nama}
                    >
                      {cctv.nama}
                    </h2>
                    <p
                      className="text-sm text-gray-600 truncate"
                      title={cctv.lokasi}
                    >
                      {cctv.lokasi}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(cctv)}
                      className="h-8 w-8"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openDeleteDialog(cctv.id_cctv, cctv.nama)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <LiveStream playlistUrl={cctv.link_cctv} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog menggunakan shadcn/ui AlertDialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus CCTV{" "}
              <span className="font-semibold">{deleteDialog.name}</span>?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Mainlayout>
  );
}
