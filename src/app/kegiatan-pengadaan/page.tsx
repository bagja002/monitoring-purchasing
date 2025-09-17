
import KegiatanPengadaanPage from "@/component/page/kegiatan-pengadaan";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Pengadaan",
  description: "Pengadaan Page",
};


export default function Dashboard(){
    return (
        <KegiatanPengadaanPage />
    )
}
