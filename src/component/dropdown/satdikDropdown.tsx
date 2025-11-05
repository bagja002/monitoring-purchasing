"use client";
import React, { useEffect, useState } from "react";

interface Satdik {
  ID: number;
  satuan_pendidikan: string;
}

interface SelectSatdikProps {
  selectTedOption: (selectedId: number) => void;
  idSatdik?: number;
}

// Pindahkan ke luar komponen
const STATIC_SATDIK: Satdik[] = [
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

const SelectSatdik: React.FC<SelectSatdikProps> = ({
  selectTedOption,
  idSatdik,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | "">("");
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const [satdikList, setSatdikList] = useState<Satdik[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setSatdikList(STATIC_SATDIK);
    setLoading(false);

    if (idSatdik !== undefined) {
      setSelectedOption(idSatdik);
      const selected = STATIC_SATDIK.find((item) => item.ID === idSatdik);
      if (selected) setIsOptionSelected(true);
    }
  }, [idSatdik]); // static data tidak perlu masuk dependency

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const satdikId = Number(e.target.value);
    const selectedSatdik = satdikList.find((s) => s.ID === satdikId);
    if (selectedSatdik) {
      selectTedOption(selectedSatdik.ID);
      setSelectedOption(selectedSatdik.ID);
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
            <option key={satdik.ID} value={satdik.ID}>
              {satdik.satuan_pendidikan}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectSatdik;
