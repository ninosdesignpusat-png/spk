import React, { useState } from 'react';
import {
  Scissors,
  FileText,
  LayoutDashboard,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import { SpreadsheetSettings } from '../types/ninos';

interface NavbarProps {
  activeTab: 'dashboard' | 'sjp' | 'spk' | 'master';
  setActiveTab: (tab: 'dashboard' | 'sjp' | 'spk' | 'master') => void;
  sjpCount: number;
  spkCount: number;
  spreadsheetSettings: SpreadsheetSettings;
  onOpenSpreadsheetModal: () => void;
  onNewSJP: () => void;
  onNewSPK: () => void;
  isSyncing: boolean;
  onQuickSync: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  sjpCount,
  spkCount,
  spreadsheetSettings,
  onOpenSpreadsheetModal,
  onNewSJP,
  onNewSPK,
  isSyncing,
  onQuickSync,
}) => {
  const isSheetConfigured = Boolean(spreadsheetSettings.webAppUrl?.trim());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header */}
      <header className="no-print sticky top-0 z-40 bg-slate-950 text-white border-b border-amber-900/30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none active:scale-98 transition-transform"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-12 h-11 rounded-xl bg-gradient-to-b from-slate-900 to-black p-1 flex items-center justify-center border border-amber-500/40 shadow-sm shadow-amber-950/40">
                <img
                  src="/logo.png"
                  alt="Nino's Design Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-wider text-amber-300 font-serif-brand">
                    NINO'S DESIGN
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    GARMENT
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium leading-none mt-0.5">
                  Surat Jalan Potong & SPK Produksi
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('sjp')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'sjp'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Surat Jalan Potong</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'sjp' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                  {sjpCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('spk')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'spk'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>SPK Produksi</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'spk' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                  {spkCount}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('master')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'master'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Data Master</span>
              </button>
            </nav>

            {/* Action Area & Spreadsheet Quick Sync */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Spreadsheet button */}
              <div className="flex items-center">
                <button
                  onClick={onOpenSpreadsheetModal}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSheetConfigured
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/80'
                      : 'bg-amber-950/80 text-amber-300 border-amber-600/50 hover:bg-amber-900/80'
                  }`}
                  title="Koneksi Google Sheets"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span className="hidden lg:inline">Spreadsheet</span>
                  {isSheetConfigured ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </button>

                {isSheetConfigured && (
                  <button
                    onClick={onQuickSync}
                    disabled={isSyncing}
                    className="ml-1 p-1.5 rounded-lg border border-emerald-700/60 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 disabled:opacity-50 transition"
                    title="Sinkronkan Sekarang"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                )}
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onNewSJP}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 shadow-xs transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-300" />
                  <span>+ SJP Potong</span>
                </button>

                <button
                  onClick={onNewSPK}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-950/50 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-950" />
                  <span>+ SPK Jahit</span>
                </button>
              </div>

              {/* Mobile Quick Add Menu Button */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold active:scale-95 transition"
                  title="Menu Cepat Tambah"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Popover */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-800 bg-slate-900 p-3 space-y-2 animate-in slide-in-from-top-2 duration-150 shadow-xl">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
              Buat Dokumen Baru Cepat:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNewSJP();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 text-white font-bold text-xs border border-slate-700 active:scale-95"
              >
                <Scissors className="w-4 h-4 text-amber-400" />
                <span>+ Surat Jalan Potong</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNewSPK();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>+ SPK Produksi</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE STICKY BOTTOM BAR (iOS / Android App Navigation Style) */}
      <div className="no-print sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 safe-area-bottom shadow-2xl">
        <div className="flex items-center justify-around h-14 px-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Beranda</span>
          </button>

          <button
            onClick={() => setActiveTab('sjp')}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
              activeTab === 'sjp' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">SJP Potong</span>
            {sjpCount > 0 && (
              <span className="absolute top-1 right-3 text-[9px] font-bold px-1 rounded-full bg-rose-600 text-white">
                {sjpCount}
              </span>
            )}
          </button>

          {/* Prominent Center Add Button on Mobile */}
          <button
            onClick={onNewSJP}
            className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 w-11 h-11 rounded-full shadow-lg shadow-amber-950/60 border-2 border-slate-950 active:scale-95 transition"
            title="Buat SJP Cepat"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveTab('spk')}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-all ${
              activeTab === 'spk' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">SPK Jahit</span>
            {spkCount > 0 && (
              <span className="absolute top-1 right-3 text-[9px] font-bold px-1 rounded-full bg-emerald-600 text-white">
                {spkCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('master')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeTab === 'master' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Master</span>
          </button>
        </div>
      </div>
    </>
  );
};
