"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const dataTable = [
  {
    no: 1,
    uraian: "Pengadaan Barang",
    pagu: 62887347234,
    nilai_kontrak: 40000000000,
    realisasi_kontrak: 40000000000,
  },
  {
    no: 2,
    uraian: "Renovasi Gedung dan Bangunan",
    pagu: 65905684000,
    nilai_kontrak: 0,
    realisasi_kontrak: 0,
  },
  {
    no: 3,
    uraian: "Pembangunan Gedung Baru",
    pagu: 12065728000,
    nilai_kontrak: 0,
    realisasi_kontrak: 0,
  },
];

// === Chart Data ===
const pieData = {
  labels: ["Pengadaan Barang", "Renovasi Gedung dan Bangunan", "Pembangunan Gedung Baru"],
  datasets: [
    {
      data: dataTable.map((d) => d.pagu),
      backgroundColor: ["#2563eb", "#f97316", "#0ea5e9"],
      borderWidth: 1,
    },
  ],
};

const barData = {
  labels: ["Pengadaan Barang", "Renovasi Gedung dan Bangunan", "Pembangunan Gedung Baru"],
  datasets: [
    {
      label: "Nilai Kontrak (Rp)",
      data: dataTable.map((d) => d.pagu),
      backgroundColor: "#2563eb",
    },
    {
      label: "Realisasi Kontrak (Rp)",
      data: dataTable.map((d) => d.realisasi_kontrak),
      backgroundColor: "#f97316",
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Realisasi Kontrak",
    },
  },
  scales: {
    y: {
      ticks: {
        callback: function (value: any) {
          return value >= 1000000000 ? value / 1000000000 + " M" : value;
        },
      },
    },
  },
};

export default function DashboardKontrak() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Dashboard Anggaran & Realisasi Kontrak</h1>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Proporsi Pagu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex justify-center items-center">
              <Pie data={pieData} />
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Realisasi Kontrak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE SECTION */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Tabel Realisasi Kontrak</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="text-center">No</TableHead>
                <TableHead>Uraian</TableHead>
                <TableHead className="text-right">Pagu (Rp)</TableHead>
                <TableHead className="text-right">Nilai Kontrak (Rp)</TableHead>
                <TableHead className="text-right">Realisasi Kontrak (Rp)</TableHead>
                <TableHead className="text-right">% </TableHead>
                <TableHead className="text-right">Sisa Pagu (Efisiensi) (Rp)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataTable.map((item) => {
                const persen =
                  item.nilai_kontrak === 0 ? 0 : (item.realisasi_kontrak / item.nilai_kontrak) * 100;
                const sisa = item.pagu - item.nilai_kontrak;
                return (
                  <TableRow key={item.no}>
                    <TableCell className="text-center">{item.no}</TableCell>
                    <TableCell>{item.uraian}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.pagu.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.nilai_kontrak.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.realisasi_kontrak.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">{persen.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{sisa.toLocaleString("id-ID")}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-slate-100 font-bold">
                <TableCell colSpan={2} className="text-center">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {dataTable
                    .reduce((a, b) => a + b.pagu, 0)
                    .toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">0,00</TableCell>
                <TableCell className="text-right">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="text-sm text-gray-500 mt-3 space-y-1">
            <p>* Nilai Kontrak khusus yang sudah ada dokumen kontrak yang ditandatangani</p>
            <p>** % dihitung dari Realisasi Kontrak (Rp) dibagi Nilai Kontrak (Rp) dikali 100%</p>
            <p>*** Efisiensi dihitung dari Pagu (Rp) dikurangi dengan Nilai Kontrak (Rp)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
