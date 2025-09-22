"use client";
import SummaryCards from "@/component/card";
import DynamicBarChart from "@/component/chart/grafikDashboard";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import Mainlayout from "@/component/layout";
import TabelDashboard from "@/component/tabel/TableDashboardPerencaan";
import { useState } from "react";

export default function DashboardPages() {
  const [IdSatdik, setSelectedSatdikId] = useState<number>(0);
  const handleSatdikSelectSatdik = (id: string) => {
    // Save selected ID
    //
  };
  const handleSatdikSelect = (id: number) => {
    setSelectedSatdikId(id); // Save selected ID
    //
  };

  // let userRole = "Admin"

  return (
    <Mainlayout>
      <>
        {/* {userRole === "Admin Pusat" && (
          <div className="max-w-xs">
            <SelectSatdik
              selectTedOption={handleSatdikSelect}
              setNameSatdik={() => {}}
            />
          </div>
        )} */}

        {/* {IdSatdik === 0 && <DynamicBarChart data={apiDataArray} />} */}

        {/* Grafik Grafik Realisasi */}
        <div className="flex flex-col justify-between mt-10">
          <SummaryCards
            pagu_definitip={30000000000000}
            pagu_efektif={30000000000000}
            realisasi_anggaran={30000000000000}
            realisasi_fisik={1 }
          />
        </div>


        <TabelDashboard />
      </>
    </Mainlayout>
  );
}
