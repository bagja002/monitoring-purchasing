export interface PelaksaanKegiatan {
  kategori_pengadaan: string;
  kategori_pengadaan_pk: string;
  id_pelaksanaan_pengadaan: number;
  id_perencanaan_kegiatan: number;
  satdik: string;
  nama_pekerjaan: string;
  metode_pengadaan: string; // Changed from metode_pemilihan
  lokasi_pekerjaan: string;
  link_cctv?: string; // Added optional field
  informasi_penyedia?: string; // Added optional field
  nama_penyedia?: string;
  alamat_penyedia?: string;
  npwp?: string;
  no_tanggal_kontrak: string; // Changed from no_tanggal_kontrak_spk
  no_tanggal_kontrak_berakhir: string; // Changed from tanggal_kontrak_berakhir
  lama_pekerjaan: string;
  status_pekerjaan?: string; // Added optional field
  anggaran: number;
  hps: number;
  nilai_kontrak: number;
  sisa_pagu: number;
}

//
