
import KegiatanPelaksananPage from "@/component/page/kegiatan-pengadaan/pengawasan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelaksaan",
  description: "Pelaksaan Page",
};

export default function Pelaksaan() {
   return <KegiatanPelaksananPage />;
}
