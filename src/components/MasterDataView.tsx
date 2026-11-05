import React, { useState } from 'react';
import {
  Database,
  Building2,
  Scissors,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ModelMaster, VendorItem } from '../types/ninos';

interface MasterDataViewProps {
  models: ModelMaster[];
  setModels: React.Dispatch<React.SetStateAction<ModelMaster[]>>;
  vendors: VendorItem[];
  setVendors: React.Dispatch<React.SetStateAction<VendorItem[]>>;
  onExportBackupJSON: () => void;
  onImportBackupJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  models,
  setModels,
  vendors,
  setVendors,
  onExportBackupJSON,
  onImportBackupJSON,
}) => {
  const [activeTab, setActiveTab] = useState<'models' | 'vendors' | 'backup'>('models');

  // New model state
  const [newModelNama, setNewModelNama] = useState('');
  const [newModelKode, setNewModelKode] = useState('');
  const [newModelKategori, setNewModelKategori] = useState('Gamis Syar’i');
  const [newModelKonsumsi, setNewModelKonsumsi] = useState(2.2);

  // New vendor state
  const [newVendorNama, setNewVendorNama] = useState('');
  const [newVendorTipe, setNewVendorTipe] = useState<'CMT' | 'Potong' | 'Finishing'>('CMT');
  const [newVendorKontak, setNewVendorKontak] = useState('');
  const [newVendorTelp, setNewVendorTelp] = useState('');
  const [newVendorAlamat, setNewVendorAlamat] = useState('');

  // Add Model
  const handleAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelNama.trim() || !newModelKode.trim()) return;

    const m: ModelMaster = {
      id: 'MOD-' + Date.now(),
      kode: newModelKode.trim(),
      nama: newModelNama.trim(),
      kategori: newModelKategori,
      estimasiKonsumsiKain: Number(newModelKonsumsi) || 2.2,
    };

    setModels([...models, m]);
    setNewModelNama('');
    setNewModelKode('');
    alert('Model berhasil ditambahkan!');
  };

  const handleDeleteModel = (id: string) => {
    if (confirm('Hapus model ini dari katalog master?')) {
      setModels(models.filter((m) => m.id !== id));
    }
  };

  // Add Vendor
  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorNama.trim()) return;

    const v: VendorItem = {
      id: 'VND-' + Date.now(),
      nama: newVendorNama.trim(),
      tipe: newVendorTipe,
      kontak: newVendorKontak.trim() || 'PIC',
      telepon: newVendorTelp.trim() || '-',
      alamat: newVendorAlamat.trim() || '-',
      kapasitasPerBulan: 2000,
    };

    setVendors([...vendors, v]);
    setNewVendorNama('');
    setNewVendorKontak('');
    setNewVendorTelp('');
    setNewVendorAlamat('');
    alert('Vendor / Mitra kerja berhasil ditambahkan!');
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm('Hapus vendor ini?')) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="space-y-5 pb-24 sm:pb-8">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-serif-brand">
              Pengaturan Data Master & Cadangan
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Katalog model desain, daftar penjahit/vendor CMT makloon, dan backup database lokal Ninos Design.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'models'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Katalog Model ({models.length})
          </button>

          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'vendors'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Vendor CMT & Potong ({vendors.length})
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'backup'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Backup & Restore
          </button>
        </div>
      </div>

      {/* Tab 1: Models */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Add form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-800" />
              <span>Tambah Model Desain Baru</span>
            </h3>

            <form onSubmit={handleAddModel} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Model / Desain:
                </label>
                <input
                  type="text"
                  required
                  value={newModelNama}
                  onChange={(e) => setNewModelNama(e.target.value)}
                  placeholder="e.g. Gamis Ayana Silk"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kode Artikel:
                </label>
                <input
                  type="text"
                  required
                  value={newModelKode}
                  onChange={(e) => setNewModelKode(e.target.value)}
                  placeholder="e.g. ND-AYN-01"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori:
                </label>
                <select
                  value={newModelKategori}
                  onChange={(e) => setNewModelKategori(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                >
                  <option value="Gamis Syar’i">Gamis Syar’i</option>
                  <option value="Abaya">Abaya</option>
                  <option value="Tunik">Tunik</option>
                  <option value="One Set">One Set</option>
                  <option value="Khimar / Hijab">Khimar / Hijab</option>
                  <option value="Kemeja Tunik">Kemeja Tunik</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estimasi Konsumsi Kain (Meter / Pcs):
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  value={newModelKonsumsi}
                  onChange={(e) => setNewModelKonsumsi(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg tabular-nums"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-900 hover:bg-rose-800 text-white font-bold rounded-xl shadow-xs transition active:scale-95"
              >
                + Simpan ke Katalog
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">
                Daftar Model / Desain Aktif ({models.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Kode</th>
                    <th className="py-2.5 px-4">Nama Model</th>
                    <th className="py-2.5 px-4">Kategori</th>
                    <th className="py-2.5 px-4 text-right">Konsumsi Kain</th>
                    <th className="py-2.5 px-4 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {models.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-rose-950">{m.kode}</td>
                      <td className="py-2.5 px-4 font-bold text-slate-800">{m.nama}</td>
                      <td className="py-2.5 px-4 text-slate-600">{m.kategori}</td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-slate-700">
                        {m.estimasiKonsumsiKain} meter/pcs
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteModel(m.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Vendors */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Add form */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-800" />
              <span>Tambah Mitra CMT / Penjahit</span>
            </h3>

            <form onSubmit={handleAddVendor} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Vendor / Workshop:
                </label>
                <input
                  type="text"
                  required
                  value={newVendorNama}
                  onChange={(e) => setNewVendorNama(e.target.value)}
                  placeholder="e.g. CMT Berkah Makmur"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tipe Pekerjaan:
                </label>
                <select
                  value={newVendorTipe}
                  onChange={(e) => setNewVendorTipe(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                >
                  <option value="CMT">CMT (Jahit Makloon)</option>
                  <option value="Potong">Potong (Cutting Table)</option>
                  <option value="Finishing">Finishing / Packing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama PIC / Penanggung Jawab:
                </label>
                <input
                  type="text"
                  value={newVendorKontak}
                  onChange={(e) => setNewVendorKontak(e.target.value)}
                  placeholder="e.g. Mas Sugeng"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  No. Telepon / WhatsApp:
                </label>
                <input
                  type="text"
                  value={newVendorTelp}
                  onChange={(e) => setNewVendorTelp(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat / Lokasi:
                </label>
                <textarea
                  rows={2}
                  value={newVendorAlamat}
                  onChange={(e) => setNewVendorAlamat(e.target.value)}
                  placeholder="Kota atau alamat workshop..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition active:scale-95"
              >
                + Simpan Vendor
              </button>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">
                Daftar Mitra CMT & Meja Potong ({vendors.length})
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Nama Workshop</th>
                    <th className="py-2.5 px-4">Tipe</th>
                    <th className="py-2.5 px-4">PIC & Telepon</th>
                    <th className="py-2.5 px-4">Alamat</th>
                    <th className="py-2.5 px-4 text-center w-16">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-bold text-slate-800">{v.nama}</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {v.tipe}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">
                        <b>{v.kontak}</b>
                        <span className="block text-[10px] text-slate-500">{v.telepon}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-500">{v.alamat}</td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => handleDeleteVendor(v.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6 text-xs max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Cadangan & Pemulihan Data (Backup & Restore)
            </h3>
            <p className="text-slate-500">
              Simpan seluruh rekaman Surat Jalan Potong, SPK Produksi, serta Master Data ke file JSON di komputer Anda untuk keamanan maksimal dan kemudahan pindah perangkat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-rose-800" />
                <span>Unduh Cadangan Lengkap</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Ekspor file JSON berisi seluruh data SJP, SPK, dan settingan.
              </p>
              <button
                onClick={onExportBackupJSON}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs transition"
              >
                Download File Backup (.json)
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-800" />
                <span>Pulihkan dari File Backup</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Pilih file JSON hasil download sebelumnya untuk memulihkan data.
              </p>
              <label className="block w-full text-center py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition cursor-pointer">
                <span>Pilih File Backup (.json)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackupJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
