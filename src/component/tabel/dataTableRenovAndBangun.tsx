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
  Header,
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
import { dataTablePercanaan } from "../interface/dataTablePerencanaan";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";
import { perencaanKegiatan } from "../interface/perencanaanInterface";
import { fileCell } from "../utils/getFile";
import axios from "axios";


interface PerencanaanKegiatanReal {
  id_perencanaan_kegiatan: number;
  id_satdik: number;
  satdik: string;
  nama_pekerjaan: string;
  ManajemenResiko: string;
  ManajemenResikoFile1: string;
  ManajemenResikoFile2: string;
  anggaran: number;
  jadwal_pengadaan: string;
  kategori_pengadaan: string;
  sirup_p_barang: string;
  metode_pemilihan_p_barang: string;
  justifikasi_pemilihan_p_barang: string;
  kak_p_barang: string;
  rab_p_barang: string;
  hps_penetapan_p_barang: string;
  hps_nilai_p_barang: number;
  hasil_survei_p_barang: string;
  rancangan_kontrak_p_barang: string;
  hasil_pendampingan_p_barang: string;
  sirup_p_konsultan_perencanaan: string;
  metode_pemilihan_p_konsultan_perencanaan: string;
  justifikasi_pemilihan_p_konsultan_perencanaan: string;
  kak_p_konsultan_perencanaan: string;
  rab_p_konsultan_perencanaan: string;
  hps_penetapan_p_konsultan_perencanaan: string;
  hps_nilai_p_konsultan_perencanaan: string;
  rancangan_kontrak_p_konsultan_perencanaan: string;
  hasil_pendampingan_p_konsultan_perencanaan: string;
  sirup_p_kontruksi: string;
  metode_pemilihan_p_kontruksi: string;
  justifikasi_pemilihan_p_kontruksi: string;
  kak_p_kontruksi: string;
  rab_p_kontruksi: string;
  gambar_perencanaan: string;
  spesifikasi_teknis: string;
  rekomendasi_pupr: string;
  hps_penetapan_p_kontruksi: string;
  hps_nilai_p_kontruksi: string;
  rancangan_kontrak_p_kontruksi: string;
  hasil_pendampingan_p_kontruksi: string;
  sirup_p_konsultan_pengawas: string;
  metode_pemilihan_p_konsultan_pengawas: string;
  justifikasi_pemilihan_p_konsultan_pengawas: string;
  kak_p_konsultan_pengawas: string;
  rab_p_konsultan_pengawas: string;
  hps_uraian_p_konsultan_pengawas: string;
  hps_nilai_p_konsultan_pengawas: string;
  rancangan_kontrak_p_konsultan_pengawas: string;
  hasil_pendampingan_p_konsultan_pengawas: string;
  created_at: string;
  update_at: string;
}

interface Props {
  data: PerencanaanKegiatanReal[];
}

