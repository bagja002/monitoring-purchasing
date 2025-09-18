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
import { dataTablePercanaan } from "../interface/dataTablePerencanaan";

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";



interface Props {
  data: dataTablePercanaan[];
}



export const allColumns = (router: ReturnType<typeof useRouter>): ColumnDef<dataTablePercanaan, any>[] => [
  {
    accessorKey: "no",
    header: "No",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
           onClick={() => router.push(`perencanaan/edit/${row.original.anggaran}`)}
        
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => console.log(row.original)}
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
  {
    header: "Konsultan Perencana",
    columns: [
      {
        accessorKey: "sirup",
        header: "SiRUP",
      },
      {
        header: "Metode Pemilihan & Justifikasi",
        accessorFn: (row) =>
          `${row.metode_pemilihan} - ${row.justifikasi_pemilihan}`,
      },
      {
        accessorKey: "kak",
        header: "KAK",
      },
      {
        accessorKey: "rab",
        header: "RAB",
      },
      {
        header: "HPS",
        columns: [
          {
            accessorKey: "hps_penetapan",
            header: "Penetapan",
          },
          {
            accessorKey: "hps_nilai",
            header: "Nilai",
            cell: (info) =>
              info.getValue<number>()?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              }),
          },
        ],
      },
      {
        accessorKey: "hasil_survei",
        header: "Hasil Survei",
      },
      {
        accessorKey: "rancangan_kontrak",
        header: "Rancangan Kontrak/SPK",
      },
      {
        accessorKey: "hasil_pendampingan",
        header: "Hasil Pendampingan",
      },
    ],
  },
  {
    header: "Konstruksi",
    columns: [
      {
        accessorKey: "sirups",
        header: "SiRUP",
      },
      {
        header: "Metode Pemilihan & Justifikasis",
        accessorFn: (row) =>
          `${row.metode_pemilihan} - ${row.justifikasi_pemilihan}`,
      },
      {
        accessorKey: "kaks",
        header: "KAK",
      },
      {
        accessorKey: "rabs",
        header: "RAB",
      },
      {
        header: "HPS",
        columns: [
          {
            accessorKey: "hps_penetapans",
            header: "Penetapan",
          },
          {
            accessorKey: "hps_nilais",
            header: "Nilai",
            cell: (info) =>
              info.getValue<number>()?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              }),
          },
        ],
      },
      {
        accessorKey: "hasil_surveis",
        header: "Hasil Survei",
      },
      {
        accessorKey: "rancangan_kontraks",
        header: "Rancangan Kontrak/SPKs",
      },
      {
        accessorKey: "hasil_pendampingans",
        header: "Hasil Pendampingan",
      },
    ],
  },

  {
    header: "Konsultan Pengawas",
    columns: [
      {
        accessorKey: "sirup_p_konsultan_pengawas",
        header: "SiRUP",
      },
      {
        header: "Metode Pemilihan & Justifikasiss",
        accessorFn: (row) =>
          `${row.metode_pemilihan} - ${row.justifikasi_pemilihan}`,
      },
      {
        accessorKey: "kak_p_konsultan_perencanaan",
        header: "KAK",
      },
      {
        accessorKey: "rab_p_konsultan_perencanaan",
        header: "RAB",
      },
      {
        header: "HPS",
        columns: [
          {
            accessorKey: "hps_penetapan_p_konsultan_perencanaan",
            header: "Penetapan",
          },
          {
            accessorKey: "hps_nilai_p_konsultan_perencanaan",
            header: "Nilai",
            cell: (info) =>
              info.getValue<number>()?.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              }),
          },
        ],
      },
      {
        accessorKey: "hasil_surveiss",
        header: "Hasil Survei",
      },
      {
        accessorKey: "rancangan_kontrakss",
        header: "Rancangan Kontrak/SPKs",
      },
      {
        accessorKey: "hasil_pendampinganss",
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

export default function DataTablePembangunan({ data }: Props) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

 

  const router = useRouter();
  const columns = React.useMemo(() => allColumns(router), [router]);

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
      <Button onClick={() => exportToExcel(table)}>Export Excel</Button>

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
    </div>
  );
}
