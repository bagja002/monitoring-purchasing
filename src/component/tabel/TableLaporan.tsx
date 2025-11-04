"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { LaporanMingguan, Termin } from "../interface/dataReal";
import { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

// Type untuk form realisasi keuangan
type RealisasiKeuanganFormData = {
  id_pelaksanaan_pengadaan: number;
  termin_ke: string;
  target_keuangan: number;
  realisasi_keuangan: number;
  deviasi_keuangan: number;
  link_dokumen_keuangan: string;
};

// Type untuk form laporan mingguan
type LaporanMingguanFormData = {
  id_pelaksanaan_pengadaan: number;
  minggu_ke: string;
  target_fisik: number;
  realisasi_fisik: number;
  deviasi_fisik: number;
  tingkat_capaian_keberhasilan: string;
  tindak_lanjut_rekomendasi_sebelumnya: string;
  permasalahan_yang_dihadapi: string;
  rekomendasi: string;
  link_dokumen_laporan: string;
};

const allColumns = (): ColumnDef<LaporanMingguan, any>[] => [
  {
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Target dan Realisasi Fisik (%)",
    columns: [
      {
        id: "target_fisik_perminggu",
        header: "Target Fisik",
        columns: [
          {
            accessorKey: "minggu_ke",
            header: "Minggu",
          },
          {
            accessorKey: "target_fisik",
            header: "Target",
          },
        ],
      },
      {
        id: "realisasi_fisik",
        header: "Realisasi Fisik",
        columns: [
          {
            accessorKey: "realisasi_fisik",
            header: "Realisasi",
          },
          {
            accessorKey: "deviasi",
            header: "Deviasi",
          },
        ],
      },
    ],
  },
  {
    header: "Termin",
    accessorKey: "Termin",
  },
  {
    header: "Evaluasi",
    columns: [
      {
        accessorKey: "tingkat_capaian_keberhasilan",
        header: "Tingkat Capaian",
      },
      {
        accessorKey: "tindak_lanjut_rekomendasi_sebelumnya",
        header: "Tindak Lanjut",
      },
      {
        accessorKey: "permasalahan_yang_dihadapi",
        header: "Permasalahan",
      },
      {
        accessorKey: "rekomendasi",
        header: "Rekomendasi",
      },
    ],
  },
];

type TabelMingguanProps = {
  idPelaksaan: string;
};

export default function TabelLaporanMingguan ({ idPelaksaan }: TabelMingguanProps) {
  // State untuk data
  const [dataAnggaran, setDataAnggaran] = useState<Termin[]>([]);
  const [dataLaporan, setDataLaporan] = useState<LaporanMingguan[]>([]);

  // State untuk loading
  const [isLoadingAnggaran, setIsLoadingAnggaran] = useState(true);
  const [isLoadingLaporan, setIsLoadingLaporan] = useState(true);

  // State untuk drawer
  const [openAnggaran, setOpenAnggaran] = useState(false);
  const [openLaporan, setOpenLaporan] = useState(false);

  // State untuk form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAnggaranId, setEditingAnggaranId] = useState<number | null>(
    null
  );
  const [editingLaporanId, setEditingLaporanId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const baseUrl = "http://103.177.176.202:6402";

  // Setup useForm untuk realisasi anggaran
  const {
    register: registerAnggaran,
    handleSubmit: handleSubmitAnggaran,
    formState: { errors: errorsAnggaran },
    reset: resetAnggaran,
    setValue: setValueAnggaran,
  } = useForm<RealisasiKeuanganFormData>({
    defaultValues: {
      id_pelaksanaan_pengadaan: parseInt(idPelaksaan),
      termin_ke: "1",
      target_keuangan: 0,
      realisasi_keuangan: 0,
      deviasi_keuangan: 0,
      link_dokumen_keuangan: "",
    },
  });

  // Setup useForm untuk laporan mingguan
  const {
    register: registerLaporan,
    handleSubmit: handleSubmitLaporan,
    formState: { errors: errorsLaporan },
    reset: resetLaporan,
    setValue: setValueLaporan,
  } = useForm<LaporanMingguanFormData>({
    defaultValues: {
      id_pelaksanaan_pengadaan: parseInt(idPelaksaan),
      minggu_ke: "1",
      target_fisik: 0,
      realisasi_fisik: 0,
      deviasi_fisik: 0,
      tingkat_capaian_keberhasilan: "",
      tindak_lanjut_rekomendasi_sebelumnya: "",
      permasalahan_yang_dihadapi: "",
      rekomendasi: "",
    },
  });

  // State untuk menyimpan nilai saat ini untuk kalkulasi deviasi
  const [currentTarget, setCurrentTarget] = useState<number>(0);
  const [currentRealisasi, setCurrentRealisasi] = useState<number>(0);

  // Fetch data anggaran dari API
  const fetchDataAnggaran = useCallback(async () => {
    setIsLoadingAnggaran(true);
    try {
      const response = await axios.get(
        `${baseUrl}/getAllRealisasi?id_pelaksanaan_pengadaan=${idPelaksaan}`
      );
      setDataAnggaran(response.data);
    } catch (error) {
      console.error("Error fetching data anggaran:", error);
      alert("Gagal memuat data anggaran");
      setDataAnggaran([]);
    } finally {
      setIsLoadingAnggaran(false);
    }
  }, [idPelaksaan]);

  // Fetch data laporan mingguan dari API
  const fetchDataLaporan = useCallback(async () => {
    setIsLoadingLaporan(true);
    try {
      const response = await axios.get(
        `${baseUrl}/getAllLaporan?id_pelaksanaan_pengadaan=${idPelaksaan}`
      );
      setDataLaporan(response.data);
    } catch (error) {
      console.error("Error fetching data laporan:", error);
      alert("Gagal memuat data laporan mingguan");
      setDataLaporan([]);
    } finally {
      setIsLoadingLaporan(false);
    }
  }, [idPelaksaan]);

  // useEffect untuk fetch data saat komponen dimount
  useEffect(() => {
    if (idPelaksaan) {
      fetchDataAnggaran();
      fetchDataLaporan();
    }
  }, [idPelaksaan, fetchDataAnggaran, fetchDataLaporan]);

  // Fungsi untuk handle edit anggaran
  const handleEditAnggaran = (rowIndex: number) => {
    const itemToEdit = dataAnggaran[rowIndex];

    setEditingAnggaranId(Number(itemToEdit.id_realisasi_keuangan) || rowIndex);

    // Set form values dengan data yang akan di-edit
    const targetValue = parseRupiahInput(itemToEdit.target_keuangan);
    const realisasiValue = parseRupiahInput(itemToEdit.realisasi_keuangan);

    setValueAnggaran("id_pelaksanaan_pengadaan", parseInt(idPelaksaan));
    setValueAnggaran("termin_ke", itemToEdit.termin_ke);
    setValueAnggaran("target_keuangan", targetValue);
    setValueAnggaran("realisasi_keuangan", realisasiValue);
    setValueAnggaran(
      "link_dokumen_keuangan",
      itemToEdit.link_dokumen_keuangan || ""
    );

    // Set state untuk tampilan
    setCurrentTarget(targetValue);
    setCurrentRealisasi(realisasiValue);

    setOpenAnggaran(true);
  };

  // Fungsi untuk handle edit laporan
  const handleEditLaporan = (rowIndex: number) => {
    const itemToEdit = dataLaporan[rowIndex];

    setEditingLaporanId(Number(itemToEdit.id_laporan_pelaksanaan) || rowIndex);

    setValueLaporan("id_pelaksanaan_pengadaan", parseInt(idPelaksaan));
    setValueLaporan("minggu_ke", itemToEdit.minggu_ke);
    setValueLaporan("target_fisik", Number(itemToEdit.target_fisik));
    setValueLaporan("realisasi_fisik", Number(itemToEdit.realisasi_fisik));
    setValueLaporan(
      "tingkat_capaian_keberhasilan",
      itemToEdit.tingkat_capaian_keberhasilan || ""
    );
    setValueLaporan(
      "tindak_lanjut_rekomendasi_sebelumnya",
      itemToEdit.tindak_lanjut_rekomendasi_sebelumnya || ""
    );
    setValueLaporan(
      "permasalahan_yang_dihadapi",
      itemToEdit.permasalahan_yang_dihadapi || ""
    );
    setValueLaporan("rekomendasi", itemToEdit.rekomendasi || "");

    setOpenLaporan(true);
  };

  // Fungsi untuk handle delete
  const handleDelete = async (
    rowIndex: number,
    type: "anggaran" | "laporan"
  ) => {
    const data = type === "anggaran" ? dataAnggaran : dataLaporan;
    const item = data[rowIndex];

    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus data ${type} ini?`
    );

    if (!confirmDelete) return;

    setIsDeleting(rowIndex);

    try {
      const endpoint =
        type === "anggaran" ? "realisasi-keuangan" : "laporan-mingguan";
      const itemId = Number(item) || rowIndex + 1;

      const response = await axios.delete(`/api/${endpoint}/${itemId}`);

      if (response.status === 200) {
        alert("Data berhasil dihapus!");
        // Refresh data setelah delete
        if (type === "anggaran") {
          fetchDataAnggaran();
        } else {
          fetchDataLaporan();
        }
      }
    } catch (error) {
      console.error("Error deleting data:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Terjadi kesalahan saat menghapus data";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setIsDeleting(null);
    }
  };

  // Fungsi untuk menghitung deviasi otomatis
  const calculateDeviasi = (target: number, realisasi: number): number => {
    if (target === 0) return 0;
    return ((realisasi - target) / target) * 100;
  };

  // Fungsi untuk format Rupiah
  const formatRupiah = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Fungsi untuk parse nilai input menjadi number
  const parseRupiahInput = (value: any): number => {
    const stringValue = String(value || "");
    const numericValue = stringValue.replace(/[^\d]/g, "");
    return numericValue ? parseInt(numericValue) : 0;
  };

  // Kolom untuk tabel anggaran dengan aksi
  const allColumnsAnggaran = (): ColumnDef<Termin, any>[] => [
    {
      header: "No",
      cell: ({ row }) => row.index + 1,
    },
    {
      header: "Anggaran",
      columns: [
        {
          accessorKey: "termin_ke",
          header: "Termin",
        },
        {
          accessorKey: "target_keuangan",
          header: "Target",
          cell: ({ getValue }) => {
            const value = getValue() as string;
            return value || "-";
          },
        },
        {
          accessorKey: "realisasi_keuangan",
          header: "Realisasi",
          cell: ({ getValue }) => {
            const value = getValue() as string;
            return value || "-";
          },
        },
        {
          accessorKey: "sisa_kontrak",
          header: "Sisa Kontrak",
          cell: ({ getValue }) => {
            const value = getValue() as string;
            return value || "-";
          },
        },
      ],
    },
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditAnggaran(row.index)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.index, "anggaran")}
            disabled={isDeleting === row.index}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting === row.index ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  // Kolom untuk tabel laporan dengan aksi
  const allColumnsLaporan = (): ColumnDef<LaporanMingguan, any>[] => [
    ...allColumns(),
    {
      header: "Aksi",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEditLaporan(row.index)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(row.index, "laporan")}
            disabled={isDeleting === row.index}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting === row.index ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  // Submit handler untuk anggaran
  const onSubmitAnggaran: SubmitHandler<RealisasiKeuanganFormData> = async (
    data
  ) => {
    setIsSubmitting(true);

    try {
      const deviasi = calculateDeviasi(currentTarget, currentRealisasi);

      const payload = {
        ...data,
        target_keuangan: currentTarget,
        realisasi_keuangan: currentRealisasi,
        deviasi_keuangan: deviasi,
      };

      let response;

      if (editingAnggaranId !== null) {
        response = await axios.put(
          `${baseUrl}/updateRealisasi?id=${editingAnggaranId}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        response = await axios.post(`${baseUrl}/createRealisasi`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        alert(
          editingAnggaranId !== null
            ? "Data berhasil diperbarui!"
            : "Data realisasi keuangan berhasil disimpan!"
        );
        resetAnggaran();
        setCurrentTarget(0);
        setCurrentRealisasi(0);
        setEditingAnggaranId(null);
        setOpenAnggaran(false);
        fetchDataAnggaran(); // Refresh data
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit handler untuk laporan
  const onSubmitLaporan: SubmitHandler<LaporanMingguanFormData> = async (
    data
  ) => {
    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        deviasi: calculateDeviasi(data.target_fisik, data.realisasi_fisik),
      };

      let response;

      if (editingLaporanId !== null) {
        response = await axios.put(
          `${baseUrl}/updateLaporan?id=${editingLaporanId}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        response = await axios.post(`${baseUrl}/createLaporan`, payload, {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.status === 200 || response.status === 201) {
        alert(
          editingLaporanId !== null
            ? "Data berhasil diperbarui!"
            : "Data laporan mingguan berhasil disimpan!"
        );
        resetLaporan();
        setEditingLaporanId(null);
        setOpenLaporan(false);
        fetchDataLaporan(); // Refresh data
      }
    } catch (error) {
      console.error("Error submitting data:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan data";
        alert(`Error: ${errorMessage}`);
      } else {
        alert("Terjadi kesalahan yang tidak terduga");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Setup tables
  const tableAnggaran = useReactTable<Termin>({
    data: dataAnggaran,
    columns: allColumnsAnggaran(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableLaporan = useReactTable<LaporanMingguan>({
    data: dataLaporan,
    columns: allColumnsLaporan(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
     

      {/* Section Laporan Mingguan */}
      <div className="rounded-2xl border shadow-sm p-2 space-y-4 max-w-[95vw] overflow-x-auto">
        <div className="flex justify-between items-center">
          <h1>Realisasi Fisik dan Evaluasi</h1>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchDataLaporan}
            disabled={isLoadingLaporan}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${
                isLoadingLaporan ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>
        </div>

        {/* Drawer untuk Laporan Mingguan */}
        <Drawer
          open={openLaporan}
          onOpenChange={(newOpen) => {
            setOpenLaporan(newOpen);
            if (!newOpen) {
              setEditingLaporanId(null);
              resetLaporan();
            }
          }}
        >
          <DrawerTrigger asChild>
            <Button>Tambahkan Laporan Mingguan</Button>
          </DrawerTrigger>

          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {editingLaporanId !== null
                  ? "Edit Laporan Mingguan"
                  : "Form Laporan Mingguan"}
              </DrawerTitle>
            </DrawerHeader>

            <form
              onSubmit={handleSubmitLaporan(onSubmitLaporan)}
              className="p-4 space-y-4"
            >
              <input
                type="hidden"
                {...registerLaporan("id_pelaksanaan_pengadaan")}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Minggu */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Minggu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Masukkan minggu ke-..."
                    className={`border rounded w-full px-3 py-2 ${
                      errorsLaporan.minggu_ke
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerLaporan("minggu_ke", {
                      min: { value: 1, message: "Minggu minimal 1" },
                    })}
                  />
                  {errorsLaporan.minggu_ke && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsLaporan.minggu_ke.message}
                    </p>
                  )}
                </div>

                {/* Target Fisik Per Minggu */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Target Fisik Per Minggu (%){" "}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                    className={`border rounded w-full px-3 py-2 ${
                      errorsLaporan.target_fisik
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerLaporan("target_fisik", {
                      valueAsNumber: true, // ✅ Ini penting!

                      min: {
                        value: 0,
                        message: "Target fisik tidak boleh negatif",
                      },
                      max: {
                        value: 100,
                        message: "Target fisik maksimal 100%",
                      },
                    })}
                  />
                  {errorsLaporan.target_fisik && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsLaporan.target_fisik.message}
                    </p>
                  )}
                </div>

                {/* Realisasi Fisik Per Minggu */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Realisasi Fisik Per Minggu (%){" "}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="0.00"
                    className={`border rounded w-full px-3 py-2 ${
                      errorsLaporan.realisasi_fisik
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerLaporan("realisasi_fisik", {
                      valueAsNumber: true, // ✅ Ini penting!
                      min: {
                        value: 0,
                        message: "Realisasi fisik tidak boleh negatif",
                      },
                      max: {
                        value: 100,
                        message: "Realisasi fisik maksimal 100%",
                      },
                    })}
                  />
                  {errorsLaporan.realisasi_fisik && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsLaporan.realisasi_fisik.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Tingkat Capaian Keberhasilan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Tingkat Capaian Keberhasilan{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan tingkat capaian keberhasilan..."
                    className={`border rounded w-full px-3 py-2 resize-vertical ${
                      errorsLaporan.tingkat_capaian_keberhasilan
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerLaporan("tingkat_capaian_keberhasilan", {})}
                  />
                  {errorsLaporan.tingkat_capaian_keberhasilan && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsLaporan.tingkat_capaian_keberhasilan.message}
                    </p>
                  )}
                </div>

                {/* Tindak Lanjut Rekomendasi Sebelumnya */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Tindak Lanjut Rekomendasi Sebelumnya
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan tindak lanjut rekomendasi sebelumnya..."
                    className="border rounded w-full px-3 py-2 border-gray-300 resize-vertical"
                    {...registerLaporan("tindak_lanjut_rekomendasi_sebelumnya")}
                  />
                </div>
              </div>

              {/* Permasalahan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Permasalahan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan permasalahan yang dihadapi..."
                    className="border rounded w-full px-3 py-2 border-gray-300 resize-vertical"
                    {...registerLaporan("permasalahan_yang_dihadapi")}
                  />
                </div>

                {/* Rekomendasi */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Rekomendasi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Masukkan rekomendasi..."
                    className={`border rounded w-full px-3 py-2 resize-vertical ${
                      errorsLaporan.rekomendasi
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...registerLaporan("rekomendasi", {})}
                  />
                  {errorsLaporan.rekomendasi && (
                    <p className="text-red-500 text-xs mt-1">
                      {errorsLaporan.rekomendasi.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? editingLaporanId !== null
                    ? "Memperbarui..."
                    : "Menyimpan..."
                  : editingLaporanId !== null
                  ? "Perbarui"
                  : "Simpan"}
              </Button>
            </form>
          </DrawerContent>
        </Drawer>

        {/* Tabel Laporan */}
        {isLoadingLaporan ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Memuat data laporan mingguan...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {tableLaporan.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-center align-middle border px-2 py-1 font-semibold"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {tableLaporan.getRowModel().rows.length ? (
                tableLaporan.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border px-2 py-1 text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={allColumnsLaporan().length}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada data laporan mingguan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination Laporan */}
        {!isLoadingLaporan && dataLaporan.length > 0 && (
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              size="sm"
              onClick={() =>
                tableLaporan.setPageIndex(
                  tableLaporan.getState().pagination.pageIndex - 1
                )
              }
              disabled={!tableLaporan.getCanPreviousPage()}
            >
              Prev
            </Button>
            <Button
              size="sm"
              onClick={() =>
                tableLaporan.setPageIndex(
                  tableLaporan.getState().pagination.pageIndex + 1
                )
              }
              disabled={!tableLaporan.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
