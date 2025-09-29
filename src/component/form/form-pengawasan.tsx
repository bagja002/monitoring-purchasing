import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";


export function FormPengawasan({ data, isEdit, onSubmit, onCancel }: any) {
  const { register, handleSubmit, watch, control } = useForm({
    defaultValues: data,
  });

  const BaseUrl = "http://103.177.176.202:6402";

  const handleSave = async (formData: any) => {
    try {
      console.log("Data form masuk:", formData);

      const res = await axios.put(
        `${BaseUrl}/updatePelaksanaanKegiatan?id_pelaksanaan_pengadaan=${data.id_pelaksanaan_pengadaan}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onSubmit(res.data);
    } catch (err: any) {
      console.error("Gagal update:", err.response?.data || err.message);
      alert("Update gagal, coba lagi!");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
      <div>
        <Label className="mb-2">Satuan Pendidikan</Label>
        <Input readOnly {...register("satdik")} />
      </div>

      <div>
        <Label className="mb-2">Nama Pekerjaan</Label>
        <Input readOnly {...register("nama_pekerjaan")} />
      </div>

      <div className="grid grid-cols-3 space-x-5">
        <div>
          <Label className="mb-2">Kategori Pengadaan</Label>
          <Input readOnly {...register("kategori_pengadaan")} />
        </div>
             <div>
          <Label className="mb-2">Metode Pemilihan</Label>
             <Input
            readOnly={!isEdit}
            {...register("metode_pemilihan")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
        
        

        <div>
          <Label className="mb-2">Lokasi Kerja</Label>
          <Input
            readOnly={!isEdit}
            {...register("lokasi_pekerjaan")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>

        <div>
          <Label className="mb-2">Link CCTV</Label>
          <Input
            readOnly={!isEdit}
            {...register("link_cctv")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 space-x-5">
        <div>
          <Label className="mb-2">Nama Penyedia</Label>
          <Input
            readOnly={!isEdit}
            {...register("nama_penyedia")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
        <div>
          <Label className="mb-2">Npwp Penyedia</Label>
          <Input
            readOnly={!isEdit}
            {...register("npwp")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
        <div>
          <Label className="mb-2">Alamat Penyeedia</Label>
          <Textarea
            readOnly={!isEdit}
            {...register("alamat_penyedia")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 space-x-5">
         <div>
          <Label className="mb-2">No Tanggal Kontrak SPK</Label>
          <Input
            readOnly={!isEdit}
            {...register("no_tanggal_kontrak_spk")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
         <div>
          <Label className="mb-2">Tanggal Kontrak Berakhir</Label>
          <Input
            readOnly={!isEdit}
            {...register("tanggal_kontrak_berakhir")}
            className={!isEdit ? "bg-gray-50" : ""}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {/* Anggaran */}
        <div>
          <Label className="mb-2">Anggaran</Label>
          <Controller
            name="anggaran"
            control={control}  // ✅ wajib
            render={({ field }) => (
              <Input
                {...field}
                value={
                  field.value
                    ? `Rp ${Number(field.value).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(raw ? Number(raw) : 0);
                }}
              />
            )}
          />
        </div>

        {/* HPS */}
        <div>
          <Label className="mb-2">HPS</Label>
          <Controller
            name="hps"
            control={control}  // ✅ wajib
            render={({ field }) => (
              <Input
                {...field}
                value={
                  field.value
                    ? `Rp ${Number(field.value).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(raw ? Number(raw) : 0);
                }}
              />
            )}
          />
        </div>

        {/* Nilai Kontrak */}
        <div>
          <Label className="mb-2">Nilai Kontrak</Label>
          <Controller
            name="nilai_kontrak"
            control={control}  // ✅ wajib
            render={({ field }) => (
              <Input
                {...field}
                readOnly={!isEdit}
                value={
                  field.value
                    ? `Rp ${Number(field.value).toLocaleString("id-ID")}`
                    : ""
                }
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(raw ? Number(raw) : 0);
                }}
                className={!isEdit ? "bg-gray-50" : ""}
              />
            )}
          />
        </div>

        {/* Sisa Pagu (otomatis) */}
        <div>
          <Label className="mb-2">Sisa Pagu</Label>
          <Controller
            name="sisa_pagu"
            control={control}  // ✅ wajib
            render={({ field }) => {
              const anggaran = Number(watch("anggaran") || 0);
              const nilaiKontrak = Number(watch("nilai_kontrak") || 0);
              const sisaPagu = anggaran - nilaiKontrak;

              return (
                <Input
                  {...field}
                  readOnly
                  value={`Rp ${sisaPagu.toLocaleString("id-ID")}`}
                />
              );
            }}
          />
        </div>
      </div>

      {isEdit && (
        <div className="pt-4 flex space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Batal
          </button>
        </div>
      )}
    </form>
  );
}