const allColumns = (
  router: ReturnType<typeof useRouter>,
  onDelete: (id: string | number) => void
): ColumnDef<PerencanaanKegiatanReal, any>[] => [
  {
    header: "No",
    cell: ({ row }) => row.index + 1, // row.index mulai dari 0
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() =>
            router.push(
              `perencanaan/edit/${row.original.id_perencanaan_kegiatan}`
            )
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
    accessorKey: "satdik",
    header: "Satuan Pendidikan",
  },
  {
    accessorKey: "nama_pekerjaan",
    header: "Nama Pekerjaan",
  },
  {
    accessorKey: "anggaran",
    header: "Anggaran",
    cell: (info) =>
      info.getValue<number>()?.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
      }),
  },

  // ================== Konsultan Perencana ==================
  {
    header: "Konsultan Perencana",
    columns: [
      {
        accessorKey: "sirup_p_konsultan_perencanaan",
        header: "SiRUP",
      },
      {
        id: "metode_justifikasi_konsultan_perencana", // <== id unik
        header: "Metode Pemilihan & Justifikasi",
        accessorFn: (row) =>
          `${row.metode_pemilihan_p_konsultan_perencanaan} - ${row.justifikasi_pemilihan_p_konsultan_perencanaan}`,
      },

      {
        id: "kak_p_konsultan_perencanaan",
        accessorFn: (row) => row.kak_p_konsultan_perencanaan,
        header: "KAK",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        id: "rab_p_konsultan_perencanaan",
        accessorFn: (row) => row.rab_p_konsultan_perencanaan,
        header: "RAB",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        header: "HPS",
        columns: [
          {
            id: "hps_penetapan_p_konsultan_perencanaan",
            accessorFn: (row) => row.hps_penetapan_p_konsultan_perencanaan,
            header: "HPS Penetapan",
            cell: ({ getValue }) => fileCell(getValue()),
          },
          {
            accessorKey: "hps_nilai_p_konsultan_perencanaan",
            header: "Nilai",
            cell: (info) => {
              const rawValue = info.getValue<string>();
              const numValue = Number(rawValue);

              return !isNaN(numValue)
                ? numValue.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                : "-";
            },
          },
        ],
      },
      {
        id: "rancangan_kontrak_p_konsultan_perencanaan",
        accessorFn: (row) => row.rancangan_kontrak_p_konsultan_perencanaan,
        header: "Rancangan Kontrak/SPK",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        accessorKey: "hasil_pendampingan_p_konsultan_perencanaan",
        header: "Hasil Pendampingan",
      },
    ],
  },

  // ================== Konstruksi ==================
  {
    header: "Konstruksi",
    columns: [
      {
        accessorKey: "sirup_p_kontruksi",
        header: "SiRUP",
      },
      {
        id: "metode_justifikasi_konstruksi", // <== id unik
        header: "Metode Pemilihan & Justifikasi",
        accessorFn: (row) =>
          `${row.metode_pemilihan_p_kontruksi} - ${row.justifikasi_pemilihan_p_kontruksi}`,
      },
      {
        id: "kak_p_kontruksi",
        accessorFn: (row) => row.kak_p_kontruksi,
        header: "KAK",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        id: "rab_p_kontruksi",
        accessorFn: (row) => row.rab_p_kontruksi,
        header: "RAB",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        id: "gambar_perencanaan",
        accessorFn: (row) => row.gambar_perencanaan,
        header: "Gambar Perencaan / DED",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        id: "spesifikasi_teknis",
        accessorFn: (row) => row.spesifikasi_teknis,
        header: "Spesifikasi Teknis",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        id: "rekomendasi_pupr",
        accessorFn: (row) => row.rekomendasi_pupr,
        header: "Rekomendasi PUPR",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        header: "HPS",
        columns: [
          {
            id: "hps_penetapan_p_kontruksi",
            accessorFn: (row) => row.hps_penetapan_p_kontruksi,
            header: "HPS Penetapan",
            cell: ({ getValue }) => fileCell(getValue()),
          },

          {
            accessorKey: "hps_nilai_p_kontruksi",
            header: "Nilai",
            cell: (info) => {
              const rawValue = info.getValue<string>();
              const numValue = Number(rawValue);

              return !isNaN(numValue)
                ? numValue.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                : "-";
            },
          },
        ],
      },
      {
        id: "rancangan_kontrak_p_kontruksi",
        accessorFn: (row) => row.rancangan_kontrak_p_kontruksi,
        header: "Rancangan Kontrak/SPK",
        cell: ({ getValue }) => fileCell(getValue()),
      },

      {
        accessorKey: "hasil_pendampingan_p_kontruksi",
        header: "Hasil Pendampingan",
      },
    ],
  },

  // ================== Konsultan Pengawas ==================
  {
    header: "Konsultan Pengawas",
    columns: [
      {
        accessorKey: "sirup_p_konsultan_pengawas",
        header: "SiRUP",
      },
      {
        id: "metode_justifikasi_konsultan_pengawas", // <== id unik
        header: "Metode Pemilihan & Justifikasi",
        accessorFn: (row) =>
          `${row.metode_pemilihan_p_konsultan_pengawas} - ${row.justifikasi_pemilihan_p_konsultan_pengawas}`,
      },
      {
        id: "kak_p_konsultan_pengawas",
        accessorFn: (row) => row.kak_p_konsultan_pengawas,
        header: "KAK",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        id: "rab_p_konsultan_pengawas",
        accessorFn: (row) => row.rab_p_konsultan_pengawas,
        header: "RAB",
        cell: ({ getValue }) => fileCell(getValue()),
      },
      {
        header: "HPS",
        columns: [
          {
            id: "hps_uraian_p_konsultan_pengawas",
            accessorFn: (row) => row.hps_uraian_p_konsultan_pengawas,
            header: "Penetapan",
            cell: ({ getValue }) => fileCell(getValue()),
          },

          {
            accessorKey: "hps_nilai_p_konsultan_pengawas",
            header: "Nilai",
            cell: (info) => {
              const rawValue = info.getValue<string>();
              const numValue = Number(
                rawValue?.replace(/\./g, "").replace(",", ".")
              );

              return !isNaN(numValue)
                ? numValue.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })
                : "-";
            },
          },
        ],
      },
      {
        id: "rancangan_kontrak_p_konsultan_pengawas",
        accessorFn: (row) => row.rancangan_kontrak_p_konsultan_pengawas,
        header: "Rancangan Kontrak / SPK",
        cell: ({ getValue }) => fileCell(getValue()),
      },

      {
        accessorKey: "hasil_pendampingan_p_konsultan_pengawas",
        header: "Hasil Pendampingan",
      },
    ],
  },
];

