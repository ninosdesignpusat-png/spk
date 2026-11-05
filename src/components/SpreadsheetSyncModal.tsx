import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Download,
  Code,
  HelpCircle,
  Send,
  Save,
} from 'lucide-react';
import { SpreadsheetSettings, SuratJalanPotong, SPKProduksi } from '../types/ninos';
import {
  GOOGLE_APPS_SCRIPT_TEMPLATE,
  testGoogleSheetsPing,
  syncToGoogleSheets,
  downloadSJPToCSV,
  downloadSPKToCSV,
  copyTableToClipboard,
} from '../utils/spreadsheetSync';

interface SpreadsheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SpreadsheetSettings;
  onSaveSettings: (newSettings: SpreadsheetSettings) => void;
  suratJalanList: SuratJalanPotong[];
  spkList: SPKProduksi[];
  onSyncCompleted: (success: boolean, msg: string) => void;
}

export const SpreadsheetSyncModal: React.FC<SpreadsheetSyncModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  suratJalanList,
  spkList,
  onSyncCompleted,
}) => {
  const [webAppUrl, setWebAppUrl] = useState(settings.webAppUrl || '');
  const [autoSync, setAutoSync] = useState(settings.autoSync || false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'connect' | 'guide'>('connect');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDataStatus, setCopiedDataStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Ping Test
  const handleTestPing = async () => {
    if (!webAppUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Masukkan URL Web App Google Apps Script terlebih dahulu.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testGoogleSheetsPing(webAppUrl);
    setTestResult(res);
    setIsTesting(false);
  };

  // Handle Save
  const handleSave = () => {
    onSaveSettings({
      ...settings,
      webAppUrl: webAppUrl.trim(),
      autoSync,
    });
    alert('Pengaturan Google Sheets berhasil disimpan!');
  };

  // Handle Sync Now
  const handleSyncNow = async () => {
    if (!webAppUrl.trim()) {
      alert('Silakan masukkan dan simpan URL Web App Google Apps Script terlebih dahulu.');
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncToGoogleSheets(webAppUrl, suratJalanList, spkList);
      setIsSyncing(false);
      onSyncCompleted(true, res.message || 'Sinkronisasi ke Google Sheets berhasil!');
      alert(res.message || 'Data berhasil dikirim ke Google Sheets!');
    } catch (err: any) {
      setIsSyncing(false);
      onSyncCompleted(false, err.message);
      alert(`Gagal sinkronisasi: ${err.message}`);
    }
  };

  // Copy Apps Script code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      alert('Gagal menyalin kode ke clipboard.');
    }
  };

  // Copy Data TSV
  const handleCopyTSV = async (type: 'SJP' | 'SPK') => {
    const success = await copyTableToClipboard(type, type === 'SJP' ? suratJalanList : spkList);
    if (success) {
      setCopiedDataStatus(`Data ${type} berhasil disalin! Silakan buka Google Sheets dan tekan Ctrl+V.`);
      setTimeout(() => setCopiedDataStatus(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-800/80 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-brand tracking-wide">
                Integrasi Google Sheets Ninos Design
              </h2>
              <p className="text-xs text-emerald-200/80">
                Sinkronisasi Otomatis Surat Jalan Potong & SPK Produksi ke Spreadsheet
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('connect')}
            className={`pb-3 px-4 border-b-2 transition ${
              activeTab === 'connect'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Koneksi & Sinkronisasi
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'guide'
                ? 'border-emerald-700 text-emerald-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Panduan & Kode Apps Script (1 Menit)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {activeTab === 'connect' ? (
            <>
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  settings.webAppUrl?.trim()
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                {settings.webAppUrl?.trim() ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <h4 className="font-bold">
                    {settings.webAppUrl?.trim()
                      ? 'Webhook Google Sheets Terkonfigurasi'
                      : 'Google Sheets Belum Terhubung'}
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {settings.webAppUrl?.trim()
                      ? 'Aplikasi siap mengirim dan memperbarui data Surat Jalan Potong dan SPK Produksi langsung ke Google Sheet Anda.'
                      : 'Pasang Google Apps Script di spreadsheet Anda (lihat tab Panduan), lalu salin Web App URL ke formulir di bawah.'}
                  </p>
                  {settings.lastSyncTime && (
                    <div className="text-[10px] text-slate-500 pt-1">
                      Terakhir disinkronkan: {new Date(settings.lastSyncTime).toLocaleString('id-ID')}
                    </div>
                  )}
                </div>
              </div>

              {/* Web App URL Form */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-800">
                      URL Web App Google Apps Script:
                    </label>
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <span>Buka Google Sheets Baru</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={webAppUrl}
                    onChange={(e) => setWebAppUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-xs text-slate-900 focus:ring-2 focus:ring-emerald-700/20"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    URL deployment Apps Script dengan hak akses "Anyone" (Siapa saja).
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestPing}
                      disabled={isTesting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-600' : ''}`} />
                      <span>{isTesting ? 'Menguji Koneksi...' : 'Tes Koneksi (Ping)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Pengaturan</span>
                    </button>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoSync}
                      onChange={(e) => setAutoSync(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-700 focus:ring-0"
                    />
                    <span className="font-semibold text-slate-700">
                      Otomatis Sinkronisasi saat Simpan Dokumen
                    </span>
                  </label>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      testResult.success
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-red-100 text-red-900'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              {/* Action 1: Kirim Semua Data ke Google Sheets */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-emerald-950">
                      Kirim Semua Data ke Google Sheets
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Akan memperbarui {suratJalanList.length} Surat Jalan Potong dan {spkList.length} SPK Produksi ke tab sheet terkait.
                    </p>
                  </div>

                  <button
                    onClick={handleSyncNow}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-900/20 transition active:scale-95 disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
                    <span>{isSyncing ? 'Sedang Mengirim...' : 'Sinkronkan Sekarang'}</span>
                  </button>
                </div>
              </div>

              {/* Action 2: Salin Tabular (Instant Ctrl+V) & Download CSV */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800">
                  Opsi Tambahan: Salin Tabular & Download CSV
                </h4>

                {copiedDataStatus && (
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 font-semibold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{copiedDataStatus}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* SJP Box */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>Surat Jalan Potong ({suratJalanList.length} Data)</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleCopyTSV('SJP')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition"
                        title="Salin data siap Ctrl+V di spreadsheet"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tabel</span>
                      </button>
                      <button
                        onClick={() => downloadSJPToCSV(suratJalanList)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* SPK Box */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span>SPK Produksi ({spkList.length} Data)</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleCopyTSV('SPK')}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-700 transition"
                        title="Salin data siap Ctrl+V di spreadsheet"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Tabel</span>
                      </button>
                      <button
                        onClick={() => downloadSPKToCSV(spkList)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh CSV</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Tab: Panduan Pasang Google Apps Script */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  Cara Menghubungkan Google Sheets dalam 1 Menit:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-xs leading-relaxed">
                  <li>
                    Buka Google Sheets baru atau lembar kerja Ninos yang sudah ada di{' '}
                    <a
                      href="https://sheets.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold underline"
                    >
                      sheets.new
                    </a>.
                  </li>
                  <li>
                    Klik menu atas: <b>Ekstensi (Extensions) &rarr; Apps Script</b>.
                  </li>
                  <li>
                    Hapus kode bawaan di editor, lalu klik tombol <b>"Salin Seluruh Kode Script"</b> di bawah dan paste ke Apps Script.
                  </li>
                  <li>
                    Klik <b>Simpan (Ikon disket / Ctrl+S)</b>.
                  </li>
                  <li>
                    Klik tombol biru <b>Deploy (Terapkan) &rarr; New deployment (Deployment baru)</b>.
                  </li>
                  <li>
                    Pilih tipe gear: <b>Web app (Aplikasi Web)</b>.
                  </li>
                  <li>
                    Set <b>"Execute as: Me"</b> dan <b>"Who has access: Anyone"</b> (Sangat penting agar Ninos Design bisa mengirim data).
                  </li>
                  <li>
                    Klik <b>Deploy</b>, berikan izin Google Account Anda, lalu <b>salin Web App URL</b> yang dihasilkan dan paste di tab <b>Koneksi</b> aplikasi ini. Selesai!
                  </li>
                </ol>
              </div>

              {/* Code viewer & copy button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Kode Google Apps Script (Siap Pakai):
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                      copiedCode
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Kode Script'}</span>
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-[11px] text-emerald-400">
                  <pre className="whitespace-pre">{GOOGLE_APPS_SCRIPT_TEMPLATE}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Ninos Design &bull; Spreadsheet Integration Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
