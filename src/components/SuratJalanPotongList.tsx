import React, { useState, useMemo } from 'react';
import {
  Scissors,
  Search,
  Filter,
  Plus,
  Printer,
  FileText,
  Tag,
  Edit2,
  Trash2,
  Download,
  Copy,
  CheckCircle,
  Clock,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { SuratJalanPotong, StatusSuratJalan } from '../types/ninos';
import { formatDateIndo } from '../utils/printHelpers';

interface SuratJalanPotongListProps {
  suratJalanList: SuratJalanPotong[];
  onNewSJP: () => void;
  onEditSJP: (item: SuratJalanPotong) => void;
  onDeleteSJP: (id: string) => void;
  onPrintSJP: (item: SuratJalanPotong) => void;
  onPrintBundleTickets: (item: SuratJalanPotong) => void;
  onConvertSJPToSPK: (item: SuratJalanPotong) => void;
  onExportCSV: () => void;
  onCopyTable: () => void;
}

export const SuratJalanPotongList: React.FC<SuratJalanPotongListProps> = ({
  suratJalanList,
  onNewSJP,
  onEditSJP,
  onDeleteSJP,
  onPrintSJP,
  onPrintBundleTickets,
  onConvertSJPToSPK,
  onExportCSV,
  onCopyTable,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredList = useMemo(() => {
    return suratJalanList.filter((item) => {
      const matchSearch =
        item.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodeArtikel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pemotong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kategori.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [suratJalanList, searchTerm, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-serif-brand">
              Daftar Surat Jalan Potong Bahan
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Pencatatan penyerahan kain gulung, instruksi pemotongan, marker size, dan hasil realisasi potong Ninos Design.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onCopyTable}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition"
            title="Salin Data Siap Paste (Ctrl+V) di Google Sheets / Excel"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Salin ke Spreadsheet</span>
          </button>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition"
            title="Download file CSV untuk Google Sheets"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={onNewSJP}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold shadow-xs shadow-rose-900/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat SJP Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari No. SJP, Model, Kode Artikel, atau Tukang Potong..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-800/20 focus:border-rose-800 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 text-xs flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>
          {['Semua', 'Draft', 'Proses Potong', 'Selesai Potong', 'Sudah Terbit SPK'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-rose-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Surat Jalan Cards List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <Scissors className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada Surat Jalan Potong</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'Semua'
                ? 'Tidak ada data yang cocok dengan kriteria pencarian Anda.'
                : 'Belum ada surat jalan potong yang dibuat. Klik tombol "+ Buat SJP Baru" untuk memulai.'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            const totalRoll = item.daftarKain.reduce((acc, k) => acc + (k.jumlahRoll || 0), 0);
            const totalPanjang = item.daftarKain.reduce((acc, k) => acc + (k.totalPanjang || 0), 0);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all overflow-hidden"
              >
                {/* Main Card Header / Row */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-950 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                        {item.nomorSurat}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          item.status === 'Sudah Terbit SPK'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'Selesai Potong'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : item.status === 'Proses Potong'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Kategori: <b className="text-slate-700">{item.kategori}</b>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {item.namaModel}
                        <span className="text-xs font-normal text-slate-500 ml-2">
                          ({item.kodeArtikel})
                        </span>
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span>Pemotong: <b className="text-slate-800">{item.pemotong}</b></span>
                      <span>•</span>
                      <span>Tgl Potong: <b>{formatDateIndo(item.tanggal)}</b></span>
                      <span>•</span>
                      <span>Kain: <b>{item.daftarKain.length} Jenis ({totalRoll} Roll, {totalPanjang} Meter)</b></span>
                      <span>•</span>
                      <span>Hasil Potong: <b className="text-rose-900 text-sm font-extrabold">{item.totalPcs} Pcs</b></span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                    <button
                      onClick={() => onPrintSJP(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition"
                      title="Pratinjau & Cetak Surat Jalan Potong"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak SJP</span>
                    </button>

                    <button
                      onClick={() => onPrintBundleTickets(item)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-medium transition"
                      title="Cetak Tiket / Label Bundel Potongan"
                    >
                      <Tag className="w-3.5 h-3.5 text-slate-500" />
                      <span>Tiket Bundel</span>
                    </button>

                    {item.status !== 'Sudah Terbit SPK' ? (
                      <button
                        onClick={() => onConvertSJPToSPK(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-900 text-white hover:bg-rose-800 text-xs font-bold shadow-xs shadow-rose-900/20 transition active:scale-95"
                        title="Buat SPK Produksi dari hasil potong ini"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Buat SPK</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        SPK: {item.spkIdTerhubung || 'Terhubung'}
                      </span>
                    )}

                    <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                    <button
                      onClick={() => onEditSJP(item)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                      title="Edit Data SJP"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteSJP(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 transition"
                      title="Hapus Surat Jalan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                      title="Lihat Rincian Lengkap"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 bg-slate-50/60 border-t border-slate-100 space-y-4 text-xs">
                    {/* Fabric details table */}
                    <div>
                      <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-rose-800" />
                        <span>Rincian Bahan Kain yang Diserahkan & Hasil Potong:</span>
                      </h4>
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3">Nama Bahan</th>
                              <th className="py-2 px-3">Warna</th>
                              <th className="py-2 px-3 text-right">Jml Roll</th>
                              <th className="py-2 px-3 text-right">Total Panjang</th>
                              <th className="py-2 px-3 text-right">Konsumsi/Pcs</th>
                              <th className="py-2 px-3 text-right">Estimasi Pcs</th>
                              <th className="py-2 px-3 text-right font-bold text-rose-900">Realisasi Potong</th>
                              <th className="py-2 px-3 text-right">Sisa Bahan</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {item.daftarKain.map((kain) => (
                              <tr key={kain.id} className="hover:bg-slate-50">
                                <td className="py-2 px-3 font-medium text-slate-800">{kain.namaKain}</td>
                                <td className="py-2 px-3">{kain.warna}</td>
                                <td className="py-2 px-3 text-right">{kain.jumlahRoll} roll</td>
                                <td className="py-2 px-3 text-right">{kain.totalPanjang} {kain.satuan}</td>
                                <td className="py-2 px-3 text-right">{kain.estimasiPemakaianPerPcs} {kain.satuan}</td>
                                <td className="py-2 px-3 text-right text-slate-500">{kain.estimasiHasilPcs} pcs</td>
                                <td className="py-2 px-3 text-right font-bold text-rose-900">{kain.realisasiHasilPcs} pcs</td>
                                <td className="py-2 px-3 text-right text-slate-500">{kain.sisaBahan} {kain.satuan}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Size breakdown matrix */}
                    <div>
                      <h4 className="font-bold text-slate-700 mb-2">
                        Rincian Ukuran / Size Matrix:
                      </h4>
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex flex-wrap gap-4">
                          {item.breakdownSize.map((szRow) => (
                            <div key={szRow.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs min-w-[200px]">
                              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-1.5 flex justify-between">
                                <span>{szRow.warna}</span>
                                <span className="text-rose-900 font-extrabold">{szRow.subtotal} pcs</span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-slate-600">
                                {Object.entries(szRow.sizes).map(([sz, qty]) => (
                                  qty ? (
                                    <span key={sz} className="px-2 py-0.5 bg-white rounded border border-slate-200 font-mono">
                                      {sz}: <b>{qty}</b>
                                    </span>
                                  ) : null
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Aksesoris & Instruksi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg border border-slate-200 bg-white">
                        <span className="font-bold text-slate-700 block mb-1">Aksesoris Disertakan:</span>
                        {item.daftarAksesoris && item.daftarAksesoris.length > 0 ? (
                          <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                            {item.daftarAksesoris.map((ak) => (
                              <li key={ak.id}>
                                {ak.nama}: <b>{ak.jumlah} {ak.satuan}</b> {ak.catatan ? `(${ak.catatan})` : ''}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-slate-400">Tidak ada aksesoris tambahan.</span>
                        )}
                      </div>

                      <div className="p-3 rounded-lg border border-slate-200 bg-white">
                        <span className="font-bold text-slate-700 block mb-1">Instruksi Potong & Catatan:</span>
                        <p className="text-slate-600 whitespace-pre-line">
                          {item.instruksiPotong || 'Standar potong rapi sesuai marker Ninos Design.'}
                        </p>
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>PIC Gudang: <b>{item.penanggungJawabGudang}</b></span>
                          <span>QC Checker: <b>{item.checkerQc}</b></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