const getHeaderGroupColor = (h: any): string => {
  if (!h) return "bg-white";

  if (h.column?.columnDef?.header === "Konsultan Perencana") {
    return "bg-blue-200 text-blue-900";
  }
  if (h.column?.columnDef?.header === "Konstruksi") {
    return "bg-red-200 text-red-900";
  }
  if (h.column?.columnDef?.header === "Konsultan Pengawas") {
    return "bg-yellow-200 text-red-900";
  }

  return h.column?.parent ? getHeaderGroupColor(h.column.parent) : "bg-white";
};

async function exportToExcel(table: any) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data Pembangunan");

  // ==== 1. Buat header group ====
  const headerGroups = table.getHeaderGroups();

  headerGroups.forEach((hg, rowIndex) => {
    const row = worksheet.getRow(rowIndex + 1);

    hg.headers.forEach((header, colIndex) => {
      if (header.isPlaceholder) return;

      const cell = row.getCell(colIndex + 1);
      cell.value = header.column.columnDef.header as string;
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.font = { bold: true };

      // kasih warna sesuai group
      const color = getHeaderGroupColor(header);

      if (color.includes("blue")) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFBFDBFE" }, // bg-blue-200
        };
      }
      if (color.includes("red")) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFECACA" }, // bg-red-200
        };
      }
      if (color.includes("yellow")) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FEF08A" }, // bg-yellow-200
        };
      }
      // merge kalau colSpan > 1
      // merge kalau colSpan > 1
      if (header.colSpan > 1) {
        const startRow = rowIndex + 1;
        const endRow = rowIndex + 1;
        const startCol = colIndex + 1;
        const endCol = colIndex + header.colSpan;

        const range = `${worksheet.getColumn(startCol).letter}${startRow}:${
          worksheet.getColumn(endCol).letter
        }${endRow}`;
        const alreadyMerged = worksheet.model.merges?.[range];

        if (!alreadyMerged) {
          worksheet.mergeCells(range);
        }
      }
    });
  });

  // ==== 2. Tambah data ====
  table.getRowModel().rows.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(headerGroups.length + rowIndex + 1);
    row.getVisibleCells().forEach((cell, colIndex) => {
      excelRow.getCell(colIndex + 1).value = cell.getValue() as any;
      excelRow.getCell(colIndex + 1).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // ==== 3. Auto fit columns ====
  worksheet.columns.forEach((col) => {
    let maxLength = 0;
    col.eachCell({ includeEmpty: true }, (cell) => {
      maxLength = Math.max(
        maxLength,
        cell.value ? cell.value.toString().length : 0
      );
    });
    col.width = maxLength + 2;
  });

  // ==== 4. Download ====
  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), "DataPembangunan.xlsx");
}

export default function DataTablePembangunanRenovasi({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

   const [deleteId, setDeleteId] = React.useState<string | number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const router = useRouter();
  const columns = React.useMemo(
    () => allColumns(router, (id: string | number) => {
      setDeleteId(id);
      setIsDeleteDialogOpen(true);
    }),
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

  // helper buat cek parent chain
  // helper buat cek apakah header ada di dalam group "Konsultan Perencana"
  // aman buat cek header nested
  const isInsideKonsultan = (
    h: Header<dataTablePercanaan, any> | undefined
  ): boolean => {
    if (!h) return false;
    if (h.column?.columnDef?.header === "Konsultan Perencana") return true;
    // Use headerGroup to traverse up the header hierarchy
    return h.headerGroup
      ? isInsideKonsultan(
          h.headerGroup.headers.find((header) => header.id === h.headerGroup.id)
        )
      : false;
  };

  const getHeaderGroupColor = (h: any): string => {
    if (!h) return "bg-white";

    if (h.column?.columnDef?.header === "Konsultan Perencana") {
      return "bg-blue-200 text-blue-900";
    }
    if (h.column?.columnDef?.header === "Konstruksi") {
      return "bg-red-200 text-red-900";
    }
    if (h.column?.columnDef?.header === "Konsultan Pengawas") {
      return "bg-yellow-200 text-red-900";
    }

    return h.column?.parent ? getHeaderGroupColor(h.column.parent) : "bg-white";
  };
  
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

  return (
    <div className="space-y-4 max-w-[85vw] overflow-x-auto">
      {/* Search */}
      <div className="flex justify-end mb-2">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-64"
        />
      </div>
      {/* <Button onClick={() => exportToExcel(table)}>Export Excel</Button> */}

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const colorClass = getHeaderGroupColor(header);

                // header.colSpan sudah otomatis dihitung dari subcolumns
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan} // <== ini yang bikin merge
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
