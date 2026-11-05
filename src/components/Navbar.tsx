import React from 'react';
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
  Building2,
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

  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-900 via-rose-800 to-amber-700 flex items-center justify-center shadow-md shadow-rose-900/20 overflow-hidden ring-1 ring-rose-900/30">
                <img
                  src="/logo.png"
                  alt="Ninos Design"
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => {
                    // Fallback to stylized text if image missing
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-white font-serif font-black text-lg tracking-wider">N</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 font-serif-brand">
                    NINOS DESIGN
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200/70">
                    Garment & CMT
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Sistem Surat Jalan Potong & SPK Produksi
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-rose-900 shadow-xs shadow-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('sjp')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sjp'
                  ? 'bg-white text-rose-900 shadow-xs shadow-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Surat Jalan Potong</span>
              <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {sjpCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('spk')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'spk'
                  ? 'bg-white text-rose-900 shadow-xs shadow-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>SPK Produksi</span>
              <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                {spkCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'master'
                  ? 'bg-white text-rose-900 shadow-xs shadow-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data Master</span>
            </button>
          </nav>

          {/* Action Area & Spreadsheet Status */}
          <div className="flex items-center gap-2">
            {/* Google Sheets Trigger */}
            <div className="flex items-center">
              <button
                onClick={onOpenSpreadsheetModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSheetConfigured
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
                title="Kelola Koneksi Google Sheets"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Spreadsheet</span>
                {isSheetConfigured ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 ml-0.5" />
                )}
              </button>

              {isSheetConfigured && (
                <button
                  onClick={onQuickSync}
                  disabled={isSyncing}
                  className="ml-1 p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                  title="Sinkron Cepat ke Google Sheets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              )}
            </div>

            {/* Quick Actions Dropdown / Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onNewSJP}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ SJP Potong</span>
                <span className="sm:hidden">+ SJP</span>
              </button>

              <button
                onClick={onNewSPK}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-900 text-white hover:bg-rose-800 shadow-xs shadow-rose-900/20 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+ SPK Produksi</span>
                <span className="sm:hidden">+ SPK</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Submenu Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50/90 px-2 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeTab === 'dashboard' ? 'bg-white text-rose-900 font-bold shadow-xs' : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('sjp')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeTab === 'sjp' ? 'bg-white text-rose-900 font-bold shadow-xs' : 'text-slate-600'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>SJP ({sjpCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('spk')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeTab === 'spk' ? 'bg-white text-rose-900 font-bold shadow-xs' : 'text-slate-600'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>SPK ({spkCount})</span>
        </button>
        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md ${
            activeTab === 'master' ? 'bg-white text-rose-900 font-bold shadow-xs' : 'text-slate-600'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Master</span>
        </button>
      </div>
    </header>
  );
};
