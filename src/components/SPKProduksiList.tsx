import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Printer,
  Edit2,
  Trash2,
  Download,
  Copy,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scissors,
  DollarSign,
  Tag,
  Building2,
  Phone,
} from 'lucide-react';
import { SPKProduksi, StatusSPK } from '../types/ninos';
import { formatRupiah, formatDateIndo } from '../utils/printHelpers';

interface SPKProduksiListProps {
  spkList: SPKProduksi[];
  onNewSPK: () => void;
  onEditSPK: (item: SPKProduksi) => void;
  onDeleteSPK: (id: string) => void;
  onPrintSPK: (item: SPKProduksi) => void;
  onUpdateStatus: (id: string, newStatus: StatusSPK) => void;
  onExportCSV: () => void;
  onCopyTable: () => void;
}

const STATUS_PROGRESSION: StatusSPK[] = [
  'Draft',
  'Bahan Diterima',
  'Sedang Jahit',
  'QC & Finishing',
  'Selesai',
];

export const SPKProduksiList: React.FC<SPKProduksiListProps> = ({
  spkList,
  onNewSPK,
  onEditSPK,
  onDeleteSPK,
  onPrintSPK,
  onUpdateStatus,
  onExportCSV,
  onCopyTable,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredList = useMemo(() => {
    return spkList.filter((item) => {
      const matchSearch =
        item.nomorSPK.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.nomorSuratJalanPotong || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.namaModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vendorCMT.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kodeArtikel.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [spkList, searchTerm, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 font-serif-brand">
              Daftar SPK Produksi (Surat Perintah Kerja)
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Penugasan pengerjaan jahit CMT/In-House, target deadline, SOP standar mutu jahit Ninos Design, dan perhitungan ongkos produksi.
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
            onClick={onNewSPK}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-900 hover:bg-rose-800 text-white text-xs font-bold shadow-xs shadow-rose-900/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Terbitkan SPK Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari No. SPK, No. SJP, Model, atau Vendor CMT..."
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
          {['Semua', ...STATUS_PROGRESSION].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* SPK Cards List */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Tidak ada SPK Produksi</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'Semua'
                ? 'Tidak ada SPK yang cocok dengan pencarian Anda.'
                : 'Belum ada Surat Perintah Kerja. Klik "+ Terbitkan SPK Baru" atau buat dari Surat Jalan Potong.'}
            </p>
          </div>
        ) : (
          filteredList.map((item) => {
            const isExpanded = expandedId === item.id;
            const currentStepIdx = STATUS_PROGRESSION.indexOf(item.status);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs transition-all overflow-hidden"
              >
                {/* Main Card Content */}
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {item.nomorSPK}
                      </span>

                      {item.nomorSuratJalanPotong && (
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                          <Scissors className="w-3 h-3 text-rose-800" />
                          <span>Ref: {item.nomorSuratJalanPotong}</span>
                        </span>
                      )}

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : item.status === 'QC & Finishing'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : item.status === 'Sedang Jahit'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>

                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Tipe: <b>{item.tipeProduksi}</b>
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
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        CMT: <b className="text-slate-800">{item.vendorCMT}</b>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Target: <b className="text-rose-900">{formatDateIndo(item.targetSelesai)}</b>
                      </span>
                      <span>•</span>
                      <span>Qty: <b className="text-emerald-900 text-sm font-extrabold">{item.totalPcs} Pcs</b> ({item.totalLusin} Lusin)</span>
                      <span>•</span>
                      <span>Ongkos: <b>{formatRupiah(item.ongkosJahitPerPcs)}/pcs</b> (Total: <b className="text-slate-900">{formatRupiah(item.totalBiayaCMT)}</b>)</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                    <button
                      onClick={() => onPrintSPK(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-bold shadow-xs transition active:scale-95"
                      title="Pratinjau, Cetak & Download PDF SPK"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak / Download SPK</span>
                    </button>

                    {/* Quick status stepper dropdown */}
                    <div className="relative inline-block text-left">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as StatusSPK)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition"
                        title="Perbarui Status Pengerjaan Produksi"
                      >
                        {STATUS_PROGRESSION.map((st) => (
                          <option key={st} value={st}>
                            Status: {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

                    <button
                      onClick={() => onEditSPK(item)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                      title="Edit Data SPK"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteSPK(item.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-red-600 hover:bg-red-50 transition"
                      title="Hapus SPK"
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

                {/* Progress bar visual */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium text-slate-500">
                    <span>Progress Pengerjaan:</span>
                    <span className="font-bold text-slate-800">
                      Tahap {currentStepIdx + 1} dari {STATUS_PROGRESSION.length} ({item.status})
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                    {STATUS_PROGRESSION.map((step, idx) => (
                      <div
                        key={step}
                        className={`h-full flex-1 border-r border-white/50 last:border-none transition-all ${
                          idx <= currentStepIdx ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 bg-slate-50/70 border-t border-slate-200 space-y-4 text-xs">
                    {/* Size breakdown matrix */}
                    <div>
                      <h4 className="font-bold text-slate-700 mb-2">
                        Target Produksi per Warna & Ukuran:
                      </h4>
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3">
                        <div className="flex flex-wrap gap-4">
                          {item.breakdownSize.map((szRow) => (
                            <div key={szRow.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs min-w-[200px]">
                              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-1.5 flex justify-between">
                                <span>{szRow.warna}</span>
                                <span className="text-emerald-900 font-extrabold">{szRow.subtotal} pcs</span>
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

                    {/* SOP Jahit Specifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                        <span className="font-bold text-slate-800 block border-b border-slate-100 pb-1">
                          Standar Mutu & SOP Jahit Ninos Design:
                        </span>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Jarak Jahitan (SPI):</span>
                          <span className="font-semibold text-slate-800">{item.sopJahit?.jarakJahitanSPI || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Tipe Jahitan:</span>
                          <span className="font-medium text-slate-700">{item.sopJahit?.tipeJahitan || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Penempatan Label & Aksesoris:</span>
                          <span className="font-medium text-slate-700">{item.sopJahit?.posisiLabel || '-'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Standar Finishing:</span>
                          <span className="font-medium text-slate-700">{item.sopJahit?.standarFinishing || '-'}</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2">
                        <span className="font-bold text-slate-800 block border-b border-slate-100 pb-1">
                          Kontak & Verifikasi Produksi:
                        </span>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Vendor / Penjahit:</span>
                          <span className="font-semibold text-slate-800">
                            {item.vendorCMT} ({item.picVendor ? `PIC: ${item.picVendor}` : ''})
                          </span>
                          {item.teleponVendor && (
                            <span className="text-slate-600 block text-[11px]">
                              Telp: {item.teleponVendor}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[11px]">Catatan Khusus:</span>
                          <p className="text-slate-700 whitespace-pre-line">
                            {item.catatanProduksi || 'Tidak ada catatan khusus.'}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>PPIC: <b>{item.productionManager}</b></span>
                          <span>QC: <b>{item.qcInspector}</b></span>
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
