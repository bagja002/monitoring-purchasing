// components/DynamicBarChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DataItem {
  name: string;
  pagu: number;
  realisasi: number;
}

type ApiData = Record<string, { pagu: number; realisasi: number }> | DataItem[];

interface Props {
  data: ApiData;
}

const DynamicBarChart: React.FC<Props> = ({ data }) => {
  // Transform API object menjadi array jika perlu
  const chartArray: DataItem[] = Array.isArray(data)
    ? data
    : Object.entries(data).map(([key, value]) => ({
        name: key,
        pagu: value.pagu,
        realisasi: value.realisasi,
      }));

  const labels = chartArray.map(item => item.name);
  const paguData = chartArray.map(item => item.pagu);
  const realisasiData = chartArray.map(item => item.realisasi);

  const chartData = {
    labels,
    datasets: [
      { label: "Pagu", data: paguData, backgroundColor: "#F6CE5F" },
      { label: "Realisasi", data: realisasiData, backgroundColor: "#5FB3F6" },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // penting biar tinggi bisa dikontrol
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Pagu vs Realisasi" },
    },
    scales: {
      x: { ticks: { autoSkip: false } }, // supaya label panjang tetap tampil
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full overflow-x-auto" style={{ height: "300px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DynamicBarChart;
