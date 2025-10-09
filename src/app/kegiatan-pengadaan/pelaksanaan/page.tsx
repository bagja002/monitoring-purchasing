import Mainlayout from "@/component/layout";
import LoginForm from "@/component/page/auth/operator/login";
import DashboardPages from "@/component/page/dashboard";
import KegiatanPengadaanPage from "@/component/page/kegiatan-pengadaan";
import KegiatanPelaksananPage from "@/component/page/kegiatan-pengadaan/pengawasan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelaksaan",
  description: "Pelaksaan Page",
};

export default function Pelaksaan() {
  return <KegiatanPelaksananPage />;
}
