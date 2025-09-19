"use client";
import SummaryCards from "@/component/card";
import DynamicBarChart from "@/component/chart/grafikDashboard";
import SelectSatdik from "@/component/dropdown/satdikDropdown";
import Mainlayout from "@/component/layout";
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

  let userRole = "Admin"

  const apiDataArray = [
    { name: "poltek aup", pagu: 20, realisasi: 40 },
    { name: "poltek lain", pagu: 50, realisasi: 35 },
    { name: "poltek tiga", pagu: 20, realisasi: 25 },
    { name: "poltek aup", pagu: 30, realisasi: 40 },
    { name: "poltek lain", pagu: 50, realisasi: 35 },
    { name: "poltek tiga", pagu: 20, realisasi: 25 },
    { name: "poltek aup", pagu: 30, realisasi: 40 },
    { name: "poltek lain", pagu: 50, realisasi: 35 },
    { name: "poltek tiga", pagu: 20, realisasi: 25 },
    { name: "poltek aup", pagu: 30, realisasi: 40 },
    { name: "poltek lain", pagu: 50, realisasi: 35 },
    { name: "poltek tiga", pagu: 20, realisasi: 25 },
  ];
  return (
    <Mainlayout>
      <>
        {userRole === "Admin Pusat" && (
          <div className="max-w-xs">
            <SelectSatdik
              selectTedOption={handleSatdikSelect}
              setNameSatdik={() => {}}
            />
          </div>
        )}

        {IdSatdik === 0 && <DynamicBarChart data={apiDataArray} />}

        {/* Grafik Grafik Realisasi */}
        <div className="flex flex-col justify-between mt-10">
          <SummaryCards
            pagu={30000000000000}
            realisasi={30000000000000}
            kegiatan={2}
          />
        </div>
      </>
    </Mainlayout>
  );
}
