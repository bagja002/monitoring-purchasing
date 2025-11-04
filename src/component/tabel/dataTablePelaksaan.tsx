"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PelaksaanKegiatan } from "../interface/pelaksaanInterface";
import TabelMingguan from "./TableLaporanMingguan";
import TabelLaporanMingguan from "./TableLaporan";
import TableRealisasiAnggaran from "./TableRealisasiKeuangan";

// Interface untuk data perencanaan kegiatan

interface Props {
  data: PelaksaanKegiatan[];
  category?: string;
}

const allColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete: (id: string | number) => void,
  setNamaSatdik: (satdik: string) => void,
  setNamaPekerjaan: (pekerjaan: string) => void,
  onViewRealisasiFisik: (id: number) => void,
  onViewRealisasiAnggaran: (id: number) => void
): ColumnDef<PelaksaanKegiatan, any>[] => [
  {
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            const category = row.original.kategori_pengadaan_pk?.toLowerCase();
            const id = row.original.id_perencanaan_kegiatan;

            if (category === "pengadaan barang") {
              router.push(
                `/kegiatan-pengadaan/pelaksanaan/detail-pelaksanaan/${id}`
              );
            } else if (
              category === "perbaikan gedung dan bangunan" ||
              category === "pembangunan gedung baru"
            ) {
              router.push(
                `/kegiatan-pengadaan/pelaksanaan/detail-pelaksanaan-pembangunan/${id}`
              );
            } else {
              // Default fallback
              // router.push(
              //   `pengawasan/edit/${row.original.id_perencanaan_kegiatan}`
              // );

              console.log("Kategori tidak dikenali:", category);
            }
          }}
        >
          Edit
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "satdik",
    header: "Satuan Pendidikan",
  },
  {
    accessorKey: "nama_pekerjaan",
    header: "Nama Pekerjaan",
  },
  {
    accessorKey: "kategori_pengadaan",
    header: "Kategori Pengadaan",
  },
  {
    accessorKey: "metode_pemilihan",
    header: "Metode Pengadaan",
  },
  {
    accessorKey: "lokasi_pekerjaan",
    header: "Lokasi Pekerjaan",
  },
  {
    accessorKey: "link_cctv",
    header: "Link CCTV",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          router.push(
            `/kegiatan-pengadaan/pelaksanaan/cctv/${row.original.id_pelaksanaan_pengadaan}`
          )
        }
      >
        View
      </Button>
    ),
  },
  {
    accessorKey: "nama_penyedia",
    header: "Informasi Penyedia",
    cell: ({ row }) => {
      const nama = row.original.nama_penyedia || "-";
      const npwp = row.original.npwp || "-";
      const alamat = row.original.alamat_penyedia || "-";
      return (
        <div className="whitespace-pre-wrap">
          {nama} - {npwp} - {alamat}
        </div>
      );
    },
  },
  {
    accessorKey: "no_tanggal_kontrak_spk",
    header: "No Tanggal Kontrak dan SPMK",
  },
  {
    accessorKey: "tanggal_kontrak_berakhir",
    header: "No Tanggal Kontrak Berakhir",
  },
  {
    accessorKey: "lama_pekerjaan",
    header: "Lama Pekerjaan (Hari)",
  },
  {
    accessorKey: "status_pekerjaan",
    header: "Status Pekerjaan",
  },
  {
    header: "Pagu (Rp)",
    columns: [
      {
        accessorKey: "anggaran",
        header: "Anggaran",
        cell: (info) =>
          info.getValue<number>()?.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }),
      },
      {
        accessorKey: "hps",
        header: "HPS",
        cell: (info) =>
          info.getValue<number>()?.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }),
      },
      {
        accessorKey: "nilai_kontrak",
        header: "Nilai Kontrak",
        cell: (info) =>
          info.getValue<number>()?.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          }),
      },
    ],
  },
  {
    accessorKey: "sisa_pagu",
    header: "Sisa Pagu",
    cell: (info) =>
      info.getValue<number>()?.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
  },
  {
    header: "Target Realisasi Fisik (%)",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onViewRealisasiFisik(row.original.id_pelaksanaan_pengadaan)
        }
      >
        View Detail
      </Button>
    ),
  },
  {
    header: "Target dan Realisasi Anggaran",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          onViewRealisasiAnggaran(row.original.id_pelaksanaan_pengadaan)
        }
      >
        View Detail
      </Button>
    ),
  },
];

const getHeaderGroupColor = (h: any): string => {
  if (!h) return "bg-white";

  if (h.column?.columnDef?.header === "Pagu (Rp)") {
    return "bg-blue-200 text-blue-900";
  }
  if (h.column?.columnDef?.header === "Target Realisasi Fisik (%)") {
    return "bg-red-200 text-red-900";
  }
  if (h.column?.columnDef?.header === "Target dan Realisasi Anggaran") {
    return "bg-yellow-200 text-red-900";
  }

  return h.column?.parent ? getHeaderGroupColor(h.column.parent) : "bg-white";
};

