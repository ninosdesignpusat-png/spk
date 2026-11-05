import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Scissors,
  Save,
  Building2,
  DollarSign,
  Clock,
  Layers,
  AlertCircle,
} from 'lucide-react';
import {
  SPKProduksi,
  SuratJalanPotong,
  SizeBreakdownRow,
  VendorItem,
  ModelMaster,
  StatusSPK,
  SOPJahit,
} from '../types/ninos';
import { formatRupiah } from '../utils/printHelpers';

interface SPKProduksiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (spk: SPKProduksi) => void;
  editingSPK: SPKProduksi | null;
  initialFromSJP?: SuratJalanPotong | null;
  suratJalanList: SuratJalanPotong[];
  vendors: VendorItem[];
  models: ModelMaster[];
  existingSPKCount: number;
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const SPKProduksiModal: React.FC<SPKProduksiModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSPK,
  initialFromSJP,
  suratJalanList,
  vendors,
  models,
  existingSPKCount,
}) => {
  const [nomorSPK, setNomorSPK] = useState('');
  const [suratJalanPotongId, setSuratJalanPotongId] = useState('');
  const [nomorSuratJalanPotong, setNomorSuratJalanPotong] = useState('');
  const [tanggalTerbit, setTanggalTerbit] = useState('');
  const [targetSelesai, setTargetSelesai] = useState('');
  const [tipeProduksi, setTipeProduksi] = useState<'In-House' | 'CMT / Makloon'>('CMT / Makloon');
  const [vendorCMT, setVendorCMT] = useState('');
  const [picVendor, setPicVendor] = useState('');
  const [teleponVendor, setTeleponVendor] = useState('');
  const [namaModel, setNamaModel] = useState('');
  const [kodeArtikel, setKodeArtikel] = useState('');
  const [kategori, setKategori] = useState('Gamis Syar’i');
  const [ongkosJahitPerPcs, setOngkosJahitPerPcs] = useState(30000);
  const [status, setStatus] = useState<StatusSPK>('Draft');
  const [catatanProduksi, setCatatanProduksi] = useState('');
  const [productionManager, setProductionManager] = useState('Fauzan Ninos (PPIC)');
  const [supervisorCMT, setSupervisorCMT] = useState('Mas Sugeng');
  const [qcInspector, setQcInspector] = useState('Rina Marlina (QC Lead)');

  // SOP Jahit
  const [sopJahit, setSopJahit] = useState<SOPJahit>({
    jarakJahitanSPI: '11 - 12 SPI',
    tipeJahitan: 'Obras 4 benang senada rapat, kelim rol bawah 0.4cm, stik balik kerung lengan',
    posisiLabel: 'Woven Label Ninos tepat di tengah leher belakang, Care Label di samping kiri 15cm dari bawah',
    posisiAksesoris: 'Resleting jepang YKK 50cm tersembunyi rapi, kancing bungkus 3 pcs pada manset',
    standarFinishing: 'Buang sisa tiras benang bersih 100%, steam uap temperatur sedang, lipat polybag 30x40cm + silica gel',
    toleransiUkuran: 'Maksimal ± 1.0 cm',
  });

  // Size breakdown
  const [breakdownSize, setBreakdownSize] = useState<SizeBreakdownRow[]>([]);

  useEffect(() => {
    if (editingSPK) {
      setNomorSPK(editingSPK.nomorSPK);
      setSuratJalanPotongId(editingSPK.suratJalanPotongId || '');
      setNomorSuratJalanPotong(editingSPK.nomorSuratJalanPotong || '');
      setTanggalTerbit(editingSPK.tanggalTerbit);
      setTargetSelesai(editingSPK.targetSelesai);
      setTipeProduksi(editingSPK.tipeProduksi);
      setVendorCMT(editingSPK.vendorCMT);
      setPicVendor(editingSPK.picVendor || '');
      setTeleponVendor(editingSPK.teleponVendor || '');
      setNamaModel(editingSPK.namaModel);
      setKodeArtikel(editingSPK.kodeArtikel);
      setKategori(editingSPK.kategori);
      setOngkosJahitPerPcs(editingSPK.ongkosJahitPerPcs);
      setStatus(editingSPK.status);
      setCatatanProduksi(editingSPK.catatanProduksi || '');
      setProductionManager(editingSPK.productionManager);
      setSupervisorCMT(editingSPK.supervisorCMT);
      setQcInspector(editingSPK.qcInspector);
      setSopJahit(editingSPK.sopJahit || sopJahit);
      setBreakdownSize(JSON.parse(JSON.stringify(editingSPK.breakdownSize || [])));
    } else if (initialFromSJP) {
      // Pre-fill from SJP
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const numStr = String(existingSPKCount + 1).padStart(3, '0');
      setNomorSPK(`SPK-ND/${yyyy}/${mm}/${numStr}`);
      setTanggalTerbit(now.toISOString().slice(0, 10));

      const targetD = new Date();
      targetD.setDate(targetD.getDate() + 7);
      setTargetSelesai(targetD.toISOString().slice(0, 10));

      setSuratJalanPotongId(initialFromSJP.id);
      setNomorSuratJalanPotong(initialFromSJP.nomorSurat);
      setNamaModel(initialFromSJP.namaModel);
      setKodeArtikel(initialFromSJP.kodeArtikel);
      setKategori(initialFromSJP.kategori);
      setBreakdownSize(JSON.parse(JSON.stringify(initialFromSJP.breakdownSize)));
      setStatus('Bahan Diterima');

      const defaultVendor = vendors.find((v) => v.tipe === 'CMT');
      if (defaultVendor) {
        setVendorCMT(defaultVendor.nama);
        setPicVendor(defaultVendor.kontak);
        setTeleponVendor(defaultVendor.telepon);
      }
    } else {
      // Clean new SPK
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const numStr = String(existingSPKCount + 1).padStart(3, '0');
      setNomorSPK(`SPK-ND/${yyyy}/${mm}/${numStr}`);
      setTanggalTerbit(now.toISOString().slice(0, 10));

      const targetD = new Date();
      targetD.setDate(targetD.getDate() + 7);
      setTargetSelesai(targetD.toISOString().slice(0, 10));

      setSuratJalanPotongId('');
      setNomorSuratJalanPotong('');
      setNamaModel(models[0]?.nama || 'Gamis Ayana Silk Premium');
      setKodeArtikel(models[0]?.kode || 'ND-AYN-01');
      setKategori(models[0]?.kategori || 'Gamis Syar’i');

      const defaultVendor = vendors.find((v) => v.tipe === 'CMT');
      if (defaultVendor) {
        setVendorCMT(defaultVendor.nama);
        setPicVendor(defaultVendor.kontak);
        setTeleponVendor(defaultVendor.telepon);
      } else {
        setVendorCMT('CMT Berkah Jaya Garment');
        setPicVendor('Mas Sugeng');
        setTeleponVendor('0812-3456-7890');
      }

      setBreakdownSize([
        {
          id: 'sz-' + Date.now(),
          warna: 'Dusty Rose',
          sizes: { S: 25, M: 45, L: 40, XL: 18 },
          subtotal: 128,
        },
      ]);
    }
  }, [editingSPK, initialFromSJP, isOpen, existingSPKCount, vendors, models]);

  if (!isOpen) return null;

  // Handle linking from SJP
  const handleSelectSJP = (sjpId: string) => {
    setSuratJalanPotongId(sjpId);
    const found = suratJalanList.find((s) => s.id === sjpId);
    if (found) {
      setNomorSuratJalanPotong(found.nomorSurat);
      setNamaModel(found.namaModel);
      setKodeArtikel(found.kodeArtikel);
      setKategori(found.kategori);
      setBreakdownSize(JSON.parse(JSON.stringify(found.breakdownSize)));
    } else {
      setNomorSuratJalanPotong('');
    }
  };

  // Handle vendor select
  const handleVendorSelect = (vendorName: string) => {
    setVendorCMT(vendorName);
    const v = vendors.find((item) => item.nama === vendorName);
    if (v) {
      setPicVendor(v.kontak);
      setTeleponVendor(v.telepon);
    }
  };

  // Update Size Breakdown
  const handleUpdateSize = (rowIndex: number, sizeKey: string, val: number) => {
    const updated = [...breakdownSize];
    const row = { ...updated[rowIndex] };
    const sizes = { ...row.sizes, [sizeKey]: Math.max(0, val || 0) };

    const subtotal = Object.values(sizes).reduce((acc: number, curr: number | undefined) => acc + (Number(curr) || 0), 0);
    row.sizes = sizes;
    row.subtotal = subtotal;

    updated[rowIndex] = row;
    setBreakdownSize(updated);
  };

  const handleAddColorRow = () => {
    const newRow: SizeBreakdownRow = {
      id: 'sz-' + Date.now(),
      warna: 'Warna Baru',
      sizes: { S: 10, M: 20, L: 20, XL: 10 },
      subtotal: 60,
    };
    setBreakdownSize([...breakdownSize, newRow]);
  };

  const grandTotalPcs = breakdownSize.reduce((acc, curr) => acc + curr.subtotal, 0);
  const totalLusin = Number((grandTotalPcs / 12).toFixed(2));
  const totalBiayaCMT = grandTotalPcs * Number(ongkosJahitPerPcs || 0);

  const handleSubmit = () => {
    if (!nomorSPK.trim()) {
      alert('Nomor SPK wajib diisi.');
      return;
    }
    if (!namaModel.trim()) {
      alert('Nama Model wajib diisi.');
      return;
    }
    if (!vendorCMT.trim()) {
      alert('Nama Vendor CMT / Penjahit wajib diisi.');
      return;
    }

    const payload: SPKProduksi = {
      id: editingSPK?.id || 'SPK-' + Date.now(),
      nomorSPK: nomorSPK.trim(),
      suratJalanPotongId: suratJalanPotongId || undefined,
      nomorSuratJalanPotong: nomorSuratJalanPotong || undefined,
      tanggalTerbit,
      targetSelesai,
      tipeProduksi,
      vendorCMT: vendorCMT.trim(),
      picVendor: picVendor.trim(),
      teleponVendor: teleponVendor.trim(),
      namaModel: namaModel.trim(),
      kodeArtikel: kodeArtikel.trim() || 'ND-ART',
      kategori,
      breakdownSize,
      totalPcs: grandTotalPcs,
      totalLusin,
      ongkosJahitPerPcs: Number(ongkosJahitPerPcs || 0),
      totalBiayaCMT,
      sopJahit,
      status,
      catatanProduksi,
      productionManager,
      supervisorCMT,
      qcInspector,
      createdAt: editingSPK?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedToSheet: false,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-brand tracking-wide">
                {editingSPK ? 'Edit SPK Produksi' : 'Terbitkan SPK Produksi Baru'}
              </h2>
              <p className="text-xs text-emerald-200/80">
                Surat Perintah Kerja Jahit CMT & Spesifikasi Teknis Ninos Design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Kaitan SJP & Identitas SPK */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                1. Kaitan Dokumen & Identitas SPK
              </h3>
              {suratJalanPotongId && (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                  <Scissors className="w-3 h-3" />
                  <span>Terhubung ke SJP: {nomorSuratJalanPotong}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ambil dari Surat Jalan Potong:
                </label>
                <select
                  value={suratJalanPotongId}
                  onChange={(e) => handleSelectSJP(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">-- Buat Mandiri (Tanpa SJP) --</option>
                  {suratJalanList.map((sjp) => (
                    <option key={sjp.id} value={sjp.id}>
                      {sjp.nomorSurat} - {sjp.namaModel} ({sjp.totalPcs} pcs)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor SPK Produksi:
                </label>
                <input
                  type="text"
                  value={nomorSPK}
                  onChange={(e) => setNomorSPK(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-emerald-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipe Produksi:
                </label>
                <select
                  value={tipeProduksi}
                  onChange={(e) => setTipeProduksi(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="CMT / Makloon">CMT / Makloon (Vendor Luar)</option>
                  <option value="In-House">In-House (Workshop Ninos)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Terbit SPK:
                </label>
                <input
                  type="date"
                  value={tanggalTerbit}
                  onChange={(e) => setTanggalTerbit(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-rose-900 mb-1">
                  Target Selesai (Deadline Produksi):
                </label>
                <input
                  type="date"
                  value={targetSelesai}
                  onChange={(e) => setTargetSelesai(e.target.value)}
                  className="w-full px-3 py-1.5 bg-rose-50/50 border border-rose-300 rounded-lg font-bold text-rose-950"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Pengerjaan:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusSPK)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="Draft">Draft</option>
                  <option value="Bahan Diterima">Bahan Diterima</option>
                  <option value="Sedang Jahit">Sedang Jahit</option>
                  <option value="QC & Finishing">QC & Finishing</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vendor CMT & Ongkos Jahit */}
          <div className="space-y-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-800" />
              <span>2. Penjahit / Vendor CMT & Ongkos Produksi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Vendor CMT / Penjahit:
                </label>
                <input
                  type="text"
                  list="vendor-cmt-list"
                  value={vendorCMT}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                  placeholder="Ketik atau pilih vendor..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                />
                <datalist id="vendor-cmt-list">
                  {vendors.map((v) => (
                    <option key={v.id} value={v.nama} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama PIC / Kontak Vendor:
                </label>
                <input
                  type="text"
                  value={picVendor}
                  onChange={(e) => setPicVendor(e.target.value)}
                  placeholder="e.g. Mas Sugeng"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp:
                </label>
                <input
                  type="text"
                  value={teleponVendor}
                  onChange={(e) => setTeleponVendor(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-emerald-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ongkos CMT per Pcs:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                    Rp
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={ongkosJahitPerPcs}
                    onChange={(e) => setOngkosJahitPerPcs(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-right font-bold text-slate-900 tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-500 mb-1">
                  Total Target Produksi:
                </label>
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-extrabold text-slate-800 tabular-nums">
                  {grandTotalPcs} Pcs ({totalLusin} Lusin)
                </div>
              </div>

              <div>
                <label className="block font-semibold text-emerald-900 mb-1">
                  Estimasi Total Biaya CMT:
                </label>
                <div className="px-3 py-1.5 bg-emerald-100/70 border border-emerald-200 rounded-lg font-black text-emerald-950 tabular-nums text-sm">
                  {formatRupiah(totalBiayaCMT)}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Model & Target Size Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  3. Target Rincian Ukuran & Warna (Size Breakdown)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Model: <b>{namaModel}</b> ({kodeArtikel} - {kategori})
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddColorRow}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700"
              >
                + Tambah Baris Warna
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Warna / Varian</th>
                    {DEFAULT_SIZES.map((sz) => (
                      <th key={sz} className="py-2 px-2 text-center w-20">
                        Size {sz}
                      </th>
                    ))}
                    <th className="py-2 px-3 text-right font-bold text-emerald-950">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {breakdownSize.map((row, rIdx) => (
                    <tr key={row.id}>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.warna}
                          onChange={(e) => {
                            const updated = [...breakdownSize];
                            updated[rIdx].warna = e.target.value;
                            setBreakdownSize(updated);
                          }}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-semibold text-slate-800"
                        />
                      </td>
                      {DEFAULT_SIZES.map((sz) => (
                        <td key={sz} className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.sizes[sz] || 0}
                            onChange={(e) => handleUpdateSize(rIdx, sz, Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center border border-slate-200 rounded font-mono font-medium focus:border-emerald-800 tabular-nums"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-3 text-right font-extrabold text-emerald-950 tabular-nums">
                        {row.subtotal} pcs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Standar Mutu & SOP Jahit Ninos */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              4. Spesifikasi Teknis & SOP Jahit Ninos Design
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jarak Jahitan (SPI - Stitches Per Inch):
                </label>
                <input
                  type="text"
                  value={sopJahit.jarakJahitanSPI}
                  onChange={(e) => setSopJahit({ ...sopJahit, jarakJahitanSPI: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipe Jahitan & Kelim:
                </label>
                <input
                  type="text"
                  value={sopJahit.tipeJahitan}
                  onChange={(e) => setSopJahit({ ...sopJahit, tipeJahitan: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Posisi Label Ninos (Woven & Care Label):
                </label>
                <input
                  type="text"
                  value={sopJahit.posisiLabel}
                  onChange={(e) => setSopJahit({ ...sopJahit, posisiLabel: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Posisi Resleting / Aksesoris:
                </label>
                <input
                  type="text"
                  value={sopJahit.posisiAksesoris}
                  onChange={(e) => setSopJahit({ ...sopJahit, posisiAksesoris: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Standar Finishing & Kemasan:
                </label>
                <input
                  type="text"
                  value={sopJahit.standarFinishing}
                  onChange={(e) => setSopJahit({ ...sopJahit, standarFinishing: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Toleransi Ukuran Pola:
                </label>
                <input
                  type="text"
                  value={sopJahit.toleransiUkuran}
                  onChange={(e) => setSopJahit({ ...sopJahit, toleransiUkuran: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Signatories & Catatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Produksi / Instruksi Tambahan:
              </label>
              <textarea
                rows={3}
                value={catatanProduksi}
                onChange={(e) => setCatatanProduksi(e.target.value)}
                placeholder="Instruksi khusus untuk penjahit..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Production Manager (PPIC):
                </label>
                <input
                  type="text"
                  value={productionManager}
                  onChange={(e) => setProductionManager(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  QC Inspector Ninos:
                </label>
                <input
                  type="text"
                  value={qcInspector}
                  onChange={(e) => setQcInspector(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-900 text-white hover:bg-emerald-800 font-bold text-xs shadow-xs transition active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan & Terbitkan SPK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
