"use client";
import React, { useEffect, useState } from "react";

// Define types for satdik data
interface Satdik {
  ID: number;
  satuan_pendidikan: string;
}

interface SelectSatdikProps {
  selectTedOption: (selectedId: number) => void;
  
  idSatdik?: number;
}

const SelectSatdik: React.FC<SelectSatdikProps> = ({ selectTedOption, idSatdik }) => {
  const [selectedOption, setSelectedOption] = useState<number | "">("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [satdikList, setSatdikList] = useState<Satdik[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Data Satdik Hardcode
  const staticSatdik: Satdik[] = [
    { ID: 0, satuan_pendidikan: "ALL" },
    { ID: 1, satuan_pendidikan: "Politeknik AUP" },
    { ID: 4, satuan_pendidikan: "Politeknik KP Bitung" },
    { ID: 7, satuan_pendidikan: "Politeknik KP Sidoarjo" },
    { ID: 3, satuan_pendidikan: "Politeknik KP Sorong" },
    { ID: 2, satuan_pendidikan: "Politeknik KP Karawang" },
    { ID: 10, satuan_pendidikan: "Politeknik KP Pangandaran" },
    { ID: 5, satuan_pendidikan: "Politeknik KP Dumai" },
    { ID: 9, satuan_pendidikan: "Politeknik KP Jembrana" },
    { ID: 8, satuan_pendidikan: "Politeknik KP Kupang" },
    { ID: 11, satuan_pendidikan: "AK KP Wakatobi" },
    { ID: 6, satuan_pendidikan: "Politeknik KP Bone" },
  ];

  useEffect(() => {
    // langsung pake data statis
    setSatdikList(staticSatdik);
    setLoading(false);

    // kalau ada idSatdik dikirim, langsung pilih
    if (idSatdik !== undefined) {
      setSelectedOption(idSatdik);
      const selected = staticSatdik.find((item) => item.ID === idSatdik);
      if (selected) {
       
        setIsOptionSelected(true);
      }
    }
  }, [idSatdik]);

  // Handle user change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const satdikId = e.target.value;

    if (satdikId === "0") {
   
      selectTedOption(0);
      setSelectedOption(0);
    } else {
      const selectedSatdik = satdikList.find((satdik) => satdik.ID.toString() === satdikId);
      if (selectedSatdik) {
       
        selectTedOption(selectedSatdik.ID);
        setSelectedOption(selectedSatdik.ID);
      }
    }

    setIsOptionSelected(true);
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-black dark:text-white">
        Select Satdik
      </label>

      <div className="relative z-20 bg-white dark:bg-form-input">
        <select
          value={selectedOption}
          onChange={handleSelectChange}
          className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${
            isOptionSelected ? "text-black dark:text-white" : ""
          }`}
        >
          <option value="" disabled className="text-body dark:text-bodydark">
            {loading ? "Loading..." : "Select Satdik"}
          </option>
          {satdikList.map((satdik) => (
            <option key={satdik.ID} value={satdik.ID} className="text-body dark:text-bodydark">
              {satdik.satuan_pendidikan}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectSatdik;
