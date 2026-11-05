import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { SuratJalanPotongList } from './components/SuratJalanPotongList';
import { SPKProduksiList } from './components/SPKProduksiList';
import { SuratJalanPotongModal } from './components/SuratJalanPotongModal';
import { SPKProduksiModal } from './components/SPKProduksiModal';
import { PrintViewModal } from './components/PrintViewModal';
import { BundleTicketsModal } from './components/BundleTicketsModal';
import { SpreadsheetSyncModal } from './components/SpreadsheetSyncModal';
import { MasterDataView } from './components/MasterDataView';

import {
  SuratJalanPotong,
  SPKProduksi,
  SpreadsheetSettings,
  ModelMaster,
  VendorItem,
  StatusSPK,
} from './types/ninos';

import {
  INITIAL_MODELS,
  INITIAL_VENDORS,
  INITIAL_SURAT_JALAN,
  INITIAL_SPK,
  INITIAL_SPREADSHEET_SETTINGS,
} from './data/initialData';

import {
  syncToGoogleSheets,
  downloadSJPToCSV,
  downloadSPKToCSV,
  copyTableToClipboard,
} from './utils/spreadsheetSync';

const STORAGE_KEY_SJP = 'ninos_surat_jalan_list_v1';
const STORAGE_KEY_SPK = 'ninos_spk_list_v1';
const STORAGE_KEY_SHEETS = 'ninos_sheets_settings_v1';
const STORAGE_KEY_MODELS = 'ninos_models_v1';
const STORAGE_KEY_VENDORS = 'ninos_vendors_v1';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sjp' | 'spk' | 'master'>('dashboard');

  // Core Data States (Initialized from localStorage or default samples)
  const [suratJalanList, setSuratJalanList] = useState<SuratJalanPotong[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SJP);
    return saved ? JSON.parse(saved) : INITIAL_SURAT_JALAN;
  });

  const [spkList, setSpkList] = useState<SPKProduksi[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SPK);
    return saved ? JSON.parse(saved) : INITIAL_SPK;
  });

  const [spreadsheetSettings, setSpreadsheetSettings] = useState<SpreadsheetSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SHEETS);
    return saved ? JSON.parse(saved) : INITIAL_SPREADSHEET_SETTINGS;
  });

  const [models, setModels] = useState<ModelMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODELS);
    return saved ? JSON.parse(saved) : INITIAL_MODELS;
  });

  const [vendors, setVendors] = useState<VendorItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VENDORS);
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals States
  const [isSJPModalOpen, setIsSJPModalOpen] = useState(false);
  const [editingSJP, setEditingSJP] = useState<SuratJalanPotong | null>(null);

  const [isSPKModalOpen, setIsSPKModalOpen] = useState(false);
  const [editingSPK, setEditingSPK] = useState<SPKProduksi | null>(null);
  const [initialSJPForSPK, setInitialSJPForSPK] = useState<SuratJalanPotong | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocType, setPrintDocType] = useState<'SJP' | 'SPK'>('SPK');
  const [printSJPData, setPrintSJPData] = useState<SuratJalanPotong | null>(null);
  const [printSPKData, setPrintSPKData] = useState<SPKProduksi | null>(null);

  const [isBundleTicketsModalOpen, setIsBundleTicketsModalOpen] = useState(false);
  const [bundleSJP, setBundleSJP] = useState<SuratJalanPotong | null>(null);

  const [isSpreadsheetModalOpen, setIsSpreadsheetModalOpen] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SJP, JSON.stringify(suratJalanList));
  }, [suratJalanList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SPK, JSON.stringify(spkList));
  }, [spkList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(spreadsheetSettings));
  }, [spreadsheetSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(models));
  }, [models]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VENDORS, JSON.stringify(vendors));
  }, [vendors]);

  // SJP Actions
  const handleOpenNewSJP = () => {
    setEditingSJP(null);
    setIsSJPModalOpen(true);
  };

  const handleEditSJP = (sjp: SuratJalanPotong) => {
    setEditingSJP(sjp);
    setIsSJPModalOpen(true);
  };

  const handleDeleteSJP = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus Surat Jalan Potong ini?')) {
      setSuratJalanList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveSJP = (sjp: SuratJalanPotong, autoCreateSPK?: boolean) => {
    setSuratJalanList((prev) => {
      const idx = prev.findIndex((item) => item.id === sjp.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = sjp;
        return updated;
      }
      return [sjp, ...prev];
    });

    if (autoCreateSPK) {
      // Immediately open SPK Modal preloaded with this SJP data
      setTimeout(() => {
        setEditingSPK(null);
        setInitialSJPForSPK(sjp);
        setIsSPKModalOpen(true);
      }, 200);
    }
  };

  // Convert SJP to SPK directly
  const handleConvertSJPToSPK = (sjp: SuratJalanPotong) => {
    setEditingSPK(null);
    setInitialSJPForSPK(sjp);
    setIsSPKModalOpen(true);
  };

  // SPK Actions
  const handleOpenNewSPK = () => {
    setEditingSPK(null);
    setInitialSJPForSPK(null);
    setIsSPKModalOpen(true);
  };

  const handleEditSPK = (spk: SPKProduksi) => {
    setEditingSPK(spk);
    setInitialSJPForSPK(null);
    setIsSPKModalOpen(true);
  };

  const handleDeleteSPK = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus SPK Produksi ini?')) {
      setSpkList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveSPK = (spk: SPKProduksi) => {
    setSpkList((prev) => {
      const idx = prev.findIndex((item) => item.id === spk.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = spk;
        return updated;
      }
      return [spk, ...prev];
    });

    // If linked to SJP, update SJP status to 'Sudah Terbit SPK'
    if (spk.suratJalanPotongId) {
      setSuratJalanList((prev) =>
        prev.map((s) =>
          s.id === spk.suratJalanPotongId
            ? { ...s, status: 'Sudah Terbit SPK', spkIdTerhubung: spk.nomorSPK }
            : s
        )
      );
    }
  };

  const handleUpdateSPKStatus = (id: string, newStatus: StatusSPK) => {
    setSpkList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item))
    );
  };

  // Print Handlers
  const handlePrintSJP = (sjp: SuratJalanPotong) => {
    setDocumentToPrint('SJP', sjp, null);
  };

  const handlePrintSPK = (spk: SPKProduksi) => {
    setDocumentToPrint('SPK', null, spk);
  };

  const setDocumentToPrint = (
    type: 'SJP' | 'SPK',
    sjp: SuratJalanPotong | null,
    spk: SPKProduksi | null
  ) => {
    setPrintDocType(type);
    setPrintSJPData(sjp);
    setPrintSPKData(spk);
    setIsPrintModalOpen(true);
  };

  const handlePrintBundleTickets = (sjp: SuratJalanPotong) => {
    setBundleSJP(sjp);
    setIsBundleTicketsModalOpen(true);
  };

  // Quick Sync to Google Sheets
  const handleQuickSync = async () => {
    if (!spreadsheetSettings.webAppUrl?.trim()) {
      setIsSpreadsheetModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      const res = await syncToGoogleSheets(
        spreadsheetSettings.webAppUrl,
        suratJalanList,
        spkList
      );
      setIsSyncing(false);
      setSpreadsheetSettings((prev) => ({
        ...prev,
        lastSyncTime: new Date().toISOString(),
        lastSyncStatus: 'success',
        lastSyncMessage: res.message,
      }));
      alert(res.message || 'Sinkronisasi ke Google Sheets berhasil!');
    } catch (err: any) {
      setIsSyncing(false);
      setSpreadsheetSettings((prev) => ({
        ...prev,
        lastSyncStatus: 'error',
        lastSyncMessage: err.message,
      }));
      alert(`Gagal sync ke Google Sheets: ${err.message}`);
    }
  };

  // Export CSV
  const handleExportSJPCSV = () => {
    downloadSJPToCSV(suratJalanList);
  };

  const handleExportSPKCSV = () => {
    downloadSPKToCSV(spkList);
  };

  // Copy Tabular
  const handleCopyTable = async (type: 'SJP' | 'SPK') => {
    const success = await copyTableToClipboard(type, type === 'SJP' ? suratJalanList : spkList);
    if (success) {
      alert(`Data ${type} berhasil disalin! Silakan buka Google Sheets atau Excel dan tekan Ctrl+V.`);
    } else {
      alert('Gagal menyalin ke clipboard.');
    }
  };

  // Backup & Restore
  const handleExportBackupJSON = () => {
    const backupData = {
      suratJalanList,
      spkList,
      spreadsheetSettings,
      models,
      vendors,
      backupDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_Ninos_Design_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.suratJalanList) setSuratJalanList(json.suratJalanList);
        if (json.spkList) setSpkList(json.spkList);
        if (json.spreadsheetSettings) setSpreadsheetSettings(json.spreadsheetSettings);
        if (json.models) setModels(json.models);
        if (json.vendors) setVendors(json.vendors);
        alert('Data berhasil dipulihkan dari file backup!');
      } catch (err: any) {
        alert('File backup tidak valid: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sjpCount={suratJalanList.length}
        spkCount={spkList.length}
        spreadsheetSettings={spreadsheetSettings}
        onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
        onNewSJP={handleOpenNewSJP}
        onNewSPK={handleOpenNewSPK}
        isSyncing={isSyncing}
        onQuickSync={handleQuickSync}
      />

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            suratJalanList={suratJalanList}
            spkList={spkList}
            spreadsheetSettings={spreadsheetSettings}
            onNavigateToSJP={() => setActiveTab('sjp')}
            onNavigateToSPK={() => setActiveTab('spk')}
            onNewSJP={handleOpenNewSJP}
            onNewSPK={handleOpenNewSPK}
            onPrintSJP={handlePrintSJP}
            onPrintSPK={handlePrintSPK}
            onConvertSJPToSPK={handleConvertSJPToSPK}
            onOpenSpreadsheetModal={() => setIsSpreadsheetModalOpen(true)}
            onQuickSync={handleQuickSync}
            isSyncing={isSyncing}
            onExportSJPCSV={handleExportSJPCSV}
            onExportSPKCSV={handleExportSPKCSV}
          />
        )}

        {activeTab === 'sjp' && (
          <SuratJalanPotongList
            suratJalanList={suratJalanList}
            onNewSJP={handleOpenNewSJP}
            onEditSJP={handleEditSJP}
            onDeleteSJP={handleDeleteSJP}
            onPrintSJP={handlePrintSJP}
            onPrintBundleTickets={handlePrintBundleTickets}
            onConvertSJPToSPK={handleConvertSJPToSPK}
            onExportCSV={handleExportSJPCSV}
            onCopyTable={() => handleCopyTable('SJP')}
          />
        )}

        {activeTab === 'spk' && (
          <SPKProduksiList
            spkList={spkList}
            onNewSPK={handleOpenNewSPK}
            onEditSPK={handleEditSPK}
            onDeleteSPK={handleDeleteSPK}
            onPrintSPK={handlePrintSPK}
            onUpdateStatus={handleUpdateSPKStatus}
            onExportCSV={handleExportSPKCSV}
            onCopyTable={() => handleCopyTable('SPK')}
          />
        )}

        {activeTab === 'master' && (
          <MasterDataView
            models={models}
            setModels={setModels}
            vendors={vendors}
            setVendors={setVendors}
            onExportBackupJSON={handleExportBackupJSON}
            onImportBackupJSON={handleImportBackupJSON}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-serif-brand">NINOS DESIGN</span>
            <span>&bull;</span>
            <span>Sistem Surat Jalan Potong & SPK Produksi</span>
          </div>
          <div>
            Koneksi Google Sheets &bull; Cetak A4 Presisi &bull; Tiket Bundel Potongan
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Modal Create / Edit Surat Jalan Potong */}
      <SuratJalanPotongModal
        isOpen={isSJPModalOpen}
        onClose={() => setIsSJPModalOpen(false)}
        onSave={handleSaveSJP}
        editingSJP={editingSJP}
        vendors={vendors}
        models={models}
        existingSJPCount={suratJalanList.length}
      />

      {/* 2. Modal Create / Edit SPK Produksi */}
      <SPKProduksiModal
        isOpen={isSPKModalOpen}
        onClose={() => setIsSPKModalOpen(false)}
        onSave={handleSaveSPK}
        editingSPK={editingSPK}
        initialFromSJP={initialSJPForSPK}
        suratJalanList={suratJalanList}
        vendors={vendors}
        models={models}
        existingSPKCount={spkList.length}
      />

      {/* 3. Modal Print & Download SPK / SJP */}
      <PrintViewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        documentType={printDocType}
        sjpData={printSJPData}
        spkData={printSPKData}
      />

      {/* 4. Modal Bundle Tickets */}
      <BundleTicketsModal
        isOpen={isBundleTicketsModalOpen}
        onClose={() => setIsBundleTicketsModalOpen(false)}
        sjp={bundleSJP}
      />

      {/* 5. Modal Google Sheets Integration */}
      <SpreadsheetSyncModal
        isOpen={isSpreadsheetModalOpen}
        onClose={() => setIsSpreadsheetModalOpen(false)}
        settings={spreadsheetSettings}
        onSaveSettings={setSpreadsheetSettings}
        suratJalanList={suratJalanList}
        spkList={spkList}
        onSyncCompleted={(success, msg) => {
          setSpreadsheetSettings((prev) => ({
            ...prev,
            lastSyncTime: new Date().toISOString(),
            lastSyncStatus: success ? 'success' : 'error',
            lastSyncMessage: msg,
          }));
        }}
      />
    </div>
  );
}

export default App;
