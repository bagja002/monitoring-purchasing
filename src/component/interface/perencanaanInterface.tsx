export interface perencaanKegiatan {
  id_perencanaan_kegiatan: string
  id_satdik:string
  satdik: string;
  nama_pekerjaan: string;
  anggaran: number;
  jadwal_pengadaan: string;
  kategori_pengadaan: string;
  //Bagian Pengadaan Barang
  sirup_p_barang: string;
  metode_pemilihan_p_barang: string;
  justifikasi_pemilihan_p_barang: string;
  kak_p_barang: string;
  rab_p_barang: string;
  hps_penetapan_p_barang: string;
  hps_nilai_p_barang: number;
  hasil_survei_p_barang: string;
  rancangan_kontrak_p_barang: string;
  hasil_pendampingan_p_barang: string;

    //Konsultan Pengawas
  sirup_p_konsultan_perencanaan: string;
  metode_pemilihan_p_konsultan_perencanaan: string;
  justifikasi_pemilihan_p_konsultan_perencanaan: string;
  kak_p_konsultan_perencanaan: string;
  rab_p_konsultan_perencanaan: string;
  hps_penetapan_p_konsultan_perencanaan: string;
  hps_nilai_p_konsultan_perencanaan: number;
  rancangan_kontrak_p_konsultan_perencanaan: string;
  hasil_pendampingan_p_konsultan_perencanaan: string;

  //konstruksi 
  sirup_p_kontruksi: string;
  metode_pemilihan_p_kontruksi: string;
  justifikasi_pemilihan_p_kontruksi: string;
  kak_p_kontruksi: string;
  rab_p_kontruksi: string;
  gambar_perencanaan: string;
  spesifikasi_teknis: string;
  rekomendasi_pupr: string;
  hps_penetapan_p_kontruksi: string;
  hps_nilai_p_kontruksi: number;
  rancangan_kontrak_p_kontruksi: string;
  hasil_pendampingan_p_kontruksi: string;

  //konsultan Pengawasan 
 
  sirup_p_konsultan_pengawas: string;
  metode_pemilihan_p_konsultan_pengawas: string;
  justifikasi_pemilihan_p_konsultan_pengawas: string;
  kak_p_konsultan_pengawas: string;
  rab_p_konsultan_pengawas: string;
  
  hps_uraian_p_konsultan_pengawas: string;
  hps_nilai_p_konsultan_pengawas: number;
  rancangan_kontrak_p_konsultan_pengawas: string;
  hasil_pendampingan_p_konsultan_pengawas: string;

  created_at : string 
  update_at : string
}


   