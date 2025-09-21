"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FormValues {
  satdik: string;
  nama_pekerjaan: string;
  anggaran: number;
  jadwal_pengadaan: string;
  kategori_pengadaan: string;
  sirup?: string;
  metode_pemilihan?: string;
  justifikasi_pemilihan?: string;
  kak?: string;
  rab?: string;
  hps_penetapan?: number;
  hps_nilai?: number;
  hasil_survei?: string;
  rancangan_kontrak?: string;
  hasil_pendampingan?: string;
  gambar_perencanaan?: FileList;
  spesifikasi_teknis?: string;
  rekomendasi_pupr?: string;
  pagu: number;
  realisasi: number;
}

export default function TambahKegiatanForm() {
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();

  const kategori = watch("kategori_pengadaan"); // supaya bisa kondisional

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Submitted", data);
    // TODO: POST ke backend
    router.push("/kegiatan-pengadaan"); // balik ke list
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Tambah Kegiatan Pengadaan</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <Input {...register("satdik", { required: true })} placeholder="Satuan Pendidikan" />
        <Input {...register("nama_pekerjaan", { required: true })} placeholder="Nama Pekerjaan" />
        <Input type="number" {...register("anggaran", { required: true })} placeholder="Anggaran" />
        <Input {...register("jadwal_pengadaan", { required: true })} placeholder="Jadwal Pengadaan" />
        
        <select {...register("kategori_pengadaan", { required: true })} className="w-full p-2 border rounded">
          <option value="">Pilih Kategori Pengadaan</option>
          <option value="Pengadaan Barang">Pengadaan Barang</option>
          <option value="Perbaikan Gedung dan Bangunan">Perbaikan Gedung dan Bangunan</option>
          <option value="Pembangunan Gedung Baru">Pembangunan Gedung Baru</option>
        </select>

        {kategori === "Pengadaan Barang" && (
          <>
            <Input {...register("sirup")} placeholder="SiRUP" />
            <Input {...register("metode_pemilihan")} placeholder="Metode Pemilihan" />
            <Textarea {...register("justifikasi_pemilihan")} placeholder="Justifikasi Pemilihan" />
            <Input {...register("kak")} placeholder="KAK" />
            <Input {...register("rab")} placeholder="RAB" />
            <Input type="number" {...register("hps_penetapan")} placeholder="HPS Penetapan" />
            <Input type="number" {...register("hps_nilai")} placeholder="HPS Nilai" />
            <Input {...register("hasil_survei")} placeholder="Hasil Survei" />
            <Input {...register("rancangan_kontrak")} placeholder="Rancangan Kontrak/SPK" />
            <Input {...register("hasil_pendampingan")} placeholder="Hasil Pendampingan" />
          </>
        )}

        <Input type="file" {...register("gambar_perencanaan")} />
        <Textarea {...register("spesifikasi_teknis")} placeholder="Spesifikasi Teknis (RKS)" />
        <Textarea {...register("rekomendasi_pupr")} placeholder="Rekomendasi PUPR" />
        <Input type="number" {...register("pagu", { required: true })} placeholder="Pagu" />
        <Input type="number" {...register("realisasi", { required: true })} placeholder="Realisasi" />

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Simpan
        </Button>
      </form>
    </div>
  );
}
