interface SummaryProps {
  pagu_definitip;
  pagu_efektif;
  realisasi_anggaran: number;
  realisasi_fisik: number;
}

const SummaryCards: React.FC<SummaryProps> = ({
  pagu_definitip,
  pagu_efektif,
  realisasi_anggaran,
  realisasi_fisik,
}) => {
  const cardData = [
    {
      title: "Pagu Definitip",
      value: pagu_definitip,
      color: "text-yellow-500",
    },
    { title: "Pagu Efektif", value: pagu_efektif, color: "text-yellow-500" },
    { title: "Realisasi Anggaran", value: realisasi_anggaran, color: "text-blue-500" },
    { title: "Realisasi Fisik", value: realisasi_fisik, color: "text-green-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {cardData.map((item, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow p-4 flex flex-col justify-center items-start hover:shadow-lg transition-shadow"
        >
          <h3 className="text-gray-500 text-sm font-medium">{item.title}</h3>
          <p className={`mt-1 text-2xl font-bold text-blue-600`}>
            {item.value.toLocaleString("id-ID")}{" "}
            {/* tetap pakai "id-ID" di server & client */}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
