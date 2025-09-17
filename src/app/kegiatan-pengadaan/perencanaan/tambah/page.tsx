"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Mainlayout from "@/component/layout";

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

  // ✅ tambahan buat toggle field
  showKak?: boolean;
  showRab?: boolean;
  showSpk?: boolean;
  showGambar?: boolean;
  showPupr?: boolean;
}

export default function TambahKegiatanForm() {
  const router = useRouter();
  const { register, handleSubmit, watch, control } = useForm<FormValues>();
  const kategori = watch("kategori_pengadaan");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log("Form Submitted", data);
    router.push("/kegiatan-pengadaan");
  };

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <Mainlayout>
      <div className="mx-auto p-6 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Tambah Rencana Pengadaan</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">Satuan Pendidikan</Label>
            <Input
              {...register("satdik", { required: true })}
              placeholder="Satuan Pendidikan"
            />
          </div>

          <div>
            <Label className="mb-2">Nama Pekerjaan</Label>
            <Input
              {...register("nama_pekerjaan", { required: true })}
              placeholder="Nama Pekerjaan"
            />
          </div>

          <div>
            <Label className="mb-2">Anggaran</Label>
            <Controller
              name="anggaran"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  type="text"
                  placeholder="Anggaran"
                  value={field.value ? formatRupiah(field.value) : ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    const parsed = raw ? parseInt(raw, 10) : 0;
                    field.onChange(parsed);
                  }}
                />
              )}
            />
          </div>

          <div>
            <Label className="mb-2">Jadwal Pengadaan</Label>
            <Input
              {...register("jadwal_pengadaan", { required: true })}
              placeholder="Jadwal Pengadaan"
            />
          </div>

          <div>
            <Label className="mb-2">Kategori Pengadaan</Label>
            <select
              {...register("kategori_pengadaan", { required: true })}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Kategori Pengadaan</option>
              <option value="Pengadaan Barang">Pengadaan Barang</option>
              <option value="Perbaikan Gedung dan Bangunan">
                Perbaikan Gedung dan Bangunan
              </option>
              <option value="Pembangunan Gedung Baru">
                Pembangunan Gedung Baru
              </option>
            </select>
          </div>

          {kategori === "Pengadaan Barang" && (
            <>
              <div>
                <Label className="mb-2">SiRUP</Label>
                <Input {...register("sirup")} placeholder="SiRUP" />
              </div>

              <div>
                <Label className="mb-2">Metode Pemilihan</Label>
                <select
                  {...register("metode_pemilihan", { required: true })}
                  className="w-full p-2 border rounded"
                >
                  Tender Cepat
                  <option value="">Pilih Kategori Pemilihan</option>
                  <option value="E-purchasing">E-purchasing</option>
                  <option value="Penunjukan Langsung,">
                    Penunjukan Langsung
                  </option>
                  <option value="Pengadaan Langsung">Pengadaan Langsung</option>
                  <option value="Tender Cepat">Tender Cepat</option>
                </select>
              </div>

              <div>
                <Label className="mb-2">Justifikasi Pemilihan</Label>
                <Textarea
                  {...register("justifikasi_pemilihan")}
                  placeholder="Justifikasi Pemilihan"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  {/* Checkbox KAK */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showKak")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>KAK</span>
                  </label>

                  {/* Field KAK muncul kalau dicentang */}
                  {watch("showKak") && (
                    <div className="mt-2">
                      <Label className="mb-2">KAK</Label>
                      <Input type="file" accept=".pdf" {...register("rab")} />
                    </div>
                  )}
                </div>

                <div>
                  {/* Checkbox RAB */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showRab")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>RAB</span>
                  </label>

                  {/* Field RAB muncul kalau dicentang */}
                  {watch("showRab") && (
                    <div className="mt-2">
                      <Label className="mb-2">Upload RAB (PDF)</Label>
                      <Input type="file" accept=".pdf" {...register("rab")} />
                    </div>
                  )}
                </div>

                <div>
                  {/* Checkbox Rancang Kontrak SPK */}
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register("showSpk")}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span>Rancangan Kontrak/SPK</span>
                  </label>

                  {/* Field RAB muncul kalau dicentang */}
                  {watch("showSpk") && (
                    <div className="mt-2">
                      <Label className="mb-2">
                        Upload Rancangan Kontrak/SPK (PDF)
                      </Label>
                      <Input
                        type="file"
                        accept=".pdf"
                        {...register("rancangan_kontrak")}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="mb-2">HPS Penetapan</Label>
                <Controller
                  name="hps_penetapan"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="HPS Penetapan"
                      value={field.value ? formatRupiah(field.value) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const parsed = raw ? parseInt(raw, 10) : 0;
                        field.onChange(parsed);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <Label className="mb-2">HPS Nilai</Label>
                <Controller
                  name="hps_nilai"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      placeholder="HPS Nilai"
                      value={field.value ? formatRupiah(field.value) : ""}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const parsed = raw ? parseInt(raw, 10) : 0;
                        field.onChange(parsed);
                      }}
                    />
                  )}
                />
              </div>

              <div>
                <Label className="mb-2">Hasil Survei</Label>
                <Textarea
                  {...register("hasil_survei")}
                  placeholder="Hasil Survei"
                />
              </div>

              <div>
                <Label className="mb-2">Hasil Pendampingan</Label>
                <Input
                  {...register("hasil_pendampingan")}
                  placeholder="Hasil Pendampingan"
                />
              </div>
            </>
          )}

          {kategori === "Perbaikan Gedung dan Bangunan" && (
            <>
              <Accordion type="single" collapsible className="w-full">
                {/* KAK */}
                <AccordionItem value="konsultan_perencana">
                  <AccordionTrigger>Konsultan Perencana</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label className="mb-2">SiRUP</Label>
                      <Input {...register("sirup")} placeholder="SiRUP" />
                    </div>

                    <div>
                      <Label className="mb-2">Metode Pemilihan</Label>
                      <select
                        {...register("metode_pemilihan", { required: true })}
                        className="w-full p-2 border rounded"
                      >
                        Tender Cepat
                        <option value="">Pilih Kategori Pemilihan</option>
                        <option value="E-purchasing">E-purchasing</option>
                        <option value="Penunjukan Langsung,">
                          Penunjukan Langsung
                        </option>
                        <option value="Pengadaan Langsung">
                          Pengadaan Langsung
                        </option>
                        <option value="Tender Cepat">Tender Cepat</option>
                      </select>
                    </div>

                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register("justifikasi_pemilihan")}
                        placeholder="Justifikasi Pemilihan"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        {/* Checkbox KAK */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showKak")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>KAK</span>
                        </label>

                        {/* Field KAK muncul kalau dicentang */}
                        {watch("showKak") && (
                          <div className="mt-2">
                            <Label className="mb-2">KAK</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rab")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Checkbox RAB */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showRab")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>RAB</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showRab") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload RAB (PDF)</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rab")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Checkbox Rancang Kontrak SPK */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showSpk")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rancangan Kontrak/SPK</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showSpk") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rancangan Kontrak/SPK (PDF)
                            </Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rancangan_kontrak")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">HPS Penetapan</Label>
                      <Controller
                        name="hps_penetapan"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Penetapan"
                            value={field.value ? formatRupiah(field.value) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const parsed = raw ? parseInt(raw, 10) : 0;
                              field.onChange(parsed);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">HPS Nilai</Label>
                      <Controller
                        name="hps_nilai"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Nilai"
                            value={field.value ? formatRupiah(field.value) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const parsed = raw ? parseInt(raw, 10) : 0;
                              field.onChange(parsed);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Hasil Pendampingan</Label>
                      <Input
                        {...register("hasil_pendampingan")}
                        placeholder="Hasil Pendampingan"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* RAB */}
                <AccordionItem value="kontruksi">
                  <AccordionTrigger>Konstruksi</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Label className="mb-2">SiRUP</Label>
                      <Input {...register("sirup")} placeholder="SiRUP" />
                    </div>

                    <div>
                      <Label className="mb-2">Metode Pemilihan</Label>
                      <select
                        {...register("metode_pemilihan", { required: true })}
                        className="w-full p-2 border rounded"
                      >
                        Tender Cepat
                        <option value="">Pilih Kategori Pemilihan</option>
                        <option value="E-purchasing">E-purchasing</option>
                        <option value="Penunjukan Langsung,">
                          Penunjukan Langsung
                        </option>
                        <option value="Pengadaan Langsung">
                          Pengadaan Langsung
                        </option>
                        <option value="Tender Cepat">Tender Cepat</option>
                      </select>
                    </div>

                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register("justifikasi_pemilihan")}
                        placeholder="Justifikasi Pemilihan"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        {/* Checkbox KAK */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showKak")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>KAK</span>
                        </label>

                        {/* Field KAK muncul kalau dicentang */}
                        {watch("showKak") && (
                          <div className="mt-2">
                            <Label className="mb-2">KAK</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rab")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Checkbox RAB */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showRab")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>RAB</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showRab") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload RAB (PDF)</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rab")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Checkbox Rancang Kontrak SPK */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showSpk")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rancangan Kontrak/SPK</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showSpk") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rancangan Kontrak/SPK (PDF)
                            </Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rancangan_kontrak")}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        {/* Upload Gambar*/}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showGambar")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Gambar Perencanaan</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showGambar") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Gambar Perencanaan
                            </Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("gambar_perencanaan")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Rekomendasi PUPR*/}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showPupr")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rekomedasi PUPR</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showPupr") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rekomeendasi PUPR
                            </Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rekomendasi_pupr")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                      <div>
                      <Label className="mb-2">HPS Penetapan</Label>
                      <Controller
                        name="hps_penetapan"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Penetapan"
                            value={field.value ? formatRupiah(field.value) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const parsed = raw ? parseInt(raw, 10) : 0;
                              field.onChange(parsed);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">HPS Nilai</Label>
                      <Controller
                        name="hps_nilai"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Nilai"
                            value={field.value ? formatRupiah(field.value) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const parsed = raw ? parseInt(raw, 10) : 0;
                              field.onChange(parsed);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Hasil Pendampingan</Label>
                      <Input
                        {...register("hasil_pendampingan")}
                        placeholder="Hasil Pendampingan"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* HPS */}
                <AccordionItem value="konsultan_pengawas">
                  <AccordionTrigger>Konsultan Pengawasa</AccordionTrigger>
                   <AccordionContent>
                    <div>
                      <Label className="mb-2">SiRUP</Label>
                      <Input {...register("sirup")} placeholder="SiRUP" />
                    </div>

                    <div>
                      <Label className="mb-2">Metode Pemilihan</Label>
                      <select
                        {...register("metode_pemilihan", { required: true })}
                        className="w-full p-2 border rounded"
                      >
                        Tender Cepat
                        <option value="">Pilih Kategori Pemilihan</option>
                        <option value="E-purchasing">E-purchasing</option>
                        <option value="Penunjukan Langsung,">
                          Penunjukan Langsung
                        </option>
                        <option value="Pengadaan Langsung">
                          Pengadaan Langsung
                        </option>
                        <option value="Tender Cepat">Tender Cepat</option>
                      </select>
                    </div>

                    <div>
                      <Label className="mb-2">Justifikasi Pemilihan</Label>
                      <Textarea
                        {...register("justifikasi_pemilihan")}
                        placeholder="Justifikasi Pemilihan"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        {/* Checkbox KAK */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showKak")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>KAK</span>
                        </label>

                        {/* Field KAK muncul kalau dicentang */}
                        {watch("showKak") && (
                          <div className="mt-2">
                            <Label className="mb-2">KAK</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rab")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Checkbox RAB */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showRab")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>RAB</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showRab") && (
                          <div className="mt-2">
                            <Label className="mb-2">Upload RAB (PDF)</Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rab")}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        {/* Checkbox Rancang Kontrak SPK */}
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            {...register("showSpk")}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span>Rancangan Kontrak/SPK</span>
                        </label>

                        {/* Field RAB muncul kalau dicentang */}
                        {watch("showSpk") && (
                          <div className="mt-2">
                            <Label className="mb-2">
                              Upload Rancangan Kontrak/SPK (PDF)
                            </Label>
                            <Input
                              type="file"
                              accept=".pdf"
                              {...register("rancangan_kontrak")}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2">HPS Penetapan</Label>
                      <Controller
                        name="hps_penetapan"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Penetapan"
                            value={field.value ? formatRupiah(field.value) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const parsed = raw ? parseInt(raw, 10) : 0;
                              field.onChange(parsed);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">HPS Nilai</Label>
                      <Controller
                        name="hps_nilai"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="text"
                            placeholder="HPS Nilai"
                            value={field.value ? formatRupiah(field.value) : ""}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              const parsed = raw ? parseInt(raw, 10) : 0;
                              field.onChange(parsed);
                            }}
                          />
                        )}
                      />
                    </div>

                    <div>
                      <Label className="mb-2">Hasil Pendampingan</Label>
                      <Input
                        {...register("hasil_pendampingan")}
                        placeholder="Hasil Pendampingan"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Simpan
          </Button>
        </form>
      </div>
    </Mainlayout>
  );
}
