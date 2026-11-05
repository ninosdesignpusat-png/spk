import React from 'react';
import {
  Scissors,
  FileText,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  ArrowRight,
  Plus,
  Clock,
  Layers,
  Sparkles,
  DollarSign,
  Download,
  Copy,
} from 'lucide-react';
import { SuratJalanPotong, SPKProduksi, SpreadsheetSettings } from '../types/ninos';
import { formatRupiah, formatDateIndo } from '../utils/printHelpers';

interface DashboardOverviewProps {
  suratJalanList: SuratJalanPotong[];
  spkList: SPKProduksi[];
  spreadsheetSettings: SpreadsheetSettings;
  onNavigateToSJP: () => void;
  onNavigateToSPK: () => void;
  onNewSJP: () => void;
  onNewSPK: () => void;
  onPrintSJP: (item: SuratJalanPotong) => void;
  onPrintSPK: (item: SPKProduksi) => void;
  onConvertSJPToSPK: (item: SuratJalanPotong) => void;
  onOpenSpreadsheetModal: () => void;
  onQuickSync: () => void;
  isSyncing: boolean;
  onExportSJPCSV: () => void;
  onExportSPKCSV: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  suratJalanList,
  spkList,
  spreadsheetSettings,
  onNavigateToSJP,
  onNavigateToSPK,
  onNewSJP,
  onNewSPK,
  onPrintSJP,
  onPrintSPK,
  onConvertSJPToSPK,
  onOpenSpreadsheetModal,
  onQuickSync,
  isSyncing,
  onExportSJPCSV,
  onExportSPKCSV,
}) => {
  // Calculations
  const totalSJPCount = suratJalanList.length;
  const totalSJPPcs = suratJalanList.reduce((acc, curr) => acc + (curr.totalPcs || 0), 0);
  const activeSJPCount = suratJalanList.filter((s) => s.status !== 'Sudah Terbit SPK').length;

  const totalSPKCount = spkList.length;
  const totalSPKPcs = spkList.reduce((acc, curr) => acc + (curr.totalPcs || 0), 0);
  const totalSPKLusin = (totalSPKPcs / 12).toFixed(1);
  const activeSPKCount = spkList.filter((s) => s.status !== 'Selesai').length;
  const totalBiayaCMT = spkList.reduce((acc, curr) => acc + (curr.totalBiayaCMT || 0), 0);

  const isSheetConnected = Boolean(spreadsheetSettings.webAppUrl?.trim());

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg shadow-rose-950/20 border border-rose-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Ninos Design Garment Production System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-brand text-white">
            Pusat Kendali Surat Jalan Potong & SPK Produksi
          </h1>
          <p className="mt-2 text-sm sm:text-base text-rose-100/90 leading-relaxed">
            Kelola alur pemotongan bahan kain, penerbitan SPK penjahit/CMT makloon, cetak lembar kerja resmi & tiket bundel, serta sinkronisasi otomatis ke Google Sheets.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewSJP}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-rose-950 font-bold text-xs sm:text-sm hover:bg-rose-50 transition shadow-sm active:scale-95"
            >
              <Scissors className="w-4 h-4 text-rose-900" />
              <span>+ Buat Surat Jalan Potong</span>
            </button>

            <button
              onClick={onNewSPK}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm transition shadow-sm border border-rose-400/30 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>+ Terbitkan SPK Jahit</span>
            </button>

            <button
              onClick={onOpenSpreadsheetModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-emerald-300 font-semibold text-xs sm:text-sm transition border border-slate-700 active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{isSheetConnected ? 'Koneksi Google Sheets' : 'Hubungkan Google Sheets'}</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic background */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Scissors className="w-72 h-72 text-white transform rotate-12" />
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Surat Jalan Potong */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Surat Jalan Potong
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-800 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {totalSJPPcs.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-medium text-slate-500">Pcs Bahan</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
            <span>Total Dokumen: <b>{totalSJPCount} SJP</b></span>
            <span className="text-amber-700 font-semibold">{activeSJPCount} Berjalan</span>
          </div>
        </div>

        {/* Card 2: SPK Produksi */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              SPK Produksi CMT
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {totalSPKPcs.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-medium text-slate-500">Pcs ({totalSPKLusin} Lusin)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
            <span>Total SPK: <b>{totalSPKCount} Dokumen</b></span>
            <span className="text-emerald-700 font-semibold">{activeSPKCount} Aktif</span>
          </div>
        </div>

        {/* Card 3: Biaya CMT Terjadwal */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Biaya CMT Jahit
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl font-black text-slate-900 tabular-nums">
              {formatRupiah(totalBiayaCMT)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
            <span>Rata-rata / Pcs</span>
            <span className="font-semibold text-slate-800">
              {totalSPKPcs > 0 ? formatRupiah(Math.round(totalBiayaCMT / totalSPKPcs)) : 'Rp 0'}
            </span>
          </div>
        </div>

        {/* Card 4: Google Sheets Status */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Google Spreadsheet
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isSheetConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-sm font-bold text-slate-800">
              {isSheetConnected ? 'Terhubung Live' : 'Belum Terhubung'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100 pt-2">
            {isSheetConnected ? (
              <>
                <span className="truncate max-w-[120px] text-slate-500">
                  {spreadsheetSettings.lastSyncTime
                    ? `Sync: ${new Date(spreadsheetSettings.lastSyncTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Siap Sync'}
                </span>
                <button
                  onClick={onQuickSync}
                  disabled={isSyncing}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  {isSyncing ? 'Menyinkron...' : 'Sync Sekarang'}
                </button>
              </>
            ) : (
              <button
                onClick={onOpenSpreadsheetModal}
                className="text-rose-800 font-bold hover:underline"
              >
                Konfigurasi Webhook &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Production Flow Diagram */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Alur Standar Produksi Ninos Design (Cutting to Warehouse)
            </h3>
          </div>
          <span className="text-xs text-slate-500">5 Tahapan Terintegrasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Gudang Bahan</span>
            </div>
            <p className="mt-1 text-slate-500 text-[11px]">
              Penyiapan roll kain, pemeriksaan lot, furing & aksesoris.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200">
            <div className="font-bold text-rose-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-rose-900 text-white flex items-center justify-center text-[10px]">2</span>
              <span>Surat Jalan Potong</span>
            </div>
            <p className="mt-1 text-rose-800/80 text-[11px]">
              Gelar kain, potong sesuai marker size, hitung realisasi & nomor ikatan.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px]">3</span>
              <span>SPK Produksi CMT</span>
            </div>
            <p className="mt-1 text-amber-900/80 text-[11px]">
              Penyerahan potongan & aksesoris ke penjahit dengan SOP teknis & deadline.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200">
            <div className="font-bold text-blue-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-800 text-white flex items-center justify-center text-[10px]">4</span>
              <span>Finishing & QC</span>
            </div>
            <p className="mt-1 text-blue-900/80 text-[11px]">
              Buang tiras benang, steam uap, cek ukuran, pasang hangtag Ninos.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">5</span>
              <span>Gudang Jadi</span>
            </div>
            <p className="mt-1 text-emerald-900/80 text-[11px]">
              Packaging polybag, scan barcode, simpan & siap distribusi/penjualan.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent SJP & Recent SPK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Surat Jalan Potong */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-rose-800" />
              <h2 className="text-base font-bold text-slate-900">Surat Jalan Potong Terbaru</h2>
            </div>
            <button
              onClick={onNavigateToSJP}
              className="text-xs font-semibold text-rose-900 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Lihat Semua ({suratJalanList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1">
            {suratJalanList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Belum ada Surat Jalan Potong. Klik "+ Buat Surat Jalan Potong" di atas.
              </div>
            ) : (
              suratJalanList.slice(0, 4).map((sjp) => (
                <div key={sjp.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-950 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {sjp.nomorSurat}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          sjp.status === 'Sudah Terbit SPK'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sjp.status === 'Selesai Potong'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sjp.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {sjp.namaModel}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Pemotong: <b>{sjp.pemotong}</b></span>
                      <span>•</span>
                      <span>Tgl: {formatDateIndo(sjp.tanggal)}</span>
                      <span>•</span>
                      <span className="text-rose-900 font-bold">{sjp.totalPcs} Pcs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => onPrintSJP(sjp)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-medium transition"
                      title="Pratinjau & Cetak Surat Jalan Potong"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak</span>
                    </button>

                    {sjp.status !== 'Sudah Terbit SPK' && (
                      <button
                        onClick={() => onConvertSJPToSPK(sjp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-900 text-white hover:bg-rose-800 text-xs font-semibold transition"
                        title="Jadikan SPK Produksi Otomatis"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Buat SPK</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs">
            <span className="text-slate-500">Ekspor cepat data potong:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onExportSJPCSV}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
              >
                <Download className="w-3 h-3" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Recent SPK Produksi */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" />
              <h2 className="text-base font-bold text-slate-900">SPK Produksi Terbaru</h2>
            </div>
            <button
              onClick={onNavigateToSPK}
              className="text-xs font-semibold text-rose-900 hover:text-rose-700 flex items-center gap-1"
            >
              <span>Lihat Semua ({spkList.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 divide-y divide-slate-100 flex-1">
            {spkList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Belum ada SPK Produksi. Klik "+ Terbitkan SPK Jahit" di atas.
              </div>
            ) : (
              spkList.slice(0, 4).map((spk) => (
                <div key={spk.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {spk.nomorSPK}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          spk.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : spk.status === 'QC & Finishing'
                            ? 'bg-purple-100 text-purple-800'
                            : spk.status === 'Sedang Jahit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {spk.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {spk.namaModel}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>CMT: <b>{spk.vendorCMT}</b></span>
                      <span>•</span>
                      <span>Target: {formatDateIndo(spk.targetSelesai)}</span>
                      <span>•</span>
                      <span className="text-emerald-900 font-bold">{spk.totalPcs} Pcs</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => onPrintSPK(spk)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 text-xs font-semibold transition shadow-xs"
                      title="Pratinjau, Cetak & Download PDF SPK"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak SPK</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-xs">
            <span className="text-slate-500">Ekspor cepat data SPK:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={onExportSPKCSV}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
              >
                <Download className="w-3 h-3" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
