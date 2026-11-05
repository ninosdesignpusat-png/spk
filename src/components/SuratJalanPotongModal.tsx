import React, { useState, useEffect } from 'react';
import {
  X,
  Scissors,
  Plus,
  Trash2,
  Layers,
  Save,
  FileText,
  AlertCircle,
  HelpCircle,
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

  // Initialize form
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

      // Default sample fabric
      setDaftarKain([
        {
          id: 'kain-' + Date.now(),
          namaKain: 'Toyobo Fodu Silk Grade A',
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
        { id: 'ak-1', nama: 'Resleting Jepang 50cm Senada', jumlah: 90, satuan: 'Pcs', catatan: '86 pcs + cadangan' },
        { id: 'ak-2', nama: 'Woven Label Leher Ninos Design', jumlah: 90, satuan: 'Pcs' },
        { id: 'ak-3', nama: 'Hangtag Karton Ninos + Tali Pin', jumlah: 90, satuan: 'Set' },
        { id: 'ak-4', nama: 'Benang Jahit Astra Senada', jumlah: 4, satuan: 'Roll' },
      ]);

      setInstruksiPotong(
        'Potong rapi sesuai arah serat kain. Berikan penomoran ikatan bundle per 10 pcs agar tidak tertukar lot warna.'
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
      // Update fabric consumption if any
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
      warna: 'Warna Baru',
      jumlahRoll: 1,
      totalPanjang: 100,
      satuan: 'Meter',
      estimasiPemakaianPerPcs: 2.3,
      estimasiHasilPcs: 43,
      realisasiHasilPcs: 43,
      sisaBahan: 1.1,
      afvalReject: 0.5,
    };
    setDaftarKain([...daftarKain, newKain]);

    // Also add corresponding size breakdown row
    const newSz: SizeBreakdownRow = {
      id: 'sz-' + Date.now() + Math.random(),
      warna: newKain.warna,
      sizes: { S: 8, M: 15, L: 12, XL: 8 },
      subtotal: 43,
    };
    setBreakdownSize([...breakdownSize, newSz]);
  };

  // Remove fabric row
  const handleRemoveFabric = (id: string, warna: string) => {
    if (daftarKain.length <= 1) return;
    setDaftarKain(daftarKain.filter((k) => k.id !== id));
    setBreakdownSize(breakdownSize.filter((b) => b.warna !== warna));
  };

  // Update fabric row
  const handleUpdateFabric = (index: number, field: keyof KainItem, value: any) => {
    const updated = [...daftarKain];
    const item = { ...updated[index], [field]: value };

    // Auto-calculate estimated pcs if length or consumption changes
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

    // Sync color change to breakdown size row
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

    // Sync realisasiHasilPcs in fabric with same color
    const kainIndex = daftarKain.findIndex((k) => k.warna === row.warna);
    if (kainIndex !== -1) {
      const kList = [...daftarKain];
      kList[kainIndex].realisasiHasilPcs = subtotal;
      setDaftarKain(kList);
    }
  };

  // Aksesoris Handlers
  const handleAddAksesoris = () => {
    const newAk: AksesorisItem = {
      id: 'ak-' + Date.now(),
      nama: '',
      jumlah: 100,
      satuan: 'Pcs',
    };
    setDaftarAksesoris([...daftarAksesoris, newAk]);
  };

  const handleRemoveAksesoris = (id: string) => {
    setDaftarAksesoris(daftarAksesoris.filter((a) => a.id !== id));
  };

  const handleUpdateAksesoris = (index: number, field: keyof AksesorisItem, val: any) => {
    const updated = [...daftarAksesoris];
    updated[index] = { ...updated[index], [field]: val };
    setDaftarAksesoris(updated);
  };

  // Calculate grand total pieces
  const grandTotalPcs = breakdownSize.reduce((acc, curr) => acc + curr.subtotal, 0);

  // Submit
  const handleSubmit = (autoSPK: boolean = false) => {
    if (!nomorSurat.trim()) {
      alert('Nomor Surat Jalan wajib diisi.');
      return;
    }
    if (!namaModel.trim()) {
      alert('Nama Model / Artikel wajib diisi.');
      return;
    }
    if (daftarKain.length === 0) {
      alert('Tambahkan minimal 1 bahan kain.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-rose-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-800/80 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-brand tracking-wide">
                {editingSJP ? 'Edit Surat Jalan Potong Bahan' : 'Buat Surat Jalan Potong Baru'}
              </h2>
              <p className="text-xs text-rose-200/80">
                Standar Cutting & Penyerahan Bahan Kain Ninos Design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Section 1: Informasi Dokumen & Model */}
          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>1. Identitas Dokumen & Produk</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Surat Jalan:
                </label>
                <input
                  type="text"
                  value={nomorSurat}
                  onChange={(e) => setNomorSurat(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-rose-950 focus:ring-2 focus:ring-rose-800/20"
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
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
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
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pemotong / Meja Potong:
                </label>
                <input
                  type="text"
                  list="vendor-cutter-list"
                  value={pemotong}
                  onChange={(e) => setPemotong(e.target.value)}
                  placeholder="Pilih atau ketik nama pemotong..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
                <datalist id="vendor-cutter-list">
                  {vendors.map((v) => (
                    <option key={v.id} value={v.nama} />
                  ))}
                  <option value="Meja Potong Master (Mas Anto)" />
                  <option value="Tukang Potong Pak Joko" />
                  <option value="In-House Meja A" />
                </datalist>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Model / Desain Ninos:
                </label>
                <input
                  type="text"
                  list="model-list"
                  value={namaModel}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  placeholder="Ketik atau pilih model..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                />
                <datalist id="model-list">
                  {models.map((m) => (
                    <option key={m.id} value={m.nama} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kode Artikel:
                  </label>
                  <input
                    type="text"
                    value={kodeArtikel}
                    onChange={(e) => setKodeArtikel(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori:
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="Gamis Syar’i">Gamis Syar’i</option>
                    <option value="Abaya">Abaya</option>
                    <option value="Tunik">Tunik</option>
                    <option value="One Set">One Set</option>
                    <option value="Khimar / Hijab">Khimar / Hijab</option>
                    <option value="Kemeja Tunik">Kemeja Tunik</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <span className="font-semibold text-slate-700">Status Dokumen:</span>
              {(['Draft', 'Proses Potong', 'Selesai Potong', 'Sudah Terbit SPK'] as StatusSuratJalan[]).map((st) => (
                <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="statusSJP"
                    value={st}
                    checked={status === st}
                    onChange={() => setStatus(st)}
                    className="text-rose-900 focus:ring-rose-800"
                  />
                  <span className="text-slate-700">{st}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 2: Rincian Kain / Bahan Baku yang Digelar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-rose-800" />
                <span>2. Rincian Bahan Kain yang Diserahkan</span>
              </h3>
              <button
                type="button"
                onClick={handleAddFabric}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200 font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kain / Warna</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Nama Bahan Kain</th>
                    <th className="py-2 px-3">Warna / Varian</th>
                    <th className="py-2 px-2 text-right">Roll</th>
                    <th className="py-2 px-2 text-right">Panjang</th>
                    <th className="py-2 px-2 text-center">Satuan</th>
                    <th className="py-2 px-2 text-right">Konsumsi/Pcs</th>
                    <th className="py-2 px-2 text-right">Est. Pcs</th>
                    <th className="py-2 px-2 text-right font-bold text-rose-950">Realisasi (Pcs)</th>
                    <th className="py-2 px-1 text-center w-8">Aksi</th>
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
                          placeholder="e.g. Toyobo Fodu"
                          className="w-full px-2 py-1 border border-slate-200 rounded"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={kain.warna}
                          onChange={(e) => handleUpdateFabric(idx, 'warna', e.target.value)}
                          placeholder="e.g. Dusty Rose"
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
                          className="w-20 px-1.5 py-1 border border-slate-200 rounded text-right tabular-nums"
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
                          onChange={(e) =>
                            handleUpdateFabric(idx, 'estimasiPemakaianPerPcs', Number(e.target.value))
                          }
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
                          className="w-16 px-1.5 py-1 border border-rose-300 bg-rose-50/50 rounded text-right font-bold text-rose-950 tabular-nums"
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

          {/* Section 3: Rincian Ukuran / Size Matrix */}
          <div className="space-y-3 bg-rose-50/40 p-4 rounded-xl border border-rose-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
                  <span>3. Matriks Hasil Potong per Ukuran (Size Breakdown)</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Masukkan jumlah potongan per size. Subtotal akan otomatis dijumlahkan.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-600 mr-2">Total Potong:</span>
                <span className="text-base font-black text-rose-900 bg-rose-100 px-3 py-1 rounded-lg border border-rose-200 tabular-nums">
                  {grandTotalPcs} Pcs
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Warna Kain</th>
                    {DEFAULT_SIZES.map((sz) => (
                      <th key={sz} className="py-2 px-2 text-center w-20">
                        Size {sz}
                      </th>
                    ))}
                    <th className="py-2 px-3 text-right font-bold text-rose-950">Subtotal</th>
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
                            className="w-16 px-1.5 py-1 text-center border border-slate-200 rounded font-mono font-medium focus:border-rose-800 tabular-nums"
                          />
                        </td>
                      ))}
                      <td className="py-2 px-3 text-right font-extrabold text-rose-950 tabular-nums">
                        {row.subtotal} pcs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Aksesoris yang Disertakan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Aksesoris & Kelengkapan Jahit yang Disertakan
              </h3>
              <button
                type="button"
                onClick={handleAddAksesoris}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Aksesoris</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {daftarAksesoris.map((ak, idx) => (
                <div key={ak.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white">
                  <input
                    type="text"
                    value={ak.nama}
                    onChange={(e) => handleUpdateAksesoris(idx, 'nama', e.target.value)}
                    placeholder="Nama aksesoris (e.g. Resleting, Label Ninos)..."
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs"
                  />
                  <input
                    type="number"
                    min="1"
                    value={ak.jumlah}
                    onChange={(e) => handleUpdateAksesoris(idx, 'jumlah', Number(e.target.value))}
                    className="w-16 px-1.5 py-1 border border-slate-200 rounded text-right text-xs"
                  />
                  <input
                    type="text"
                    value={ak.satuan}
                    onChange={(e) => handleUpdateAksesoris(idx, 'satuan', e.target.value)}
                    placeholder="Satuan"
                    className="w-14 px-1 py-1 border border-slate-200 rounded text-center text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAksesoris(ak.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Instruksi & Tanda Tangan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instruksi Khusus Potong / Marker:
              </label>
              <textarea
                rows={3}
                value={instruksiPotong}
                onChange={(e) => setInstruksiPotong(e.target.value)}
                placeholder="Arah serat, penomoran bundle ticket, toleransi susut..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penanggung Jawab Gudang Kain:
                </label>
                <input
                  type="text"
                  value={penanggungJawabGudang}
                  onChange={(e) => setPenanggungJawabGudang(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Checker QC Hasil Potong:
                </label>
                <input
                  type="text"
                  value={checkerQc}
                  onChange={(e) => setCheckerQc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
          >
            Batal
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Surat Jalan</span>
            </button>

            {!editingSJP?.spkIdTerhubung && (
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-900 text-white hover:bg-rose-800 font-bold text-xs shadow-xs shadow-rose-900/20 transition active:scale-95"
                title="Simpan SJP dan langsung buka form SPK dengan data yang sama"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Simpan & Buat SPK Langsung</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
