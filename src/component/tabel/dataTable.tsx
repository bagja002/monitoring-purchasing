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
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { dataTablePercanaan } from "../interface/dataTablePerencanaan";


interface Props {
  data: dataTablePercanaan[];
}

  const allColumns: ColumnDef<dataTablePercanaan>[] = [
    { id: "no", accessorFn: row => row.no, header: "No" },
    { id: "satdik", accessorFn: row => row.satdik, header: "Satuan Pendidikan" },
    { id: "nama_pekerjaan", accessorFn: row => row.nama_pekerjaan, header: "Nama Pekerjaan" },
    { id: "anggaran", accessorFn: row => row.anggaran, header: "Anggaran", cell: info => info.getValue<number>().toLocaleString("id-ID") },
    { id: "jadwal_pengadaan", accessorFn: row => row.jadwal_pengadaan, header: "Jadwal Pengadaan" },
    { id: "kategori_pengadaan", accessorFn: row => row.kategori_pengadaan, header: "Kategori Pengadaan" },
    
    // Kolom khusus "Pengadaan Barang"
    { id: "sirup", accessorFn: row => row.sirup, header: "SiRUP" },
    { id: "metode_pemilihan", accessorFn: row => row.metode_pemilihan, header: "Metode Pemilihan dan Justifikasi", 
      cell: info => (
        <>
          {info.row.original.metode_pemilihan} <br /> {info.row.original.justifikasi_pemilihan}
        </>
      )
    },
    { id: "kak", accessorFn: row => row.kak, header: "KAK" },
    { id: "rab", accessorFn: row => row.rab, header: "RAB" },
    { id: "hps_penetapan", accessorFn: row => row.hps_penetapan, header: "HPS Penetapan", cell: info => info.getValue<number>().toLocaleString("id-ID") },
    { id: "hps_nilai", accessorFn: row => row.hps_nilai, header: "HPS Nilai", cell: info => info.getValue<number>().toLocaleString("id-ID") },
    { id: "hasil_survei", accessorFn: row => row.hasil_survei, header: "Hasil Survei" },
    { id: "rancangan_kontrak", accessorFn: row => row.rancangan_kontrak, header: "Rancangan Kontrak/SPK" },
    { id: "hasil_pendampingan", accessorFn: row => row.hasil_pendampingan, header: "Hasil Pendampingan" },

    // Kolom lainnya
    { id: "gambar_perencanaan", accessorFn: row => row.gambar_perencanaan, header: "Gambar Perencanaan", cell: info => info.getValue<string>() ? (
        <a href={info.getValue<string>()} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lihat File</a>
      ) : "-"
    },
    { id: "spesifikasi_teknis", accessorFn: row => row.spesifikasi_teknis, header: "Spesifikasi Teknis (RKS)" },
    { id: "rekomendasi_pupr", accessorFn: row => row.rekomendasi_pupr, header: "Rekomendasi PUPR" },
    { id: "pagu", accessorFn: row => row.pagu, header: "Pagu", cell: info => info.getValue<number>().toLocaleString("id-ID") },
    { id: "realisasi", accessorFn: row => row.realisasi, header: "Realisasi", cell: info => info.getValue<number>().toLocaleString("id-ID") },
  ]

export default function DataTable({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");



  // Filter kolom berdasarkan kategori_pengadaan
const columns = React.useMemo(() => {
  if (data.length && data[0].kategori_pengadaan === "Barang") {
    return allColumns.filter(col =>
      [
        "no", "satdik", "nama_pekerjaan", "anggaran", "jadwal_pengadaan", "kategori_pengadaan",
        "sirup", "metode_pemilihan", "kak", "rab", "hps_penetapan", "hps_nilai", "hasil_survei",
        "rancangan_kontrak", "hasil_pendampingan"
      ].includes(col.id!)
    );
  }
  return allColumns;
}, [data]); // ✅ tambah allColumns

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
   globalFilterFn: (row, columnId, filterValue) => {
  const value = row.getValue<unknown>(columnId);
  return String(value ?? "").toLowerCase().includes(filterValue.toLowerCase());
},

  });

  return (
    <div className="space-y-4 max-w-[78vw]">
      {/* Search */}
      <div className="flex justify-end mb-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-64"
        />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
        <Button size="sm" onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)} disabled={!table.getCanPreviousPage()}>Prev</Button>
        <Button size="sm" onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)} disabled={!table.getCanNextPage()}>Next</Button>
      </div>
    </div>
  );
}
