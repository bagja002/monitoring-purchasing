
import KegiatanPengadaanPage from "@/component/page/kegiatan-pengadaan";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Perencanaan",
  description: "Perencanaan Page",
};


export default function Dashboard(){
    return (
        <KegiatanPengadaanPage />
    )
}
