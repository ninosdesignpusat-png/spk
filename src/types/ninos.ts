export interface KainItem {
  id: string;
  namaKain: string;
  warna: string;
  kodeWarna?: string;
  jumlahRoll: number;
  totalPanjang: number;
  satuan: 'Meter' | 'Yard' | 'Kg';
  estimasiPemakaianPerPcs: number;
  estimasiHasilPcs: number;
  realisasiHasilPcs: number;
  sisaBahan: number;
  afvalReject: number;
}

export interface SizeBreakdownRow {
  id: string;
  warna: string;
  sizes: {
    XS?: number;
    S?: number;
    M?: number;
    L?: number;
    XL?: number;
    XXL?: number;
    '3XL'?: number;
    AllSize?: number;
    [customKey: string]: number | undefined;
  };
  subtotal: number;
}

export interface AksesorisItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string; // 'Pcs' | 'Lusin' | 'Roll' | 'Meter' | 'Set' | 'Lembar'
  catatan?: string;
}

export type StatusSuratJalan = 'Draft' | 'Proses Potong' | 'Selesai Potong' | 'Sudah Terbit SPK';

export interface SuratJalanPotong {
  id: string;
  nomorSurat: string;
  tanggal: string;
  targetSelesai: string;
  pemotong: string;
  namaModel: string;
  kodeArtikel: string;
  kategori: string;
  daftarKain: KainItem[];
  breakdownSize: SizeBreakdownRow[];
  totalPcs: number;
  daftarAksesoris: AksesorisItem[];
  instruksiPotong: string;
  status: StatusSuratJalan;
  spkIdTerhubung?: string;
  penanggungJawabGudang: string;
  checkerQc: string;
  catatanKhusus?: string;
  createdAt: string;
  updatedAt: string;
  syncedToSheet?: boolean;
}

export interface SOPJahit {
  jarakJahitanSPI: string;
  tipeJahitan: string;
  posisiLabel: string;
  posisiAksesoris: string;
  standarFinishing: string;
  toleransiUkuran: string;
}

export type StatusSPK = 'Draft' | 'Bahan Diterima' | 'Sedang Jahit' | 'QC & Finishing' | 'Selesai';

export interface SPKProduksi {
  id: string;
  nomorSPK: string;
  suratJalanPotongId?: string;
  nomorSuratJalanPotong?: string;
  tanggalTerbit: string;
  targetSelesai: string;
  tipeProduksi: 'In-House' | 'CMT / Makloon';
  vendorCMT: string;
  picVendor: string;
  teleponVendor: string;
  namaModel: string;
  kodeArtikel: string;
  kategori: string;
  fotoModelUrl?: string;
  breakdownSize: SizeBreakdownRow[];
  totalPcs: number;
  totalLusin: number;
  ongkosJahitPerPcs: number;
  totalBiayaCMT: number;
  sopJahit: SOPJahit;
  status: StatusSPK;
  qcPassedQty?: number;
  qcRejectQty?: number;
  catatanProduksi?: string;
  productionManager: string;
  supervisorCMT: string;
  qcInspector: string;
  createdAt: string;
  updatedAt: string;
  syncedToSheet?: boolean;
}

export interface SpreadsheetSettings {
  webAppUrl: string;
  sheetNameSJP: string;
  sheetNameSPK: string;
  autoSync: boolean;
  lastSyncTime?: string;
  lastSyncStatus?: 'success' | 'error' | 'idle';
  lastSyncMessage?: string;
}

export interface VendorItem {
  id: string;
  nama: string;
  tipe: 'CMT' | 'Potong' | 'Finishing' | 'Bordir/Sablon';
  kontak: string;
  telepon: string;
  alamat: string;
  kapasitasPerBulan: number;
}

export interface ModelMaster {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  estimasiKonsumsiKain: number;
  fotoUrl?: string;
  sopDefault?: Partial<SOPJahit>;
}
