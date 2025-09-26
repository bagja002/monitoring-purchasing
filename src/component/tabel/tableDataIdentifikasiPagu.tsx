import React from 'react';

const data = [
  {
    no: 1,
    satker: "Politeknik AUP",
    raa: "64.895.765.000",
    fisik: "73.253.973.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "138.149.738.000",
    persentase: { barang: "46,97", fisik: "53,03", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 2,
    satker: "Politeknik KP Sidoarjo",
    raa: "38.234.431.150",
    fisik: "28.186.400.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "1.220.000.000",
    pengelolaan: "-",
    jumlah: "67.640.831.150",
    persentase: { barang: "56,53", fisik: "41,67", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 3,
    satker: "Politeknik KP Bitung",
    raa: "48.718.767.000",
    fisik: "15.185.300.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "63.904.067.000",
    persentase: { barang: "76,24", fisik: "23,76", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 4,
    satker: "Politeknik KP Sorong",
    raa: "33.537.703.000",
    fisik: "11.511.287.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "45.048.990.000",
    persentase: { barang: "74,45", fisik: "25,55", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 5,
    satker: "Politeknik KP Karawang",
    raa: "41.766.145.000",
    fisik: "96.572.900.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "138.339.045.000",
    persentase: { barang: "30,19", fisik: "69,81", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 6,
    satker: "Politeknik KP Bone",
    raa: "20.195.538.000",
    fisik: "44.226.343.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "64.421.881.000",
    persentase: { barang: "31,35", fisik: "68,65", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 7,
    satker: "Politeknik KP Kupang",
    raa: "38.973.441.000",
    fisik: "26.565.383.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "65.538.824.000",
    persentase: { barang: "59,47", fisik: "40,53", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 8,
    satker: "Politeknik KP Dumai",
    raa: "11.318.548.327",
    fisik: "20.232.918.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "800.000.000",
    pengelolaan: "-",
    jumlah: "32.351.466.327",
    persentase: { barang: "34,99", fisik: "62,54", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 9,
    satker: "Politeknik KP Pangandaran",
    raa: "5.606.388.000",
    fisik: "27.600.986.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "33.207.374.000",
    persentase: { barang: "16,88", fisik: "83,12", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 10,
    satker: "Politeknik KP Jembrana",
    raa: "9.885.278.000",
    fisik: "9.638.708.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "19.523.986.000",
    persentase: { barang: "50,63", fisik: "49,37", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 11,
    satker: "AK KP Wakatobi",
    raa: "13.123.449.578",
    fisik: "3.814.931.000",
    perencanaan: "-",
    pengawasan: "-",
    jasa: "-",
    pengelolaan: "-",
    jumlah: "16.938.380.578",
    persentase: { barang: "77,48", fisik: "22,52", perencanaan: "0,00", pengawasan: "0,00", manajerial: "0,00" }
  },
  {
    no: 12,
    satker: "Pusat Pendidikan",
    raa: "-",
    fisik: "-",
    perencanaan: "15.752.815.034",
    pengawasan: "11.819.966.550",
    jasa: "-",
    pengelolaan: "37.362.635.361",
    jumlah: "64.935.416.945",
    persentase: { barang: "-", fisik: "-", perencanaan: "24,26", pengawasan: "18,20", manajerial: "57,54" }
  }
];

const totalData = {
  raa: "326.255.454.055",
  fisik: "356.789.129.000",
  perencanaan: "15.752.815.034",
  pengawasan: "11.819.966.550",
  jasa: "2.020.000.000",
  pengelolaan: "37.362.635.361",
  jumlah: "750.000.000.000",
  persentase: { barang: "43,50", fisik: "47,57", perencanaan: "4,42", pengawasan: "3,31", manajerial: "4,98" }
};

const formatNumber = (num) => {
  if (!num || num === "-") return "-";
  return new Intl.NumberFormat('id-ID').format(parseInt(num.replace(/\./g, '')));
};

export default function RekapitulasiTable() {
  return (
    <div className="w-full overflow-auto bg-white p-6">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
        Tabel Rekapitulasi per KRO sebagai angka panduan untuk tahapan Pelaksanaan barang dan jasa
      </h2>
      
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-700 text-sm" rowSpan={2}>No</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 text-sm" rowSpan={2}>Satker</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 text-sm" rowSpan={2}>RAA<br/>(ALSIN)</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 text-sm" colSpan={3}>RBI (Gedung & Bangunan)</th>
                <th className="border border-gray-300 px-2 py-3 text-center font-bold text-gray-700 text-sm" rowSpan={2}>Jasa</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 text-sm" rowSpan={2}>Pengelolaan<br/>Kegiatan &<br/>Manajerial</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 text-sm" rowSpan={2}>Jumlah</th>
                <th className="border border-gray-300 px-3 py-3 text-center font-bold text-gray-700 text-sm" colSpan={5}>Persentase</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Fisik</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Perencanaan</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Pengawasan</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Barang</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Fisik</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Perencanaan</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Pengawasan</th>
                <th className="border border-gray-300 px-2 py-2 text-center font-semibold text-gray-600 text-xs">Manajerial</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-2 py-2 text-center text-sm">{row.no}</td>
                  <td className="border border-gray-300 px-3 py-2 text-left font-medium text-sm">{row.satker}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right text-xs">{formatNumber(row.raa)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right text-xs">{formatNumber(row.fisik)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right text-xs">{formatNumber(row.perencanaan)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right text-xs">{formatNumber(row.pengawasan)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right text-xs">{formatNumber(row.jasa)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right text-xs">{formatNumber(row.pengelolaan)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-right font-semibold text-xs bg-blue-50">{formatNumber(row.jumlah)}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center text-xs">{row.persentase.barang}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center text-xs">{row.persentase.fisik}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center text-xs">{row.persentase.perencanaan}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center text-xs">{row.persentase.pengawasan}</td>
                  <td className="border border-gray-300 px-2 py-2 text-center text-xs">{row.persentase.manajerial}</td>
                </tr>
              ))}
              <tr className="bg-blue-100 font-bold">
                <td className="border border-gray-300 px-2 py-2 text-center text-sm">-</td>
                <td className="border border-gray-300 px-3 py-2 text-center text-sm">Jumlah</td>
                <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">{formatNumber(totalData.raa)}</td>
                <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">{formatNumber(totalData.fisik)}</td>
                <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">{formatNumber(totalData.perencanaan)}</td>
                <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">{formatNumber(totalData.pengawasan)}</td>
                <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">{formatNumber(totalData.jasa)}</td>
                <td className="border border-gray-300 px-2 py-2 text-right text-xs font-bold">{formatNumber(totalData.pengelolaan)}</td>
                <td className="border border-gray-300 px-2 py-2 text-right font-bold text-xs bg-blue-200">{formatNumber(totalData.jumlah)}</td>
                <td className="border border-gray-300 px-2 py-2 text-center text-xs font-bold">{totalData.persentase.barang}</td>
                <td className="border border-gray-300 px-2 py-2 text-center text-xs font-bold">{totalData.persentase.fisik}</td>
                <td className="border border-gray-300 px-2 py-2 text-center text-xs font-bold">{totalData.persentase.perencanaan}</td>
                <td className="border border-gray-300 px-2 py-2 text-center text-xs font-bold">{totalData.persentase.pengawasan}</td>
                <td className="border border-gray-300 px-2 py-2 text-center text-xs font-bold">{totalData.persentase.manajerial}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <p><strong>Keterangan:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>RAA (ALSIN) = Rencana Anggaran dan Aktivitas untuk Alat dan Mesin</li>
          <li>RBI = Rencana Biaya Investasi untuk Gedung & Bangunan</li>
          <li>Angka dalam rupiah, persentase menunjukkan proporsi dari total jumlah</li>
          <li>Tanda - menunjukkan tidak ada alokasi anggaran</li>
        </ul>
      </div>
    </div>
  );
}