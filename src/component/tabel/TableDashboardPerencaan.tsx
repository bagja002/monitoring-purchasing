"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

// interface data
interface DataTable {
  id_satdik: number;
  satdik: string;
  jumlah_kegiatan: number;
  jumlah_status_lelang: number;
  jumlah_status_pengerjaan: number;
  jumlah_status_selesai: number;

  proses_keuangan_anggaran: string;
  proses_keuangan_realisasi: string;
  proses_keuangan_deviasi: string;

  proses_fisik_target: string;
  proses_fisik_realisasi: string;
  proses_fisik_deviasi: string;

  detail: string;
}

// mock data
const laporanMingguanMock: DataTable[] = [
  {
    id_satdik: 1,
    satdik: "Politeknik AUP",
    jumlah_kegiatan: 6,
    jumlah_status_lelang: 2,
    jumlah_status_pengerjaan: 3,
    jumlah_status_selesai: 1,
    proses_keuangan_anggaran: "120.000.000",
    proses_keuangan_realisasi: "90.000.000",
    proses_keuangan_deviasi: "-30.000.000",
    proses_fisik_target: "75%",
    proses_fisik_realisasi: "60%",
    proses_fisik_deviasi: "-15%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Sidoarjo",
    jumlah_kegiatan: 5,
    jumlah_status_lelang: 1,
    jumlah_status_pengerjaan: 2,
    jumlah_status_selesai: 2,
    proses_keuangan_anggaran: "100.000.000",
    proses_keuangan_realisasi: "85.000.000",
    proses_keuangan_deviasi: "-15.000.000",
    proses_fisik_target: "80%",
    proses_fisik_realisasi: "70%",
    proses_fisik_deviasi: "-10%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Bitung",
    jumlah_kegiatan: 7,
    jumlah_status_lelang: 2,
    jumlah_status_pengerjaan: 4,
    jumlah_status_selesai: 1,
    proses_keuangan_anggaran: "140.000.000",
    proses_keuangan_realisasi: "100.000.000",
    proses_keuangan_deviasi: "-40.000.000",
    proses_fisik_target: "85%",
    proses_fisik_realisasi: "65%",
    proses_fisik_deviasi: "-20%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Sorong",
    jumlah_kegiatan: 4,
    jumlah_status_lelang: 1,
    jumlah_status_pengerjaan: 1,
    jumlah_status_selesai: 2,
    proses_keuangan_anggaran: "90.000.000",
    proses_keuangan_realisasi: "80.000.000",
    proses_keuangan_deviasi: "-10.000.000",
    proses_fisik_target: "70%",
    proses_fisik_realisasi: "65%",
    proses_fisik_deviasi: "-5%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Karawang",
    jumlah_kegiatan: 6,
    jumlah_status_lelang: 2,
    jumlah_status_pengerjaan: 2,
    jumlah_status_selesai: 2,
    proses_keuangan_anggaran: "110.000.000",
    proses_keuangan_realisasi: "95.000.000",
    proses_keuangan_deviasi: "-15.000.000",
    proses_fisik_target: "85%",
    proses_fisik_realisasi: "80%",
    proses_fisik_deviasi: "-5%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Dumai",
    jumlah_kegiatan: 5,
    jumlah_status_lelang: 1,
    jumlah_status_pengerjaan: 3,
    jumlah_status_selesai: 1,
    proses_keuangan_anggaran: "95.000.000",
    proses_keuangan_realisasi: "70.000.000",
    proses_keuangan_deviasi: "-25.000.000",
    proses_fisik_target: "75%",
    proses_fisik_realisasi: "60%",
    proses_fisik_deviasi: "-15%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Pangandaran",
    jumlah_kegiatan: 8,
    jumlah_status_lelang: 3,
    jumlah_status_pengerjaan: 3,
    jumlah_status_selesai: 2,
    proses_keuangan_anggaran: "160.000.000",
    proses_keuangan_realisasi: "120.000.000",
    proses_keuangan_deviasi: "-40.000.000",
    proses_fisik_target: "90%",
    proses_fisik_realisasi: "75%",
    proses_fisik_deviasi: "-15%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Jembrana",
    jumlah_kegiatan: 4,
    jumlah_status_lelang: 1,
    jumlah_status_pengerjaan: 2,
    jumlah_status_selesai: 1,
    proses_keuangan_anggaran: "85.000.000",
    proses_keuangan_realisasi: "70.000.000",
    proses_keuangan_deviasi: "-15.000.000",
    proses_fisik_target: "65%",
    proses_fisik_realisasi: "55%",
    proses_fisik_deviasi: "-10%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Kupang",
    jumlah_kegiatan: 6,
    jumlah_status_lelang: 2,
    jumlah_status_pengerjaan: 3,
    jumlah_status_selesai: 1,
    proses_keuangan_anggaran: "115.000.000",
    proses_keuangan_realisasi: "90.000.000",
    proses_keuangan_deviasi: "-25.000.000",
    proses_fisik_target: "80%",
    proses_fisik_realisasi: "65%",
    proses_fisik_deviasi: "-15%",
    detail: "Lihat Detail",
  },
  {
    id_satdik: 1,
    satdik: "Politeknik KP Bone",
    jumlah_kegiatan: 5,
    jumlah_status_lelang: 1,
    jumlah_status_pengerjaan: 2,
    jumlah_status_selesai: 2,
    proses_keuangan_anggaran: "100.000.000",
    proses_keuangan_realisasi: "85.000.000",
    proses_keuangan_deviasi: "-15.000.000",
    proses_fisik_target: "75%",
    proses_fisik_realisasi: "70%",
    proses_fisik_deviasi: "-5%",
    detail: "Lihat Detail",
  },

  {
    id_satdik: 1,
    satdik: "AK Wakatobi    ",
    jumlah_kegiatan: 7,
    jumlah_status_lelang: 2,
    jumlah_status_pengerjaan: 4,
    jumlah_status_selesai: 1,
    proses_keuangan_anggaran: "130.000.000",
    proses_keuangan_realisasi: "100.000.000",
    proses_keuangan_deviasi: "-30.000.000",
    proses_fisik_target: "85%",
    proses_fisik_realisasi: "70%",
    proses_fisik_deviasi: "-15%",
    detail: "Lihat Detail",
  },
];

