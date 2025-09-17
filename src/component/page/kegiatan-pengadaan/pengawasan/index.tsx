"use client";

import SelectSatdik from "@/component/dropdown/satdikDropdown";
import Mainlayout from "@/component/layout";
import DataTable from "@/component/tabel/dataTable";
import { useState } from "react";

interface DataItem {
  name: string;       // Nama poltek / satdik
  pagu: number;      // Total pagu (misal: 3000000000)
  realisasi: number;  // Total realisasi (misal: 2500000000)
  kegiatan?: number;  // Optional: jumlah kegiatan
}

export default function KegiatanPengadaanPage() {
  const [IdSatdik, setSelectedSatdikId] = useState<number>  (0);
  const handleSatdikSelectSatdik = (id: string) => {
    // Save selected ID
    //
  };
  const handleSatdikSelect = (id: number) => {
    setSelectedSatdikId(id); // Save selected ID
    //
  };

  const apiDataArray: DataItem[] = [
  { name: "Poltek AUP", pagu: 3000000000, realisasi: 2500000000, kegiatan: 5 },
  { name: "Poltek Lain", pagu: 1500000000, realisasi: 1000000000, kegiatan: 3 },
  { name: "Poltek Tiga", pagu: 2000000000, realisasi: 1200000000, kegiatan: 2 },
  { name: "Poltek Empat", pagu: 500000000, realisasi: 400000000, kegiatan: 1 },
];


  return (
    <Mainlayout>
      <>
        <div className="text-black">
          <SelectSatdik
            selectTedOption={handleSatdikSelect}
            setNameSatdik={handleSatdikSelectSatdik}
          />
        </div>

        <>

        Pen
        
        </>
      </>
    </Mainlayout>
  );
}
