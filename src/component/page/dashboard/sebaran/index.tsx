"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// ====================== DATA ======================
const dataTable = [
  { no: 1, uraian: "Pengadaan Barang", jumlah: 100, belum: 0, proses: 0, selesaiTender: 0, pelaksanaan: 0, bast: 0 },
  { no: 2, uraian: "Renovasi Gedung dan Bangunan", jumlah: 50, belum: 0, proses: 0, selesaiTender: 0, pelaksanaan: 0, bast: 0 },
  { no: 3, uraian: "Pembangunan Gedung Baru", jumlah: 119, belum: 0, proses: 0, selesaiTender: 0, pelaksanaan: 0, bast: 0 },
];

const totalPaket = dataTable.reduce((acc, d) => acc + d.jumlah, 0);

// === Data Sebaran Paket Pekerjaan ===
const sebaranData = {
  labels: ["Pengadaan Barang", "Renovasi Gedung dan Bangunan", "Pembangunan Gedung Baru"],
  datasets: [
    {
      data: dataTable.map((d) => d.jumlah),
      backgroundColor: ["#2563eb", "#f97316", "#0ea5e9"],
      borderWidth: 1,
    },
  ],
};

// === Data Status Chart (3 jenis pekerjaan) ===
const statusColors = ["#1e40af", "#f97316", "#22c55e", "#0ea5e9", "#9333ea"];
const statusLabels = ["Belum Tender", "Proses Tender", "Selesai Tender", "Pelaksanaan Kontrak", "Selesai (BAST)"];

const makeStatusData = (jumlah: number) => ({
  labels: statusLabels,
  datasets: [
    {
      data: [5, 2, 3, 4, 5], // contoh dummy data status
      backgroundColor: statusColors,
      borderWidth: 1,
    },
  ],
});

export default function DashboardPaketPekerjaan() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-4">Dashboard Sebaran Paket Pekerjaan</h1>

      {/* GRID CHART */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Sebaran Paket */}
        <Card className="shadow-md md:col-span-1">
          <CardHeader>
            <CardTitle>Sebaran Paket Pekerjaan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex justify-center items-center h-64">
              <Doughnut
                data={sebaranData}
                options={{
                  plugins: {
                    legend: { position: "bottom" as const },
                    tooltip: { enabled: true },
                  },
                }}
              />
              <div className="absolute text-3xl font-semibold text-gray-700">{totalPaket}</div>
            </div>
          </CardContent>
        </Card>

        {/* Status Pengadaan Barang */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Status Pengadaan Barang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex justify-center items-center h-56">
              <Doughnut
                data={makeStatusData(100)}
                options={{
                  plugins: {
                    legend: { display: false },
                  },
                  cutout: "70%",
                }}
              />
              <div className="absolute text-2xl font-bold">100</div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-xs text-gray-500 flex flex-wrap gap-2 justify-center">
                {statusLabels.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[i] }}></span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Renovasi */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center">Status Renovasi Gedung dan Bangunan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex justify-center items-center h-56">
              <Doughnut
                data={makeStatusData(50)}
                options={{
                  plugins: {
                    legend: { display: false },
                  },
                  cutout: "70%",
                }}
              />
              <div className="absolute text-2xl font-bold">50</div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-xs text-gray-500 flex flex-wrap gap-2 justify-center">
                {statusLabels.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[i] }}></span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Pembangunan */}
        <Card className="shadow-md md:col-span-3 xl:col-span-3">
          <CardHeader>
            <CardTitle className="text-center">Status Pembangunan Gedung Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative flex justify-center items-center h-56">
              <Doughnut
                data={makeStatusData(119)}
                options={{
                  plugins: {
                    legend: { display: false },
                  },
                  cutout: "70%",
                }}
              />
              <div className="absolute text-2xl font-bold">119</div>
            </div>
            <div className="flex justify-center mt-2">
              <div className="text-xs text-gray-500 flex flex-wrap gap-2 justify-center">
                {statusLabels.map((s, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors[i] }}></span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Tabel Sebaran Paket</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="text-center">No</TableHead>
                <TableHead>Uraian</TableHead>
                <TableHead className="text-right">Jumlah Paket</TableHead>
                <TableHead className="text-right">Belum Tender</TableHead>
                <TableHead className="text-right">Proses Tender</TableHead>
                <TableHead className="text-right">Selesai Tender</TableHead>
                <TableHead className="text-right">Pelaksanaan Kontrak</TableHead>
                <TableHead className="text-right">Selesai (BAST)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataTable.map((d) => (
                <TableRow key={d.no}>
                  <TableCell className="text-center">{d.no}</TableCell>
                  <TableCell>{d.uraian}</TableCell>
                  <TableCell className="text-right font-semibold">{d.jumlah}</TableCell>
                  <TableCell className="text-right">{d.belum}</TableCell>
                  <TableCell className="text-right">{d.proses}</TableCell>
                  <TableCell className="text-right">{d.selesaiTender}</TableCell>
                  <TableCell className="text-right">{d.pelaksanaan}</TableCell>
                  <TableCell className="text-right">{d.bast}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-slate-100 font-bold">
                <TableCell colSpan={2} className="text-center">Total</TableCell>
                <TableCell className="text-right">{totalPaket}</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">0</TableCell>
                <TableCell className="text-right">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