const allColumns = (
    router: ReturnType<typeof useRouter>
): ColumnDef<DataTable, any>[] => [
  {
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Satuan Pendidikan",
    accessorKey: "satdik",
  },
  {
    header: "Jumlah Kegiatan",
    accessorKey: "jumlah_kegiatan",
  },
  {
    header: "Jumlah Status",
    columns: [
      {
        id: "status_lelang",
        header: "Lelang",
        accessorKey: "jumlah_status_lelang",
      },
      {
        id: "status_pengerjaan",
        header: "Pengerjaan",
        accessorKey: "jumlah_status_pengerjaan",
      },
      {
        id: "status_selesai",
        header: "Selesai",
        accessorKey: "jumlah_status_selesai",
      },
    ],
  },
  {
    header: "Proses Keuangan",
    columns: [
      {
        id: "proses_keuangan_anggaran",
        header: "Anggaran",
        accessorKey: "proses_keuangan_anggaran",
      },
      {
        id: "proses_keuangan_realisasi",
        header: "Realisasi",
        accessorKey: "proses_keuangan_realisasi",
      },
      {
        id: "proses_keuangan_deviasi",
        header: "Deviasi",
        accessorKey: "proses_keuangan_deviasi",
      },
    ],
  },
  {
    header: "Progres Fisik",
    columns: [
      {
        id: "progres_fisik_target",
        header: "Target",
        accessorKey: "proses_fisik_target",
      },
      {
        id: "proses_fisik_realisasi",
        header: "Realisasi",
        accessorKey: "proses_fisik_realisasi",
      },
      {
        id: "proses_fisik_deviasi",
        header: "Deviasi",
        accessorKey: "proses_fisik_deviasi",
      },
    ],
  },
  {
    header: "Detail",
    cell: ({ row }) => {
      const satdik = row.original;
      return (
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => {
            router.push(
              `/dashboard/detail-dashboard/${row.original.id_satdik}`
            );
          }}
        >
          View Detail
        </button>
      );
    },
  },
];

export default function TabelDashboard() {
  const [data] = useState(() => laporanMingguanMock);
  const router = useRouter();

  const table = useReactTable({
    data,
    columns: allColumns(router),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-2xl border shadow-sm p-2 space-y-4 max-w-[95vw] overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
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
              <TableCell colSpan={allColumns(router).length} className="text-center">
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
    </div>
  );
}
