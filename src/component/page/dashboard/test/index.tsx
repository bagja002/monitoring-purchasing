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
import { Dashboard1 } from "@/component/interface/dataDashboard";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface Props {
  data: Dashboard1;
}

export default function DashboardKontrak({ data }: Props) {
  // === Dummy realisasi (antara 60–100% dari pagu)
   const makeRealisasi = (pagu: number) =>
     Math.floor(pagu * (0.6 + Math.random() * 0.4));

  // === Data untuk tabel dan chart ===
  const dataTable = [
    {
      no: 1,
      uraian: "Pengadaan Barang",
      pagu: data.total_pengadaan_barang,
      realisasi: 0,
    },
    {
      no: 2,
      uraian: "Renovasi Gedung dan Bangunan",
      pagu: data.total_perbaikan,
      realisasi: 0,
    },
    {
      no: 3,
      uraian: "Pembangunan Gedung Baru",
      pagu: data.total_pembangunan_baru,
      realisasi: makeRealisasi(data.total_pembangunan_baru),
    },
  ];

  // === PIE CHART (berdasarkan proporsi anggaran) ===
  const pieData = {
    labels: dataTable.map((d) => d.uraian),
    datasets: [
      {
        label: "Pagu (Rp)",
        data: dataTable.map((d) => d.pagu),
        backgroundColor: ["#2563eb", "#f97316", "#0ea5e9"],
        borderWidth: 1,
      },
    ],
  };

  // === BAR CHART (bandingkan anggaran & realisasi) ===
  const barData = {
    labels: dataTable.map((d) => d.uraian),
    datasets: [
      {
        label: "Pagu (Rp)",
        data: dataTable.map((d) => d.pagu),
        backgroundColor: "#2563eb",
      },
      {
        label: "Realisasi (Rp)",
        data: dataTable.map((d) => d.realisasi),
        backgroundColor: "#f97316",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: false },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value: any) {
            return value >= 1000000000
              ? value / 1000000000 + " M"
              : value.toLocaleString("id-ID");
          },
        },
      },
    },
  };

  // === Hitung total ===
  const totalPagu = dataTable.reduce((a, b) => a + b.pagu, 0);
  const totalRealisasi = dataTable.reduce((a, b) => a + b.realisasi, 0);
  const persentaseTotal = totalPagu
    ? ((totalRealisasi / totalPagu) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        Dashboard Anggaran & Realisasi Kontrak
      </h1>

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
            <CardTitle>Perbandingan Pagu vs Realisasi</CardTitle>
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
          <CardTitle>Tabel Anggaran & Realisasi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="text-center">No</TableHead>
                <TableHead>Uraian</TableHead>
                <TableHead className="text-right">Pagu (Rp)</TableHead>
                <TableHead className="text-right">Realisasi (Rp)</TableHead>
                <TableHead className="text-right">% Realisasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataTable.map((item) => {
                const persen =
                  item.pagu === 0
                    ? 0
                    : (item.realisasi / item.pagu) * 100;
                return (
                  <TableRow key={item.no}>
                    <TableCell className="text-center">{item.no}</TableCell>
                    <TableCell>{item.uraian}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.pagu.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {item.realisasi.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {persen.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="bg-slate-100 font-bold">
                <TableCell colSpan={2} className="text-center">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {totalPagu.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  {totalRealisasi.toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-right">{persentaseTotal}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