export default function DataTablePelaksaan({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [namaSatdik, setNamaSatdik] = React.useState<string | null>(null);
  const [namaPekerjaan, setNamaPekerjaan] = React.useState<string | null>(null);

  // Realisasi Fisik Dialog
  const [isRealisasiFisikOpen, setIsRealisasiFisikOpen] = React.useState(false);
  const [selectedPelaksanaanId, setSelectedPelaksanaanId] =
    React.useState<string>("");

  // Realisasi Anggaran Dialog
  const [isRealisasiAnggaranOpen, setIsRealisasiAnggaranOpen] =
    React.useState(false);
  const [selectedAnggaranId, setSelectedAnggaranId] =
    React.useState<string>("");

  const router = useRouter();

  const handleViewRealisasiFisik = (id: number) => {
    setSelectedPelaksanaanId(String(id));
    setIsRealisasiFisikOpen(true);
  };

  const handleViewRealisasiAnggaran = (id: number) => {
    setSelectedAnggaranId(String(id));
    setIsRealisasiAnggaranOpen(true);
  };

  const columns = React.useMemo(
    () =>
      allColumns(
        router,
        (id: string | number) => {
          setDeleteId(id);
          setIsDeleteDialogOpen(true);
        },
        setNamaSatdik,
        setNamaPekerjaan,
        handleViewRealisasiFisik,
        handleViewRealisasiAnggaran
      ),
    [router]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue<unknown>(columnId);
      return String(value ?? "")
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    },
  });

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      try {
        await axios.delete(
          `http://103.177.176.202:6402/operator/DeletePerencanaan?id=${deleteId}`
        );
        window.location.reload(); // bisa diganti state update biar gak reload full
      } catch (err) {
        console.error("Gagal hapus:", err);
      } finally {
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    }
  };

  // Fungsi untuk menghitung merge cell
  const calculateMergedCells = () => {
    const rows = table.getRowModel().rows;
    const mergeInfo: Record<number, { satdik: number; namaPekerjaan: number }> =
      {};

    let i = 0;
    while (i < rows.length) {
      const currentRow = rows[i].original;
      let mergeCount = 1;

      // Hitung berapa banyak row berikutnya yang memiliki satdik dan nama_pekerjaan yang sama
      while (
        i + mergeCount < rows.length &&
        rows[i + mergeCount].original.satdik === currentRow.satdik &&
        rows[i + mergeCount].original.nama_pekerjaan ===
          currentRow.nama_pekerjaan
      ) {
        mergeCount++;
      }

      // Set merge info untuk row pertama
      mergeInfo[i] = { satdik: mergeCount, namaPekerjaan: mergeCount };

      // Set merge info untuk row berikutnya dalam grup (akan di-hide)
      for (let j = 1; j < mergeCount; j++) {
        mergeInfo[i + j] = { satdik: 0, namaPekerjaan: 0 };
      }

      i += mergeCount;
    }

    return mergeInfo;
  };

  const mergedCells = calculateMergedCells();

  return (
    <div className="space-y-4 max-w-[97vw] overflow-x-auto">
      {/* Search */}
      <div className="flex justify-end mb-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-64"
        />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const colorClass = getHeaderGroupColor(header);
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`text-center align-middle border px-2 py-1 font-semibold ${colorClass}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, rowIndex) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const columnId = cell.column.id;
                  const mergeInfo = mergedCells[rowIndex];

                  // Handle merge untuk kolom satdik
                  if (columnId === "satdik") {
                    if (mergeInfo.satdik === 0) {
                      return null; // Skip cell ini karena sudah di-merge ke atas
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        className="border px-2 py-1 text-sm align-middle"
                        rowSpan={mergeInfo.satdik}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  }

                  // Handle merge untuk kolom nama_pekerjaan
                  if (columnId === "nama_pekerjaan") {
                    if (mergeInfo.namaPekerjaan === 0) {
                      return null; // Skip cell ini karena sudah di-merge ke atas
                    }
                    return (
                      <TableCell
                        key={cell.id}
                        className="border px-2 py-1 text-sm align-middle"
                        rowSpan={mergeInfo.namaPekerjaan}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  }

                  // Render cell biasa untuk kolom lain
                  return (
                    <TableCell
                      key={cell.id}
                      className="border px-2 py-1 text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end space-x-2 mt-2">
        <Button
          size="sm"
          onClick={() =>
            table.setPageIndex(table.getState().pagination.pageIndex - 1)
          }
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <Button
          size="sm"
          onClick={() =>
            table.setPageIndex(table.getState().pagination.pageIndex + 1)
          }
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pekerjaan{" "}
              <strong className="font-medium">{namaPekerjaan}</strong> pada{" "}
              <strong className="font-medium">{namaSatdik}</strong>? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Realisasi Fisik Dialog */}
      <Dialog
        open={isRealisasiFisikOpen}
        onOpenChange={setIsRealisasiFisikOpen}
      >
        <DialogContent className="!max-w-[98vw] w-[98vw] max-h-[92vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Target Realisasi Fisik dan Evaluasi
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 overflow-y-auto">
            {selectedPelaksanaanId && (
              <TabelLaporanMingguan idPelaksaan={selectedPelaksanaanId} />
            )}
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              onClick={() => setIsRealisasiFisikOpen(false)}
              variant="outline"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Realisasi Anggaran Dialog */}
      <Dialog
        open={isRealisasiAnggaranOpen}
        onOpenChange={setIsRealisasiAnggaranOpen}
      >
        <DialogContent className="!max-w-[98vw] w-[98vw] max-h-[92vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Target dan Realisasi Anggaran
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 overflow-y-auto">
            {selectedAnggaranId && (
              <TableRealisasiAnggaran idPelaksaan={selectedAnggaranId} />
            )}
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t sticky bottom-0 bg-white">
            <Button
              onClick={() => setIsRealisasiAnggaranOpen(false)}
              variant="outline"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
