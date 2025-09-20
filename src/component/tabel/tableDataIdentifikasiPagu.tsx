"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TableData {
  satker: string
  renovasiGedung: number
  bangunGedung: number
  renovasiJaringan: number
  renovasiJembatan: number
  renovasiSaluran: number
  peralatanMesin: number
}

const data: TableData[] = [
  {
    satker: "Politeknik AUP",
    renovasiGedung: 56732221000,
    bangunGedung: 0,
    renovasiJaringan: 0,
    renovasiJembatan: 1904735000,
    renovasiSaluran: 906784000,
    peralatanMesin: 0,
  },
  {
    satker: "Politeknik KP Sidoarjo",
    renovasiGedung: 15701052000,
    bangunGedung: 9298948000,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 25821900000,
  },
  {
    satker: "Politeknik KP Bitung",
    renovasiGedung: 16549000000,
    bangunGedung: 9104000000,
    renovasiJaringan: 900000000,
    renovasiJembatan: 600000000,
    renovasiSaluran: 100000000,
    peralatanMesin: 37507500000,
  },
  {
    satker: "Politeknik KP Sorong",
    renovasiGedung: 7629232000,
    bangunGedung: 1210545000,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 23578535000,
  },
  {
    satker: "Politeknik KP Karawang",
    renovasiGedung: 8564000000,
    bangunGedung: 0,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 0,
  },
  {
    satker: "Politeknik KP Bone",
    renovasiGedung: 22079857000,
    bangunGedung: 1527515000,
    renovasiJaringan: 0,
    renovasiJembatan: 1100000000,
    renovasiSaluran: 0,
    peralatanMesin: 39000918000,
  },
  {
    satker: "Politeknik KP Kupang",
    renovasiGedung: 29685090000,
    bangunGedung: 0,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 38973441000,
  },
  {
    satker: "Politeknik KP Pangandaran",
    renovasiGedung: 14654473000,
    bangunGedung: 3798748000,
    renovasiJaringan: 0,
    renovasiJembatan: 12108979000,
    renovasiSaluran: 0,
    peralatanMesin: 6786888000,
  },
  {
    satker: "Politeknik KP Jembrana",
    renovasiGedung: 12420200000,
    bangunGedung: 28333700000,
    renovasiJaringan: 1159219000,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 31854898000,
  },
  {
    satker: "Politeknik KP Dumai",
    renovasiGedung: 19644065000,
    bangunGedung: 29950076000,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 13621300000,
  },
  {
    satker: "AK KP Wakatobi",
    renovasiGedung: 0,
    bangunGedung: 0,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 3606679000,
  },
  {
    satker: "Sekretariat Tim Satgas",
    renovasiGedung: 0,
    bangunGedung: 0,
    renovasiJaringan: 0,
    renovasiJembatan: 0,
    renovasiSaluran: 0,
    peralatanMesin: 6125398000,
  },
]

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function TableComponent() {
  // Hitung total tiap row
  const withTotal = data.map((item) => ({
    ...item,
    total:
      item.renovasiGedung +
      item.bangunGedung +
      item.renovasiJaringan +
      item.renovasiJembatan +
      item.renovasiSaluran +
      item.peralatanMesin,
  }))

  // Hitung grand total semua satker
  const grandTotal = withTotal.reduce(
    (acc, cur) => {
      acc.renovasiGedung += cur.renovasiGedung
      acc.bangunGedung += cur.bangunGedung
      acc.renovasiJaringan += cur.renovasiJaringan
      acc.renovasiJembatan += cur.renovasiJembatan
      acc.renovasiSaluran += cur.renovasiSaluran
      acc.peralatanMesin += cur.peralatanMesin
      acc.total += cur.total
      return acc
    },
    {
      renovasiGedung: 0,
      bangunGedung: 0,
      renovasiJaringan: 0,
      renovasiJembatan: 0,
      renovasiSaluran: 0,
      peralatanMesin: 0,
      total: 0,
    }
  )

  return (
    <div className="rounded-2xl border shadow-sm p-2 space-y-4 max-w-[78vw] overflow-x-auto">
         
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Satker</TableHead>
            <TableHead>Renovasi Gedung dan Bangunan</TableHead>
            <TableHead>Bangun Gedung dan Bangunan</TableHead>
            <TableHead>Renovasi/Bangun Jaringan</TableHead>
            <TableHead>Renovasi/Bangun Jembatan</TableHead>
            <TableHead>Renovasi/bangun saluran irigasi</TableHead>
            <TableHead>Peralatan dan Mesin</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withTotal.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{item.satker}</TableCell>
              <TableCell>{formatRupiah(item.renovasiGedung)}</TableCell>
              <TableCell>{formatRupiah(item.bangunGedung)}</TableCell>
              <TableCell>{formatRupiah(item.renovasiJaringan)}</TableCell>
              <TableCell>{formatRupiah(item.renovasiJembatan)}</TableCell>
              <TableCell>{formatRupiah(item.renovasiSaluran)}</TableCell>
              <TableCell>{formatRupiah(item.peralatanMesin)}</TableCell>
              <TableCell className="font-bold">{formatRupiah(item.total)}</TableCell>
            </TableRow>
          ))}

          {/* Grand Total Row */}
          <TableRow className="bg-gray-100 font-bold">
            <TableCell>Grand Total</TableCell>
            <TableCell>{formatRupiah(grandTotal.renovasiGedung)}</TableCell>
            <TableCell>{formatRupiah(grandTotal.bangunGedung)}</TableCell>
            <TableCell>{formatRupiah(grandTotal.renovasiJaringan)}</TableCell>
            <TableCell>{formatRupiah(grandTotal.renovasiJembatan)}</TableCell>
            <TableCell>{formatRupiah(grandTotal.renovasiSaluran)}</TableCell>
            <TableCell>{formatRupiah(grandTotal.peralatanMesin)}</TableCell>
            <TableCell>{formatRupiah(grandTotal.total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
