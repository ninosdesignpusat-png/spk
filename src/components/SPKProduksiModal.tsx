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
  Plus,
  Minus,
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
const QUICK_ONKGOS_PRESETS = [25000, 30000, 32000, 35000, 40000];

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
  const [ongkosJahitPerPcs, setOngkosJahitPerPcs] = useState(32000);
  const [status, setStatus] = useState<StatusSPK>('Draft');
  const [catatanProduksi, setCatatanProduksi] = useState('');
  const [productionManager, setProductionManager] = useState('Fauzan Ninos (PPIC)');
  const [supervisorCMT, setSupervisorCMT] = useState('Mas Sugeng');
  const [qcInspector, setQcInspector] = useState('Rina Marlina (QC Lead)');

  const [sopJahit, setSopJahit] = useState<SOPJahit>({
    jarakJahitanSPI: '11 - 12 SPI',
    tipeJahitan: 'Obras 4 benang senada rapat, kelim rol bawah 0.4cm, stik balik kerung lengan',
    posisiLabel: 'Woven Label Ninos di tengah leher belakang, Care Label di samping kiri 15cm dari bawah',
    posisiAksesoris: 'Resleting jepang YKK 50cm tersembunyi rapi, kancing bungkus 3 pcs pada manset',
    standarFinishing: 'Buang sisa tiras benang bersih 100%, steam uap temperatur sedang, lipat polybag 30x40cm + silica gel',
    toleransiUkuran: 'Maksimal ± 1.0 cm',
  });

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

  const handleVendorSelect = (vendorName: string) => {
    setVendorCMT(vendorName);
    const v = vendors.find((item) => item.nama === vendorName);
    if (v) {
      setPicVendor(v.kontak);
      setTeleponVendor(v.telepon);
    }
  };

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

  const handleStepSize = (rowIndex: number, sizeKey: string, delta: number) => {
    const current = Number(breakdownSize[rowIndex]?.sizes[sizeKey]) || 0;
    handleUpdateSize(rowIndex, sizeKey, current + delta);
  };

  const handleAddColorRow = () => {
    const newRow: SizeBreakdownRow = {
      id: 'sz-' + Date.now(),
      warna: 'Warna ' + (breakdownSize.length + 1),
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 py-3.5 border-b border-amber-900/30 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-serif-brand tracking-wide text-amber-300">
                {editingSPK ? 'Edit SPK Produksi' : 'Form SPK Produksi Jahit'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Nino's Design CMT Work Order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs pb-24 sm:pb-6">
          {/* Section 1: Dokumen SPK */}
          <div className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                1. Data Perintah Kerja & Dokumen
              </span>
              <span className="font-mono text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                {nomorSPK}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ambil dari Surat Jalan Potong:
                </label>
                <select
                  value={suratJalanPotongId}
                  onChange={(e) => handleSelectSJP(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
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
                  Nomor SPK:
                </label>
                <input
                  type="text"
                  value={nomorSPK}
                  onChange={(e) => setNomorSPK(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipe Produksi:
                </label>
                <select
                  value={tipeProduksi}
                  onChange={(e) => setTipeProduksi(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="CMT / Makloon">CMT / Makloon (Vendor Luar)</option>
                  <option value="In-House">In-House (Workshop Nino's)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Terbit:
                </label>
                <input
                  type="date"
                  value={tanggalTerbit}
                  onChange={(e) => setTanggalTerbit(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-900 mb-1">
                  Target Selesai (Deadline):
                </label>
                <input
                  type="date"
                  value={targetSelesai}
                  onChange={(e) => setTargetSelesai(e.target.value)}
                  className="w-full px-3 py-2 bg-rose-50 border border-rose-300 rounded-lg font-bold text-rose-950"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Vendor & Biaya */}
          <div className="space-y-3 bg-emerald-50/50 p-3.5 sm:p-4 rounded-xl border border-emerald-200">
            <span className="font-bold uppercase tracking-wider text-emerald-950 text-[11px] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>2. Penjahit / Vendor CMT & Ongkos</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Vendor / Penjahit:
                </label>
                <input
                  type="text"
                  list="vendor-options-spk"
                  value={vendorCMT}
                  onChange={(e) => handleVendorSelect(e.target.value)}
                  placeholder="Pilih atau ketik vendor..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
                />
                <datalist id="vendor-options-spk">
                  {vendors.map((v) => (
                    <option key={v.id} value={v.nama} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  PIC Vendor:
                </label>
                <input
                  type="text"
                  value={picVendor}
                  onChange={(e) => setPicVendor(e.target.value)}
                  placeholder="e.g. Mas Sugeng"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. WhatsApp:
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={teleponVendor}
                  onChange={(e) => setTeleponVendor(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Ongkos Quick Steppers / Chips */}
            <div className="pt-2 border-t border-emerald-200/80 space-y-2">
              <label className="block font-semibold text-slate-700">
                Ongkos CMT per Pcs:
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    step="500"
                    value={ongkosJahitPerPcs}
                    onChange={(e) => setOngkosJahitPerPcs(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-sm text-slate-900"
                  />
                </div>

                <div className="px-3 py-2 bg-white border border-emerald-300 rounded-lg text-right font-black text-emerald-950 text-sm">
                  Total: {formatRupiah(totalBiayaCMT)}
                </div>
              </div>

              {/* Quick preset chips for phone tapping */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-medium">Preset Cepat:</span>
                {QUICK_ONKGOS_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setOngkosJahitPerPcs(p)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition active:scale-95 ${
                      ongkosJahitPerPcs === p
                        ? 'bg-emerald-800 text-white border-emerald-900'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Rp {(p / 1000).toLocaleString('id-ID')}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Target Ukuran (Size Breakdown with Steppers) */}
          <div className="space-y-3 bg-amber-50/50 p-3.5 sm:p-4 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-900 text-[11px] block">
                  3. Target Ukuran & Jumlah Potongan
                </span>
                <span className="text-[10px] text-slate-500">
                  Model: <b>{namaModel}</b> ({kodeArtikel})
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 mr-1.5">Total Target:</span>
                <span className="text-sm sm:text-base font-black text-slate-950 bg-amber-300 px-2.5 py-1 rounded-lg border border-amber-400 tabular-nums">
                  {grandTotalPcs} Pcs ({totalLusin} Dz)
                </span>
              </div>
            </div>

            {/* MOBILE TOUCH-STEPPERS */}
            <div className="sm:hidden space-y-3">
              {breakdownSize.map((row, rIdx) => (
                <div key={row.id} className="bg-white rounded-xl p-3 border border-amber-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-bold text-slate-900 text-xs">
                      {row.warna}
                    </span>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                      {row.subtotal} pcs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_SIZES.map((sz) => {
                      const qty = Number(row.sizes[sz]) || 0;
                      return (
                        <div key={sz} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-slate-600 mb-1">
                            <span className="font-bold text-[11px]">Size {sz}</span>
                            <span className="font-mono text-xs font-bold text-slate-900">{qty}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStepSize(rIdx, sz, -5)}
                              className="px-1.5 py-1 rounded bg-slate-200 text-slate-700 font-bold text-[10px] active:scale-90"
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStepSize(rIdx, sz, -1)}
                              className="p-1 rounded bg-slate-200 text-slate-800 font-bold active:scale-90"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <input
                              type="number"
                              inputMode="numeric"
                              min="0"
                              value={qty}
                              onChange={(e) => handleUpdateSize(rIdx, sz, Number(e.target.value))}
                              className="w-12 text-center py-1 bg-white border border-slate-300 rounded font-mono font-bold text-xs"
                            />

                            <button
                              type="button"
                              onClick={() => handleStepSize(rIdx, sz, 1)}
                              className="p-1 rounded bg-amber-400 text-slate-950 font-bold active:scale-90"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStepSize(rIdx, sz, 5)}
                              className="px-1.5 py-1 rounded bg-amber-200 text-slate-900 font-bold text-[10px] active:scale-90"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Warna Kain</th>
                    {DEFAULT_SIZES.map((sz) => (
                      <th key={sz} className="py-2.5 px-2 text-center w-20">
                        Size {sz}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 text-right font-bold text-slate-900">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {breakdownSize.map((row, rIdx) => (
                    <tr key={row.id}>
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {row.warna}
                      </td>
                      {DEFAULT_SIZES.map((sz) => (
                        <td key={sz} className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.sizes[sz] || 0}
                            onChange={(e) => handleUpdateSize(rIdx, sz, Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center border border-slate-200 rounded font-mono font-medium focus:border-amber-600 tabular-nums"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-3 text-right font-black text-amber-950 tabular-nums">
                        {row.subtotal} pcs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleAddColorRow}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-slate-700 text-xs"
            >
              + Tambah Baris Warna
            </button>
          </div>

          {/* Section 4: SOP Jahit & Spesifikasi */}
          <div className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
            <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
              4. SOP & Standar Mutu Jahit Nino's Design
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Jarak Jahitan (SPI):
                </label>
                <input
                  type="text"
                  value={sopJahit.jarakJahitanSPI}
                  onChange={(e) => setSopJahit({ ...sopJahit, jarakJahitanSPI: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Tipe Jahitan:
                </label>
                <input
                  type="text"
                  value={sopJahit.tipeJahitan}
                  onChange={(e) => setSopJahit({ ...sopJahit, tipeJahitan: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Posisi Label:
                </label>
                <input
                  type="text"
                  value={sopJahit.posisiLabel}
                  onChange={(e) => setSopJahit({ ...sopJahit, posisiLabel: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">
                  Standar Finishing:
                </label>
                <input
                  type="text"
                  value={sopJahit.standarFinishing}
                  onChange={(e) => setSopJahit({ ...sopJahit, standarFinishing: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="fixed sm:relative bottom-0 left-0 right-0 z-20 px-4 sm:px-6 py-3 border-t border-slate-200 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-2 safe-area-bottom shadow-lg sm:shadow-none">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs active:scale-95 transition"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-950/30 transition active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan & Terbitkan SPK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
