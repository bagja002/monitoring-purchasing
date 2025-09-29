export interface PerencanaanKegiatanReal {
  id_perencanaan_kegiatan: number;
  id_satdik: number;
  satdik: string;
  nama_pekerjaan: string;
  ManajemenResiko: string;
  ManajemenResikoFile1: string;
  ManajemenResikoFile2: string;
  anggaran: number;
  jadwal_pengadaan: string;
  kategori_pengadaan: string;
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
  sirup_p_konsultan_perencanaan: string;
  metode_pemilihan_p_konsultan_perencanaan: string;
  justifikasi_pemilihan_p_konsultan_perencanaan: string;
  kak_p_konsultan_perencanaan: string;
  rab_p_konsultan_perencanaan: string;
  hps_penetapan_p_konsultan_perencanaan: string;
  hps_nilai_p_konsultan_perencanaan: string;
  rancangan_kontrak_p_konsultan_perencanaan: string;
  hasil_pendampingan_p_konsultan_perencanaan: string;
  
  sirup_p_kontruksi: string;
  metode_pemilihan_p_kontruksi: string;
  justifikasi_pemilihan_p_kontruksi: string;
  kak_p_kontruksi: string;
  rab_p_kontruksi: string;
  gambar_perencanaan: string;
  spesifikasi_teknis: string;
  rekomendasi_pupr: string;
  hps_penetapan_p_kontruksi: string;
  hps_nilai_p_kontruksi: string;
  rancangan_kontrak_p_kontruksi: string;
  hasil_pendampingan_p_kontruksi: string;
  sirup_p_konsultan_pengawas: string;
  metode_pemilihan_p_konsultan_pengawas: string;
  justifikasi_pemilihan_p_konsultan_pengawas: string;
  kak_p_konsultan_pengawas: string
  rab_p_konsultan_pengawas: string;
  hps_uraian_p_konsultan_pengawas: string;
  hps_nilai_p_konsultan_pengawas: string;
  rancangan_kontrak_p_konsultan_pengawas: string;
  hasil_pendampingan_p_konsultan_pengawas: string;
  created_at: string;
  update_at: string;
}




  export interface LaporanMingguan {
   
id_laporan_pelaksanaan: number;
    id_pelaksanaan_pengadaan: number;
    id_realisasi_keuangan: number;
  minggu_ke: number;
  target_fisik: number;
  realisasi_fisik: number;
  deviasi_fisik: number;
  tingkat_capaian_keberhasilan: string;
  tindak_lanjut_rekomendasi_sebelumnya: string;
  permasalahan_yang_dihadapi: string;
  rekomendasi: string;

  }

  export interface Termin {
    id_realisasi_keuangan: number;
    id_pelaksanaan_pengadaan: number;
    termin_ke: string;
    target_keuangan: number;
    realisasi_keuangan: number;
    deviasi_keuangan: number;
    link_dokumen_keuangan: string;
    created_at: string;
    update_at: string;
  }

//jadi data di table itu adalah laporan mingguan yang di join ke pelaksaan dan perencaan kegauatan.  