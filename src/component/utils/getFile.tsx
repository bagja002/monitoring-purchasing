// utils/fileCell.tsx
import React from "react";

export const fileCell = (val?: string) => {
  return val ? (
    <a
      href={val}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      Lihat
    </a>
  ) : (
    <div className="bg-red-100 text-red-600 font-semibold px-2 py-1 rounded text-center">
      Kosong
    </div>
  );
};
