import React, { useState, useEffect } from 'react';
import {
  X,
  Scissors,
  Plus,
  Minus,
  Trash2,
  Layers,
  Save,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import {
  SuratJalanPotong,
  KainItem,
  SizeBreakdownRow,
  AksesorisItem,
  VendorItem,
  ModelMaster,
  StatusSuratJalan,
} from '../types/ninos';

interface SuratJalanPotongModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sjp: SuratJalanPotong, autoCreateSPK?: boolean) => void;
  editingSJP: SuratJalanPotong | null;
  vendors: VendorItem[];
  models: ModelMaster[];
  existingSJPCount: number;
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const SuratJalanPotongModal: React.FC<SuratJalanPotongModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSJP,
  vendors,
  models,
  existingSJPCount,
}) => {
  const [nomorSurat, setNomorSurat] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [targetSelesai, setTargetSelesai] = useState('');
  const [pemotong, setPemotong] = useState('');
  const [namaModel, setNamaModel] = useState('');
  const [kodeArtikel, setKodeArtikel] = useState('');
  const [kategori, setKategori] = useState('Gamis Syar’i');
  const [status, setStatus] = useState<StatusSuratJalan>('Proses Potong');
  const [penanggungJawabGudang, setPenanggungJawabGudang] = useState('Hendra Gunawan');
  const [checkerQc, setCheckerQc] = useState('Rina Marlina');
  const [instruksiPotong, setInstruksiPotong] = useState('');

  // Dynamic Lists
  const [daftarKain, setDaftarKain] = useState<KainItem[]>([]);
  const [breakdownSize, setBreakdownSize] = useState<SizeBreakdownRow[]>([]);
  const [daftarAksesoris, setDaftarAksesoris] = useState<AksesorisItem[]>([]);

  useEffect(() => {
    if (editingSJP) {
      setNomorSurat(editingSJP.nomorSurat);
      setTanggal(editingSJP.tanggal);
      setTargetSelesai(editingSJP.targetSelesai);
      setPemotong(editingSJP.pemotong);
      setNamaModel(editingSJP.namaModel);
      setKodeArtikel(editingSJP.kodeArtikel);
      setKategori(editingSJP.kategori);
      setStatus(editingSJP.status);
      setPenanggungJawabGudang(editingSJP.penanggungJawabGudang);
      setCheckerQc(editingSJP.checkerQc);
      setInstruksiPotong(editingSJP.instruksiPotong || '');
      setDaftarKain(JSON.parse(JSON.stringify(editingSJP.daftarKain)));
      setBreakdownSize(JSON.parse(JSON.stringify(editingSJP.breakdownSize)));
      setDaftarAksesoris(JSON.parse(JSON.stringify(editingSJP.daftarAksesoris || [])));
    } else {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const numStr = String(existingSJPCount + 1).padStart(3, '0');
      setNomorSurat(`SJP-ND/${yyyy}/${mm}/${numStr}`);

      const todayStr = now.toISOString().slice(0, 10);
      setTanggal(todayStr);

      const targetD = new Date();
      targetD.setDate(targetD.getDate() + 2);
      setTargetSelesai(targetD.toISOString().slice(0, 10));

      const defaultCutter = vendors.find((v) => v.tipe === 'Potong')?.nama || 'Meja Potong Master (Mas Anto)';
      setPemotong(defaultCutter);

      setDaftarKain([
        {
          id: 'kain-' + Date.now(),
          namaKain: 'Toyobo Fodu Grade A',
          warna: 'Dusty Rose',
          jumlahRoll: 2,
          totalPanjang: 200,
          satuan: 'Meter',
          estimasiPemakaianPerPcs: 2.3,
          estimasiHasilPcs: 86,
          realisasiHasilPcs: 86,
          sisaBahan: 2.2,
          afvalReject: 0.8,
        },
      ]);

      setBreakdownSize([
        {
          id: 'sz-' + Date.now(),
          warna: 'Dusty Rose',
          sizes: { S: 16, M: 30, L: 25, XL: 15 },
          subtotal: 86,
        },
      ]);

      setDaftarAksesoris([
        { id: 'ak-1', nama: 'Resleting Jepang 50cm Senada', jumlah: 90, satuan: 'Pcs' },
        { id: 'ak-2', nama: 'Woven Label Leher Ninos Design', jumlah: 90, satuan: 'Pcs' },
        { id: 'ak-3', nama: 'Hangtag Karton Ninos + Pin', jumlah: 90, satuan: 'Set' },
      ]);

      setInstruksiPotong(
        'Potong rapi sesuai arah serat kain. Berikan penomoran ikatan bundle per 10 pcs.'
      );
    }
  }, [editingSJP, isOpen, existingSJPCount, vendors]);

  if (!isOpen) return null;

  // Handle Model Selection
  const handleModelSelect = (selectedModelName: string) => {
    setNamaModel(selectedModelName);
    const m = models.find((item) => item.nama === selectedModelName);
    if (m) {
      setKodeArtikel(m.kode);
      setKategori(m.kategori);
      if (m.estimasiKonsumsiKain && daftarKain.length > 0) {
        const updated = daftarKain.map((k) => ({
          ...k,
          estimasiPemakaianPerPcs: m.estimasiKonsumsiKain,
          estimasiHasilPcs: Math.floor(k.totalPanjang / m.estimasiKonsumsiKain),
        }));
        setDaftarKain(updated);
      }
    }
  };

  // Add fabric row
  const handleAddFabric = () => {
    const newKain: KainItem = {
      id: 'kain-' + Date.now() + Math.random(),
      namaKain: daftarKain[0]?.namaKain || 'Bahan Kain',
      warna: 'Warna ' + (daftarKain.length + 1),
      jumlahRoll: 1,
      totalPanjang: 100,
      satuan: 'Meter',
      estimasiPemakaianPerPcs: 2.3,
      estimasiHasilPcs: 43,
      realisasiHasilPcs: 43,
      sisaBahan: 1.0,
      afvalReject: 0.5,
    };
    setDaftarKain([...daftarKain, newKain]);

    const newSz: SizeBreakdownRow = {
      id: 'sz-' + Date.now() + Math.random(),
      warna: newKain.warna,
      sizes: { S: 8, M: 15, L: 12, XL: 8 },
      subtotal: 43,
    };
    setBreakdownSize([...breakdownSize, newSz]);
  };

  const handleRemoveFabric = (id: string, warna: string) => {
    if (daftarKain.length <= 1) return;
    setDaftarKain(daftarKain.filter((k) => k.id !== id));
    setBreakdownSize(breakdownSize.filter((b) => b.warna !== warna));
  };

  const handleUpdateFabric = (index: number, field: keyof KainItem, value: any) => {
    const updated = [...daftarKain];
    const item = { ...updated[index], [field]: value };

    if (field === 'totalPanjang' || field === 'estimasiPemakaianPerPcs') {
      const len = field === 'totalPanjang' ? Number(value) : item.totalPanjang;
      const cons = field === 'estimasiPemakaianPerPcs' ? Number(value) : item.estimasiPemakaianPerPcs;
      if (cons > 0) {
        item.estimasiHasilPcs = Math.floor(len / cons);
        if (!item.realisasiHasilPcs || item.realisasiHasilPcs === updated[index].estimasiHasilPcs) {
          item.realisasiHasilPcs = item.estimasiHasilPcs;
        }
      }
    }

    if (field === 'warna') {
      const oldColor = updated[index].warna;
      const szIndex = breakdownSize.findIndex((b) => b.warna === oldColor);
      if (szIndex !== -1) {
        const updatedSz = [...breakdownSize];
        updatedSz[szIndex].warna = value;
        setBreakdownSize(updatedSz);
      }
    }

    updated[index] = item;
    setDaftarKain(updated);
  };

  // Update Size Breakdown (with direct input & stepper + / -)
  const handleUpdateSize = (rowIndex: number, sizeKey: string, val: number) => {
    const updated = [...breakdownSize];
    const row = { ...updated[rowIndex] };
    const sizes = { ...row.sizes, [sizeKey]: Math.max(0, val || 0) };

    const subtotal = Object.values(sizes).reduce((acc: number, curr: number | undefined) => acc + (Number(curr) || 0), 0);
    row.sizes = sizes;
    row.subtotal = subtotal;

    updated[rowIndex] = row;
    setBreakdownSize(updated);

    const kainIndex = daftarKain.findIndex((k) => k.warna === row.warna);
    if (kainIndex !== -1) {
      const kList = [...daftarKain];
      kList[kainIndex].realisasiHasilPcs = subtotal;
      setDaftarKain(kList);
    }
  };

  // Step quantity by delta (+1, -1, +5, -5)
  const handleStepSize = (rowIndex: number, sizeKey: string, delta: number) => {
    const current = Number(breakdownSize[rowIndex]?.sizes[sizeKey]) || 0;
    handleUpdateSize(rowIndex, sizeKey, current + delta);
  };

  // Aksesoris Handlers
  const handleAddAksesoris = () => {
    setDaftarAksesoris([...daftarAksesoris, { id: 'ak-' + Date.now(), nama: '', jumlah: 100, satuan: 'Pcs' }]);
  };

  const handleRemoveAksesoris = (id: string) => {
    setDaftarAksesoris(daftarAksesoris.filter((a) => a.id !== id));
  };

  const handleUpdateAksesoris = (index: number, field: keyof AksesorisItem, val: any) => {
    const updated = [...daftarAksesoris];
    updated[index] = { ...updated[index], [field]: val };
    setDaftarAksesoris(updated);
  };

  const grandTotalPcs = breakdownSize.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleSubmit = (autoSPK: boolean = false) => {
    if (!nomorSurat.trim()) {
      alert('Nomor Surat Jalan wajib diisi.');
      return;
    }
    if (!namaModel.trim()) {
      alert('Nama Model wajib diisi.');
      return;
    }

    const payload: SuratJalanPotong = {
      id: editingSJP?.id || 'SJP-' + Date.now(),
      nomorSurat: nomorSurat.trim(),
      tanggal,
      targetSelesai,
      pemotong,
      namaModel: namaModel.trim(),
      kodeArtikel: kodeArtikel.trim() || 'ND-ART',
      kategori,
      daftarKain,
      breakdownSize,
      totalPcs: grandTotalPcs,
      daftarAksesoris,
      instruksiPotong,
      status,
      spkIdTerhubung: editingSJP?.spkIdTerhubung,
      penanggungJawabGudang,
      checkerQc,
      catatanKhusus: editingSJP?.catatanKhusus,
      createdAt: editingSJP?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncedToSheet: false,
    };

    onSave(payload, autoSPK);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center sm:p-4">
      {/* Full screen on mobile, dialog on desktop */}
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-4xl sm:rounded-2xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 px-4 sm:px-6 py-3.5 border-b border-amber-900/30 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-serif-brand tracking-wide text-amber-300">
                {editingSJP ? 'Edit Surat Jalan Potong' : 'Form Surat Jalan Potong'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Nino's Design Cutting Management
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

        {/* Scrollable Form Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs pb-24 sm:pb-6">
          {/* Section 1: Identitas Dokumen */}
          <div className="space-y-3 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                1. Data Dokumen & Produk
              </span>
              <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {nomorSurat}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Surat Jalan:
                </label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggal Potong:
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Selesai Potong:
                </label>
                <input
                  type="date"
                  value={targetSelesai}
                  onChange={(e) => setTargetSelesai(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tukang / Meja Potong:
                </label>
                <input
                  type="text"
                  list="cutter-options"
                  value={pemotong}
                  onChange={(e) => setPemotong(e.target.value)}
                  placeholder="Nama pemotong..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
                <datalist id="cutter-options">
                  {vendors.map((v) => (
                    <option key={v.id} value={v.nama} />
                  ))}
                  <option value="Meja Potong Master (Mas Anto)" />
                  <option value="Pak Joko (Cutter Solo)" />
                  <option value="Workshop In-House Meja 1" />
                </datalist>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Model / Desain Nino's:
                </label>
                <input
                  type="text"
                  list="modal-options"
                  value={namaModel}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  placeholder="Ketik atau pilih model..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
                />
                <datalist id="modal-options">
                  {models.map((m) => (
                    <option key={m.id} value={m.nama} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode:
                  </label>
                  <input
                    type="text"
                    value={kodeArtikel}
                    onChange={(e) => setKodeArtikel(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Gamis Syar’i">Gamis Syar’i</option>
                    <option value="Abaya">Abaya</option>
                    <option value="Tunik">Tunik</option>
                    <option value="One Set">One Set</option>
                    <option value="Khimar / Hijab">Khimar / Hijab</option>
                    <option value="Kemeja Tunik">Kemeja Tunik</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Status Pill Bar */}
            <div>
              <span className="block font-semibold text-slate-700 mb-1.5">Status Pengerjaan:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['Draft', 'Proses Potong', 'Selesai Potong', 'Sudah Terbit SPK'] as StatusSuratJalan[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-2 rounded-lg font-semibold text-xs border text-center transition active:scale-95 ${
                      status === st
                        ? 'bg-slate-900 text-amber-300 border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Bahan Kain (Mobile Card View + Desktop Table) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>2. Rincian Kain yang Diserahkan</span>
              </span>
              <button
                type="button"
                onClick={handleAddFabric}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold active:scale-95 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Kain</span>
              </button>
            </div>

            {/* MOBILE VIEW FOR FABRIC (Stacked touch cards) */}
            <div className="sm:hidden space-y-3">
              {daftarKain.map((kain, idx) => (
                <div key={kain.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      Kain #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFabric(kain.id, kain.warna)}
                      disabled={daftarKain.length <= 1}
                      className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Nama Bahan:</label>
                      <input
                        type="text"
                        value={kain.namaKain}
                        onChange={(e) => handleUpdateFabric(idx, 'namaKain', e.target.value)}
                        placeholder="e.g. Toyobo Fodu"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Warna Kain:</label>
                      <input
                        type="text"
                        value={kain.warna}
                        onChange={(e) => handleUpdateFabric(idx, 'warna', e.target.value)}
                        placeholder="e.g. Dusty Rose"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Jml Roll:</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        value={kain.jumlahRoll}
                        onChange={(e) => handleUpdateFabric(idx, 'jumlahRoll', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Total Pjg:</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.5"
                        min="1"
                        value={kain.totalPanjang}
                        onChange={(e) => handleUpdateFabric(idx, 'totalPanjang', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-right font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Satuan:</label>
                      <select
                        value={kain.satuan}
                        onChange={(e) => handleUpdateFabric(idx, 'satuan', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="Meter">Meter</option>
                        <option value="Yard">Yard</option>
                        <option value="Kg">Kg</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Konsumsi/Pcs:</label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.05"
                        value={kain.estimasiPemakaianPerPcs}
                        onChange={(e) => handleUpdateFabric(idx, 'estimasiPemakaianPerPcs', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-right font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Est. Hasil:</label>
                      <div className="px-2 py-1.5 bg-slate-200/70 border border-slate-300 rounded-lg text-right font-bold text-slate-700">
                        {kain.estimasiHasilPcs} pcs
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-amber-900 font-bold block mb-0.5">Realisasi:</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={kain.realisasiHasilPcs}
                        onChange={(e) => handleUpdateFabric(idx, 'realisasiHasilPcs', Number(e.target.value))}
                        className="w-full px-2 py-1.5 bg-amber-50 border border-amber-400 rounded-lg text-right font-mono font-black text-amber-950"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Nama Kain</th>
                    <th className="py-2.5 px-3">Warna</th>
                    <th className="py-2.5 px-2 text-right">Roll</th>
                    <th className="py-2.5 px-2 text-right">Panjang</th>
                    <th className="py-2.5 px-2 text-center">Satuan</th>
                    <th className="py-2.5 px-2 text-right">Konsumsi/Pcs</th>
                    <th className="py-2.5 px-2 text-right">Est. Pcs</th>
                    <th className="py-2.5 px-2 text-right font-bold text-amber-950">Realisasi Potong</th>
                    <th className="py-2.5 px-1 text-center w-8">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {daftarKain.map((kain, idx) => (
                    <tr key={kain.id} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={kain.namaKain}
                          onChange={(e) => handleUpdateFabric(idx, 'namaKain', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={kain.warna}
                          onChange={(e) => handleUpdateFabric(idx, 'warna', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded font-medium"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          min="1"
                          value={kain.jumlahRoll}
                          onChange={(e) => handleUpdateFabric(idx, 'jumlahRoll', Number(e.target.value))}
                          className="w-14 px-1.5 py-1 border border-slate-200 rounded text-right tabular-nums"
                        />
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={kain.totalPanjang}
                          onChange={(e) => handleUpdateFabric(idx, 'totalPanjang', Number(e.target.value))}
                          className="w-20 px-1.5 py-1 border border-slate-200 rounded text-right tabular-nums font-semibold"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <select
                          value={kain.satuan}
                          onChange={(e) => handleUpdateFabric(idx, 'satuan', e.target.value)}
                          className="px-1 py-1 border border-slate-200 rounded text-center"
                        >
                          <option value="Meter">Meter</option>
                          <option value="Yard">Yard</option>
                          <option value="Kg">Kg</option>
                        </select>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          step="0.05"
                          min="0.1"
                          value={kain.estimasiPemakaianPerPcs}
                          onChange={(e) => handleUpdateFabric(idx, 'estimasiPemakaianPerPcs', Number(e.target.value))}
                          className="w-16 px-1.5 py-1 border border-slate-200 rounded text-right tabular-nums"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-medium text-slate-500 tabular-nums">
                        {kain.estimasiHasilPcs}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <input
                          type="number"
                          min="0"
                          value={kain.realisasiHasilPcs}
                          onChange={(e) => handleUpdateFabric(idx, 'realisasiHasilPcs', Number(e.target.value))}
                          className="w-16 px-1.5 py-1 border border-amber-400 bg-amber-50/50 rounded text-right font-black text-amber-950 tabular-nums"
                        />
                      </td>
                      <td className="py-2 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveFabric(kain.id, kain.warna)}
                          disabled={daftarKain.length <= 1}
                          className="p-1 text-red-500 hover:text-red-700 disabled:opacity-30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Size Breakdown (Touch Steppers for Mobile + Table for Desktop) */}
          <div className="space-y-3 bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-3.5 sm:p-4 rounded-xl border border-amber-200/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-900 text-[11px] block">
                  3. Matriks Hasil Potong per Ukuran
                </span>
                <span className="text-[10px] text-slate-500">
                  Gunakan tombol (+) dan (-) atau ketik langsung
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 mr-1.5">Total Potong:</span>
                <span className="text-sm sm:text-base font-black text-slate-950 bg-amber-300 px-2.5 py-1 rounded-lg border border-amber-400 tabular-nums shadow-xs">
                  {grandTotalPcs} Pcs
                </span>
              </div>
            </div>

            {/* MOBILE TOUCH-STEPPER CARDS */}
            <div className="sm:hidden space-y-3">
              {breakdownSize.map((row, rIdx) => (
                <div key={row.id} className="bg-white rounded-xl p-3 border border-amber-200/90 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>{row.warna}</span>
                    </span>
                    <span className="text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                      Subtotal: {row.subtotal} pcs
                    </span>
                  </div>

                  {/* Size buttons grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {DEFAULT_SIZES.map((sz) => {
                      const qty = Number(row.sizes[sz]) || 0;
                      return (
                        <div key={sz} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-slate-600 mb-1">
                            <span className="font-bold text-[11px]">Size {sz}</span>
                            <span className="font-mono text-xs font-bold text-slate-900">{qty}</span>
                          </div>

                          {/* Stepper controls */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleStepSize(rIdx, sz, -5)}
                              className="px-1.5 py-1 rounded bg-slate-200 text-slate-700 font-bold text-[10px] active:scale-90"
                              title="-5"
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
                              title="+5"
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

            {/* DESKTOP TABLE VIEW */}
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
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
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
                      <td className="py-2.5 px-3 text-right font-black text-amber-950 tabular-nums">
                        {row.subtotal} pcs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Aksesoris */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-700 text-[11px]">
                4. Aksesoris yang Disertakan
              </span>
              <button
                type="button"
                onClick={handleAddAksesoris}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                + Tambah
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {daftarAksesoris.map((ak, idx) => (
                <div key={ak.id} className="flex items-center gap-1.5 p-2 rounded-lg border border-slate-200 bg-white">
                  <input
                    type="text"
                    value={ak.nama}
                    onChange={(e) => handleUpdateAksesoris(idx, 'nama', e.target.value)}
                    placeholder="Nama aksesoris..."
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    value={ak.jumlah}
                    onChange={(e) => handleUpdateAksesoris(idx, 'jumlah', Number(e.target.value))}
                    className="w-16 px-1.5 py-1.5 border border-slate-200 rounded text-right text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={ak.satuan}
                    onChange={(e) => handleUpdateAksesoris(idx, 'satuan', e.target.value)}
                    className="w-14 px-1 py-1.5 border border-slate-200 rounded text-center text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAksesoris(ak.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Instruksi & Tanda Tangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instruksi Khusus Potong:
              </label>
              <textarea
                rows={2}
                value={instruksiPotong}
                onChange={(e) => setInstruksiPotong(e.target.value)}
                placeholder="Arah serat kain, batas susut..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-[10px]">
                  PIC Gudang:
                </label>
                <input
                  type="text"
                  value={penanggungJawabGudang}
                  onChange={(e) => setPenanggungJawabGudang(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-[10px]">
                  Checker QC:
                </label>
                <input
                  type="text"
                  value={checkerQc}
                  onChange={(e) => setCheckerQc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Mobile & Desktop Footer Actions */}
        <div className="fixed sm:relative bottom-0 left-0 right-0 z-20 px-4 sm:px-6 py-3 border-t border-slate-200 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-2 safe-area-bottom shadow-lg sm:shadow-none">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs active:scale-95 transition"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan SJP</span>
            </button>

            {!editingSJP?.spkIdTerhubung && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-950/20 transition active:scale-95"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Simpan & Buat SPK</span>
                <span className="sm:hidden">+ SPK</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
