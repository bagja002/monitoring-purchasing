interface SummaryProps {
  pagu: number;
  realisasi: number;
  kegiatan: number;
}

const SummaryCards: React.FC<SummaryProps> = ({
  pagu,
  realisasi,
  kegiatan,
}) => {
  const cardData = [
    { title: "Pagu", value: pagu, color: "text-yellow-500" },
    { title: "Realisasi", value: realisasi, color: "text-blue-500" },
    { title: "Kegiatan", value: kegiatan, color: "text-green-500" },
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
