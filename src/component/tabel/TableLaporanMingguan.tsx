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
import { LaporanMingguan } from "../interface/dataReal";
import { useState } from "react";

const laporanMingguanMock: LaporanMingguan[] = [
  {
    minggu: "M1",
    target_fisik_perminggu: "10%",
    minggu_fisik: "M1",
    realisasi_fisik_perminggu: "8%",
    deviasi: "-2%",
    target_realisasi_anggaran_per_termin: "Rp 100.000.000",
    reaisasi_per_termin: "Rp 80.000.000",
    sisa_kontrak: "Rp 20.000.000",
    tingkat_capaiannya_keberhasilan: "80%",
    tindak_lanjut_rekomendasi_sebelumnya: "Peningkatan pengawasan lapangan",
    permasalahan: "Keterlambatan pengiriman material",
    rekomendasi: "Koordinasi ulang dengan vendor material",
  },
  {
    minggu: "M2",
    target_fisik_perminggu: "20%",
    minggu_fisik: "M2",
    realisasi_fisik_perminggu: "18%",
    deviasi: "-2%",
    target_realisasi_anggaran_per_termin: "Rp 200.000.000",
    reaisasi_per_termin: "Rp 170.000.000",
    sisa_kontrak: "Rp 30.000.000",
    tingkat_capaiannya_keberhasilan: "85%",
    tindak_lanjut_rekomendasi_sebelumnya: "Percepatan mobilisasi alat",
    permasalahan: "Cuaca buruk menghambat pekerjaan",
    rekomendasi: "Penyesuaian jadwal kerja sore/malam",
  },
];

const allColumns = (): ColumnDef<LaporanMingguan, any>[] => [
  {
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Target dan Realisasi Fisik (%)",
    columns: [
      {
        id: "target_fisik",
        header: "Target Fisik",
        columns: [
          {
            accessorKey: "minggu",
            header: "Minggu",
          },
          {
            accessorKey: "target_fisik_perminggu",
            header: "Target",
          },
          {
            accessorKey: "deviasi",
            header: "Deviasi",
          },
        ],
      },
      {
        id: "realisasi_fisik",
        header: "Realisasi Fisik",
        columns: [
          {
            accessorKey: "minggu_fisik",
            header: "Minggu",
          },
          {
            accessorKey: "realisasi_fisik_perminggu",
            header: "Realisasi",
          },
        ],
      },
    ],
  },
  {
    header: "Anggaran",
    columns: [
      {
        accessorKey: "target_realisasi_anggaran_per_termin",
        header: "Target / Termin",
      },
      {
        accessorKey: "reaisasi_per_termin",
        header: "Realisasi / Termin",
      },
      {
        accessorKey: "sisa_kontrak",
        header: "Sisa Kontrak",
      },
    ],
  },
  {
    header: "Evaluasi",
    columns: [
      {
        accessorKey: "tingkat_capaiannya_keberhasilan",
        header: "Tingkat Capaian",
      },
      {
        accessorKey: "tindak_lanjut_rekomendasi_sebelumnya",
        header: "Tindak Lanjut",
      },
      {
        accessorKey: "permasalahan",
        header: "Permasalahan",
      },
      {
        accessorKey: "rekomendasi",
        header: "Rekomendasi",
      },
    ],
  },
];

export default function TabelMingguan() {
  const [data] = useState(() => laporanMingguanMock);

  const table = useReactTable({
    data,
    columns: allColumns(),
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
                  <TableCell
                    key={cell.id}
                    className="border px-2 py-1 text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={allColumns().length} className="text-center">
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
