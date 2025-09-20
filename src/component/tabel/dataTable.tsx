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
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { dataTablePercanaan } from "../interface/dataTablePerencanaan";
import { PerencanaanKegiatanReal } from "../interface/dataReal";
import { useRouter } from "next/navigation";
import { fileCell } from "../utils/getFile";
import axios from "axios";

interface Props {
  data: PerencanaanKegiatanReal[];
}

const allColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete: (id: string | number) => void
): ColumnDef<PerencanaanKegiatanReal, any>[] => [
  {
    id:"no",
    header: "No",
    cell: ({ row }) => row.index + 1, // row.index mulai dari 0
  },
  {
    id: "action",
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() =>
            router.push(`perencanaan/edit/${row.original.id_perencanaan_kegiatan}`)
          }
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onDelete(row.original.id_perencanaan_kegiatan)}
        >
          Delete
        </button>
      </div>
    ),
  },
  {
    id: "satdik",
    accessorFn: (row) => row.satdik,
    header: "Satuan Pendidikan",
  },
  {
    id: "nama_pekerjaan",
    accessorFn: (row) => row.nama_pekerjaan,
    header: "Nama Pekerjaan",
  },
  {
    id: "anggaran",
    accessorKey: "anggaran",
    header: "Anggaran",
    cell: (info) => {
      const value = info.getValue<number>();
      return value ? value.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }) : "-";
    },
  },
  {
    id: "jadwal_pengadaan",
    accessorFn: (row) => row.jadwal_pengadaan,
    header: "Jadwal Pengadaan",
  },
  {
    id: "kategori_pengadaan",
    accessorFn: (row) => row.kategori_pengadaan,
    header: "Kategori Pengadaan",
  },

  // Kolom khusus "Pengadaan Barang"
  { id: "sirup", accessorFn: (row) => row.sirup_p_barang, header: "SiRUP" },
  {
    id: "metode_pemilihan",
    accessorFn: (row) => row.metode_pemilihan_p_barang,
    header: "Metode Pemilihan dan Justifikasi",
    cell: (info) => (
      <>
        {info.row.original.metode_pemilihan_p_barang} <br />{" "}
        {info.row.original.justifikasi_pemilihan_p_barang}
      </>
    ),
  },
  
  
  
   { id: "kak", accessorFn: row => row.kak_p_barang, header: "KAK", cell: ({ getValue }) => fileCell(getValue()) },
  { id: "rab", accessorFn: row => row.rab_p_barang, header: "RAB", cell: ({ getValue }) => fileCell(getValue()) },
  { id: "hps_penetapan", accessorFn: row => row.hps_penetapan_p_barang, header: "HPS Penetapan", cell: ({ getValue }) => fileCell(getValue()) },
  { id: "rancangan_kontrak", accessorFn: row => row.rancangan_kontrak_p_barang, header: "Rancangan Kontrak/SPK", cell: ({ getValue }) => fileCell(getValue()) },
  {
    id: "hps_nilai",
    accessorFn: (row) => row.hps_nilai_p_barang,
    header: "HPS Nilai",
    cell: (info) => {
      const value = info.getValue<number>();
      return value ? value.toLocaleString("id-ID") : "-";
    },
  },
  {
    id: "hasil_survei",
    accessorFn: (row) => row.hasil_survei_p_barang,
    header: "Hasil Survei",
  },
  {
    id: "hasil_pendampingan",
    accessorFn: (row) => row.hasil_pendampingan_p_barang,
    header: "Hasil Pendampingan",
  },

  // Kolom lainnya
  {
    id: "gambar_perencanaan",
    accessorFn: (row) => row.gambar_perencanaan,
    header: "Gambar Perencanaan",
    cell: (info) => {
      const value = info.getValue<string>();
      return value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Lihat File
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    id: "spesifikasi_teknis",
    accessorFn: (row) => row.spesifikasi_teknis,
    header: "Spesifikasi Teknis (RKS)",
  },
  {
    id: "rekomendasi_pupr",
    accessorFn: (row) => row.rekomendasi_pupr,
    header: "Rekomendasi PUPR",
  },
];

export default function DataTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
// Handle delete confirmation
const handleDeleteClick = React.useCallback((id: string | number) => {
  setDeleteId(id);
  setIsDeleteDialogOpen(true);
}, []);

 const handleDeleteConfirm = async () => {
  if (deleteId !== null) {
    try {
      const res = await axios.delete(
        `http://103.177.176.202:6402/operator/DeletePerencanaan?id=${deleteId}`
      );
  
      window.location.reload()
    } catch (err) {
      console.error("Gagal hapus:", err);
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  }
};

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  // Filter kolom berdasarkan kategori_pengadaan
  const router = useRouter();
  const columns = React.useMemo(() => {
    const allCols = allColumns(router, handleDeleteClick);
    if (data.length && data[0].kategori_pengadaan === "Pengadaan Barang") {
      return allCols.filter((col) =>
        [
          "no",
          "action",
          "satdik",
          "nama_pekerjaan",
          "anggaran",
          "jadwal_pengadaan",
          "kategori_pengadaan",
          "sirup",
          "metode_pemilihan",
          "kak",
          "rab",
          "hps_penetapan",
          "hps_nilai",
          "hasil_survei",
          "rancangan_kontrak",
          "hasil_pendampingan",
        ].includes(col.id!)
      );
    }
    return allCols;
  }, [data, router, handleDeleteClick]);

  const table = useReactTable({
    data,
    columns,
    state: { 
      sorting, 
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableColumns = ['satdik', 'nama_pekerjaan', 'kategori_pengadaan', 'jadwal_pengadaan'];
      
      return searchableColumns.some(colId => {
        const col = table.getColumn(colId);
        if (!col) return false;
        
        const cellValue = row.getValue(colId);
        return String(cellValue ?? "")
          .toLowerCase()
          .includes(String(filterValue).toLowerCase());
      });
    },
  });

  return (
    <div className="space-y-4 max-w-[78vw]">
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
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
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
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <Button
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}