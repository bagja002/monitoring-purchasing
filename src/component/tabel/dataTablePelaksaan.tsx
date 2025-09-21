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
import axios from "axios";
import { useRouter } from "next/navigation";

// Interface untuk data perencanaan kegiatan
export interface PengawasanKegiatan {
  id_perencanaan_kegiatan: string | number;
  satdik: string;
  nama_pekerjaan: string;
  metode_pengadaan: string;
  lokasi_pekerjaan: string;
  link_cctv: string;
  informasi_penyedia: string;
  no_tanggal_kontrak: string;
  no_tanggal_kontrak_berakhir: string;
  lama_pekerjaan: number;
  status_pekerjaan: string;
  anggaran: number;
  hps: number;
  nilai_kontrak: number;
  sisa_pagu: number;
  target_fisik: number;
  realisasi_fisik: number;
  deviasi: number;
  target_realisasi_anggaran_termin: number;
  realisasi_termin: number;
  sisa_kontrak: number;
  keeterangan: string;
  tindak_lanjut_rekomendasi_sebelumnya: string;
  permasalahan: string;
  rekomendasi: string;
}

interface Props {
  data: PengawasanKegiatan[];
}

const allColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete: (id: string | number) => void,
  setNamaSatdik: (satdik: string) => void,
  setNamaPekerjaan: (pekerjaan: string) => void
): ColumnDef<PengawasanKegiatan, any>[] => [
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
          onClick={() =>
            router.push(`pengawasan/edit/${row.original.id_perencanaan_kegiatan}`)
          }
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            setNamaSatdik(row.original.satdik);
            setNamaPekerjaan(row.original.nama_pekerjaan);
            onDelete(row.original.id_perencanaan_kegiatan);
          }}
        >
          Delete
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
    accessorKey: "metode_pengadaan",
    header: "Metode Pengadaan",
  },
  {
    accessorKey: "lokasi_pekerjaan",
    header: "Lokasi Pekerjaan",
  },
  {
    accessorKey: "link_cctv",
    header: "Link CCTV",
  },
  {
    accessorKey: "informasi_penyedia",
    header: "Informasi Penyedia",
  },
  {
    accessorKey: "no_tanggal_kontrak",
    header: "No Tanggal Kontrak dan SPMK",
  },
  {
    accessorKey: "no_tanggal_kontrak_berakhir",
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
    columns: [
      {
        accessorKey: "target_fisik",
        header: "Target Fisik Per Minggu",
        cell: (info) => `${info.getValue<number>()} %`,
      },
      {
        accessorKey: "realisasi_fisik",
        header: "Realisasi Fisik Per Minggu",
        cell: (info) => `${info.getValue<number>()} %`,
      },
      {
        accessorKey: "deviasi",
        header: "Deviasi",
        cell: (info) => `${info.getValue<number>()} %`,
      },
    ],
  },
  {
    header: "Target dan Realisasi Anggaran",
    columns: [
      {
        accessorKey: "target_realisasi_anggaran_termin",
        header: "Target Per Termin",
        cell: (info) => `${info.getValue<number>()} %`,
      },
      {
        accessorKey: "realisasi_termin",
        header: "Realisasi Fisik Per Termin",
        cell: (info) => `${info.getValue<number>()} %`,
      },
      {
        accessorKey: "sisa_kontrak",
        header: "Sisa Kontrak",
        cell: (info) => `${info.getValue<number>()} %`,
      },
    ],
  },
  {
    accessorKey: "keeterangan",
    header: "Keterangan",
  },
  {
    accessorKey: "tindak_lanjut_rekomendasi_sebelumnya",
    header: "Tindak Lanjut Rekomendasi Sebelumnya",
  },
  {
    accessorKey: "permasalahan",
    header: "Permasalahan",
  },
  {
    accessorKey: "rekomendasi",
    header: "Rekomendasi",
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

  const router = useRouter();

  const columns = React.useMemo(
    () =>
      allColumns(
        router,
        (id: string | number) => {
          setDeleteId(id);
          setIsDeleteDialogOpen(true);
        },
        setNamaSatdik,
        setNamaPekerjaan
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

  return (
    <div className="space-y-4 max-w-[78vw] overflow-x-auto">
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
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border px-2 py-1 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pekerjaan{" "}
              <strong className="font-medium">{namaPekerjaan}</strong> pada{" "}
              <strong className="font-medium">{namaSatdik}</strong>? Tindakan ini
              tidak dapat dibatalkan.
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
    </div>
  );
}
