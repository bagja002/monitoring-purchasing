"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Package, TrendingUp, Clock, CheckCircle } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// ====================== DATA ======================
const dataTable = [
  {
    no: 1,
    uraian: "Pengadaan Barang",
    jumlah: 10,
    belum: 5,
    proses: 2,
    selesaiTender: 1,
    pelaksanaan: 1,
    bast: 1,
  },
  {
    no: 2,
    uraian: "Renovasi Gedung dan Bangunan",
    jumlah: 15,
    belum: 2,
    proses: 8,
    selesaiTender: 2,
    pelaksanaan: 3,
    bast: 1,
  },
  {
    no: 3,
    uraian: "Pembangunan Gedung Baru",
    jumlah: 20,
    belum: 6,
    proses: 6,
    selesaiTender: 5,
    pelaksanaan: 3,
    bast: 0,
  },
];

const totalPaket = dataTable.reduce((acc, d) => acc + d.jumlah, 0);
const totalBelum = dataTable.reduce((acc, d) => acc + d.belum, 0);
const totalProses = dataTable.reduce((acc, d) => acc + d.proses, 0);
const totalSelesaiTender = dataTable.reduce(
  (acc, d) => acc + d.selesaiTender,
  0
);
const totalPelaksanaan = dataTable.reduce((acc, d) => acc + d.pelaksanaan, 0);
const totalBast = dataTable.reduce((acc, d) => acc + d.bast, 0);

// === Data Sebaran Paket Pekerjaan ===
const sebaranData = {
  labels: [
    "Pengadaan Barang",
    "Renovasi Gedung dan Bangunan",
    "Pembangunan Gedung Baru",
  ],
  datasets: [
    {
      data: dataTable.map((d) => d.jumlah),
      backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 8,
    },
  ],
};

// === Data Status Chart ===
const statusColors = ["#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#10b981"];
const statusLabels = [
  "Belum Tender",
  "Proses Tender",
  "Selesai Tender",
  "Pelaksanaan Kontrak",
  "Selesai (BAST)",
];

const makeStatusData = (item: (typeof dataTable)[0]) => ({
  labels: statusLabels,
  datasets: [
    {
      data: [
        item.belum,
        item.proses,
        item.selesaiTender,
        item.pelaksanaan,
        item.bast,
      ],
      backgroundColor: statusColors,
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 6,
    },
  ],
});

// Stats cards data
const statsCards = [
  {
    title: "Total Paket",
    value: totalPaket,
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Belum Tender",
    value: totalProses,
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    title: "Selesai Tender",
    value: totalPelaksanaan,
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Proses Tender",
    value: totalPelaksanaan,
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Pelaksaan Kontrak",
    value: totalPelaksanaan,
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Selesai (BAST)",
    value: totalBast,
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
];

export default function DashboardPaketPekerjaan() {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: { size: 11 },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13, weight: "bold" as const },
        bodyFont: { size: 12 },
      },
    },
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard Sebaran Paket Pekerjaan
          </h1>
          <p className="text-slate-600">
            Monitoring dan tracking status paket pekerjaan secara real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-bold text-slate-800 mt-2">
                        {stat.value}
                      </h3>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-full`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* GRID CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* === Sebaran Paket Pekerjaan === */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-lg">Sebaran Paket Pekerjaan</CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="relative h-64">
                <Doughnut data={sebaranData} options={chartOptions} />
                <div className="absolute inset-0 mb-20 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-800">
                      {totalPaket}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Total Paket
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* === Status Pengadaan Barang === */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-lg">Pengadaan Barang</CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="relative h-48">
                <Doughnut
                  data={makeStatusData(dataTable[0])}
                  options={statusChartOptions}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">
                      {dataTable[0].jumlah}
                    </div>
                    <div className="text-xs text-slate-500">Paket</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {statusLabels.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: statusColors[i] }}
                      ></span>
                      <span className="text-slate-600">{label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {
                        dataTable[0][
                          [
                            "belum",
                            "proses",
                            "selesaiTender",
                            "pelaksanaan",
                            "bast",
                          ][i] as keyof (typeof dataTable)[0]
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* === Status Renovasi Gedung === */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
              <CardTitle className="text-lg">Renovasi Gedung</CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="relative h-48">
                <Doughnut
                  data={makeStatusData(dataTable[1])}
                  options={statusChartOptions}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">
                      {dataTable[1].jumlah}
                    </div>
                    <div className="text-xs text-slate-500">Paket</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {statusLabels.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: statusColors[i] }}
                      ></span>
                      <span className="text-slate-600">{label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {
                        dataTable[1][
                          [
                            "belum",
                            "proses",
                            "selesaiTender",
                            "pelaksanaan",
                            "bast",
                          ][i] as keyof (typeof dataTable)[1]
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* === Status Pembangunan Gedung Baru === */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="text-lg">Pembangunan Gedung Baru</CardTitle>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="relative h-48">
                <Doughnut
                  data={makeStatusData(dataTable[2])}
                  options={statusChartOptions}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-800">
                      {dataTable[2].jumlah}
                    </div>
                    <div className="text-xs text-slate-500">Paket</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {statusLabels.map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: statusColors[i] }}
                      ></span>
                      <span className="text-slate-600">{label}</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {
                        dataTable[2][
                          [
                            "belum",
                            "proses",
                            "selesaiTender",
                            "pelaksanaan",
                            "bast",
                          ][i] as keyof (typeof dataTable)[2]
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-t-lg">
            <CardTitle className="text-lg">Tabel Sebaran Paket</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-slate-200">
                    <th className="text-center font-semibold py-3 px-4">No</th>
                    <th className="text-left font-semibold py-3 px-4">
                      Uraian
                    </th>
                    <th className="text-right font-semibold py-3 px-4">
                      Jumlah Paket
                    </th>
                    <th className="text-right font-semibold py-3 px-4">
                      Belum Tender
                    </th>
                    <th className="text-right font-semibold py-3 px-4">
                      Proses Tender
                    </th>
                    <th className="text-right font-semibold py-3 px-4">
                      Selesai Tender
                    </th>
                    <th className="text-right font-semibold py-3 px-4">
                      Pelaksanaan
                    </th>
                    <th className="text-right font-semibold py-3 px-4">
                      Selesai (BAST)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataTable.map((d) => (
                    <tr
                      key={d.no}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="text-center py-3 px-4">{d.no}</td>
                      <td className="font-medium py-3 px-4">{d.uraian}</td>
                      <td className="text-right font-bold text-blue-600 py-3 px-4">
                        {d.jumlah}
                      </td>
                      <td className="text-right py-3 px-4">{d.belum}</td>
                      <td className="text-right py-3 px-4">{d.proses}</td>
                      <td className="text-right py-3 px-4">
                        {d.selesaiTender}
                      </td>
                      <td className="text-right py-3 px-4">{d.pelaksanaan}</td>
                      <td className="text-right py-3 px-4">{d.bast}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-200 font-bold border-t-2 border-slate-300">
                    <td colSpan={2} className="text-center py-3 px-4">
                      Total
                    </td>
                    <td className="text-right text-blue-600 py-3 px-4">
                      {totalPaket}
                    </td>
                    <td className="text-right py-3 px-4">{totalBelum}</td>
                    <td className="text-right py-3 px-4">{totalProses}</td>
                    <td className="text-right py-3 px-4">
                      {totalSelesaiTender}
                    </td>
                    <td className="text-right py-3 px-4">{totalPelaksanaan}</td>
                    <td className="text-right py-3 px-4">{totalBast}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
