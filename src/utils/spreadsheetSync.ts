import { SuratJalanPotong, SPKProduksi } from '../types/ninos';

export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * ==============================================================
 * NINOS DESIGN - GOOGLE APPS SCRIPT CONNECTOR
 * Sistem Sinkronisasi Otomatis Surat Jalan Potong & SPK Produksi
 * ==============================================================
 * Petunjuk Pasang:
 * 1. Di Google Sheets Anda, klik menu "Ekstensi" > "Apps Script" (Extensions > Apps Script).
 * 2. Hapus semua kode default di Code.gs, lalu paste seluruh kode ini.
 * 3. Klik tombol "Simpan" (ikon disket / Ctrl+S).
 * 4. Klik tombol biru "Deploy" (Terapkan) > "New deployment" (Deployment baru).
 * 5. Pilih jenis "Web app" (Aplikasi Web).
 * 6. Set "Execute as" : "Me" (Saya).
 * 7. Set "Who has access" : "Anyone" (Siapa saja). -> PENTING agar web app Ninos Design bisa sync!
 * 8. Klik "Deploy", lalu Berikan Izin Akun Google (Authorize Access).
 * 9. Salin URL Aplikasi Web (Web App URL) yang dihasilkan, dan paste di aplikasi Ninos Design!
 */

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'ping';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'ping') {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Koneksi Google Sheets Ninos Design Berhasil Aktif!',
      sheetName: ss.getName(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Ninos Design Spreadsheet Webhook Ready'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawData = e.postData ? e.postData.contents : null;
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Tidak ada data POST yang diterima.'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(rawData);
    var action = payload.action || 'SYNC_ALL';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var result = {
      success: true,
      action: action,
      syncedSJP: 0,
      syncedSPK: 0,
      timestamp: new Date().toISOString()
    };

    if (action === 'PING') {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Ping sukses terhubung ke Google Sheets: ' + ss.getName()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 1. Sync Surat Jalan Potong
    if (payload.suratJalan && Array.isArray(payload.suratJalan)) {
      result.syncedSJP = syncSuratJalanSheet(ss, payload.suratJalan);
    }

    // 2. Sync SPK Produksi
    if (payload.spk && Array.isArray(payload.spk)) {
      result.syncedSPK = syncSPKSheet(ss, payload.spk);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Sinkronisasi berhasil! ' + result.syncedSJP + ' Surat Jalan Potong dan ' + result.syncedSPK + ' SPK Produksi diperbarui di Google Sheets.',
      details: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerColor || '#831843'); // Maroon Ninos
    headerRange.setFontColor('#FFFFFF');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function syncSuratJalanSheet(ss, sjpList) {
  var headers = [
    'No. Surat Jalan',
    'Tanggal Potong',
    'Target Selesai',
    'Status',
    'Model / Artikel',
    'Kode Artikel',
    'Kategori',
    'Pemotong / Meja',
    'Rincian Kain & Warna',
    'Total Potong (Pcs)',
    'Rincian Size (S/M/L/XL/XXL)',
    'Aksesoris Disertakan',
    'No. SPK Terhubung',
    'PIC Gudang',
    'Checker QC',
    'Catatan / Instruksi',
    'Terakhir Diperbarui'
  ];

  var sheet = getOrCreateSheet(ss, 'Surat_Jalan_Potong', headers, '#831843');
  var data = sheet.getDataRange().getValues();
  var idColIndex = 0; // No. Surat Jalan di kolom 1 (index 0)

  // Map no surat jalan to row index
  var rowMap = {};
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][idColIndex]).trim();
    if (id) rowMap[id] = i + 1; // 1-based row index
  }

  var count = 0;
  for (var j = 0; j < sjpList.length; j++) {
    var item = sjpList[j];
    var kainSummary = (item.daftarKain || []).map(function(k) {
      return k.namaKain + ' (' + k.warna + ': ' + k.totalPanjang + ' ' + k.satuan + ', Realisasi: ' + k.realisasiHasilPcs + ' pcs)';
    }).join('; ');

    var sizeSummary = (item.breakdownSize || []).map(function(b) {
      var szStr = [];
      for (var key in (b.sizes || {})) {
        if (b.sizes[key]) szStr.push(key + ':' + b.sizes[key]);
      }
      return b.warna + ' [' + szStr.join(', ') + ' = ' + b.subtotal + ' pcs]';
    }).join('; ');

    var aksesorisSummary = (item.daftarAksesoris || []).map(function(a) {
      return a.nama + ' (' + a.jumlah + ' ' + a.satuan + ')';
    }).join('; ');

    var rowValues = [
      item.nomorSurat || '',
      item.tanggal || '',
      item.targetSelesai || '',
      item.status || '',
      item.namaModel || '',
      item.kodeArtikel || '',
      item.kategori || '',
      item.pemotong || '',
      kainSummary,
      item.totalPcs || 0,
      sizeSummary,
      aksesorisSummary,
      item.spkIdTerhubung || '-',
      item.penanggungJawabGudang || '',
      item.checkerQc || '',
      item.instruksiPotong || '',
      new Date().toLocaleString('id-ID')
    ];

    var existingRow = rowMap[String(item.nomorSurat).trim()];
    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
      rowMap[String(item.nomorSurat).trim()] = sheet.getLastRow();
    }
    count++;
  }

  return count;
}

function syncSPKSheet(ss, spkList) {
  var headers = [
    'No. SPK Produksi',
    'No. Surat Jalan Potong',
    'Tanggal Terbit',
    'Target Selesai (Deadline)',
    'Status Produksi',
    'Tipe Produksi',
    'Vendor CMT / Penjahit',
    'Kontak Vendor',
    'Model / Artikel',
    'Kode Artikel',
    'Total Produksi (Pcs)',
    'Total Lusin',
    'Ongkos CMT / Pcs (Rp)',
    'Total Biaya CMT (Rp)',
    'Rincian Size (Matrix)',
    'SPI & Tipe Jahitan',
    'Standar Finishing',
    'Manager Produksi',
    'QC Inspector',
    'Catatan Khusus',
    'Terakhir Diperbarui'
  ];

  var sheet = getOrCreateSheet(ss, 'SPK_Produksi', headers, '#065F46'); // Emerald Green
  var data = sheet.getDataRange().getValues();
  var idColIndex = 0; // No. SPK di kolom 1 (index 0)

  var rowMap = {};
  for (var i = 1; i < data.length; i++) {
    var id = String(data[i][idColIndex]).trim();
    if (id) rowMap[id] = i + 1;
  }

  var count = 0;
  for (var j = 0; j < spkList.length; j++) {
    var item = spkList[j];
    var sizeSummary = (item.breakdownSize || []).map(function(b) {
      var szStr = [];
      for (var key in (b.sizes || {})) {
        if (b.sizes[key]) szStr.push(key + ':' + b.sizes[key]);
      }
      return b.warna + ' [' + szStr.join(', ') + ' = ' + b.subtotal + ' pcs]';
    }).join('; ');

    var rowValues = [
      item.nomorSPK || '',
      item.nomorSuratJalanPotong || item.suratJalanPotongId || '-',
      item.tanggalTerbit || '',
      item.targetSelesai || '',
      item.status || '',
      item.tipeProduksi || '',
      item.vendorCMT || '',
      (item.picVendor ? item.picVendor + ' (' + item.teleponVendor + ')' : item.teleponVendor) || '',
      item.namaModel || '',
      item.kodeArtikel || '',
      item.totalPcs || 0,
      item.totalLusin || 0,
      item.ongkosJahitPerPcs || 0,
      item.totalBiayaCMT || 0,
      sizeSummary,
      (item.sopJahit ? item.sopJahit.jarakJahitanSPI + ' | ' + item.sopJahit.tipeJahitan : ''),
      (item.sopJahit ? item.sopJahit.standarFinishing : ''),
      item.productionManager || '',
      item.qcInspector || '',
      item.catatanProduksi || '',
      new Date().toLocaleString('id-ID')
    ];

    var existingRow = rowMap[String(item.nomorSPK).trim()];
    if (existingRow) {
      sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    } else {
      sheet.appendRow(rowValues);
      rowMap[String(item.nomorSPK).trim()] = sheet.getLastRow();
    }
    count++;
  }

  return count;
}
`;

/**
 * Sends Surat Jalan Potong & SPK Produksi data to Google Sheets via Web App
 */
export async function syncToGoogleSheets(
  webAppUrl: string,
  suratJalan: SuratJalanPotong[],
  spk: SPKProduksi[]
): Promise<{ success: boolean; message: string; details?: any }> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    throw new Error('Masukkan URL Web App Google Apps Script yang valid.');
  }

  const payload = {
    action: 'SYNC_ALL',
    suratJalan,
    spk,
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. First attempt: Direct fetch
    const response = await fetch(webAppUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return {
          success: true,
          message: 'Data berhasil terkirim ke Google Sheets (Response diterima).',
        };
      }
    }
  } catch (_directErr) {
    // Fallback: try proxying through backend
    try {
      const proxyRes = await fetch('/api/sheets/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: webAppUrl.trim(),
          payload,
        }),
      });

      if (proxyRes.ok) {
        const pJson = await proxyRes.json();
        return pJson;
      }
    } catch {
      // Ignore proxy error and throw general error below
    }

    throw new Error(
      'Gagal menyambung ke Google Sheets. Pastikan Web App disetting "Who has access: Anyone" dan deployment aktif.'
    );
  }

  return {
    success: true,
    message: 'Data berhasil disinkronkan ke Google Sheets.',
  };
}

/**
 * Test connectivity to Google Sheets Web App
 */
export async function testGoogleSheetsPing(webAppUrl: string): Promise<{ success: boolean; message: string }> {
  if (!webAppUrl || !webAppUrl.trim().startsWith('http')) {
    return { success: false, message: 'URL Web App tidak valid.' };
  }

  try {
    const url = new URL(webAppUrl.trim());
    url.searchParams.set('action', 'ping');
    url.searchParams.set('_t', Date.now().toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });

    if (!response.ok) {
      return { success: false, message: `Server merespon dengan status ${response.status}` };
    }

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return {
        success: true,
        message: data.message || `Terhubung ke Google Sheets (${data.sheetName || 'Aktif'})`,
      };
    } catch {
      return { success: true, message: 'Terhubung ke Google Apps Script!' };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Koneksi gagal: ${err.message || 'Cek kembali URL Apps Script'}. Pastikan akses diset ke "Anyone".`,
    };
  }
}

/**
 * Download Surat Jalan Potong as CSV (Excel & Google Sheets compatible with UTF-8 BOM)
 */
export function downloadSJPToCSV(suratJalanList: SuratJalanPotong[]) {
  const headers = [
    'No Surat Jalan',
    'Tanggal Potong',
    'Target Selesai',
    'Status',
    'Model / Artikel',
    'Kode Artikel',
    'Kategori',
    'Pemotong',
    'Total Potong (Pcs)',
    'Rincian Bahan Kain',
    'Rincian Ukuran',
    'Daftar Aksesoris',
    'No SPK Terhubung',
    'PIC Gudang',
    'Checker QC',
    'Instruksi Potong',
  ];

  const rows = suratJalanList.map((sjp) => {
    const kainSummary = sjp.daftarKain
      .map((k) => `${k.namaKain} [${k.warna}: ${k.totalPanjang} ${k.satuan}, Hasil: ${k.realisasiHasilPcs} pcs]`)
      .join(' | ');

    const sizeSummary = sjp.breakdownSize
      .map((b) => {
        const parts = Object.entries(b.sizes)
          .filter(([_, qty]) => Number(qty) > 0)
          .map(([sz, qty]) => `${sz}:${qty}`);
        return `${b.warna} (${parts.join(', ')}) = ${b.subtotal} pcs`;
      })
      .join(' | ');

    const aksesorisSummary = sjp.daftarAksesoris.map((a) => `${a.nama} (${a.jumlah} ${a.satuan})`).join(' | ');

    return [
      `"${sjp.nomorSurat}"`,
      `"${sjp.tanggal}"`,
      `"${sjp.targetSelesai}"`,
      `"${sjp.status}"`,
      `"${sjp.namaModel}"`,
      `"${sjp.kodeArtikel}"`,
      `"${sjp.kategori}"`,
      `"${sjp.pemotong}"`,
      sjp.totalPcs,
      `"${kainSummary.replace(/"/g, '""')}"`,
      `"${sizeSummary.replace(/"/g, '""')}"`,
      `"${aksesorisSummary.replace(/"/g, '""')}"`,
      `"${sjp.spkIdTerhubung || '-'}"`,
      `"${sjp.penanggungJawabGudang}"`,
      `"${sjp.checkerQc}"`,
      `"${(sjp.instruksiPotong || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Surat_Jalan_Potong_Ninos_Design_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download SPK Produksi as CSV
 */
export function downloadSPKToCSV(spkList: SPKProduksi[]) {
  const headers = [
    'No SPK Produksi',
    'No Surat Jalan Potong',
    'Tanggal Terbit',
    'Target Selesai (Deadline)',
    'Status Produksi',
    'Tipe Produksi',
    'Vendor CMT / Penjahit',
    'Kontak Vendor',
    'Model / Artikel',
    'Kode Artikel',
    'Kategori',
    'Total Produksi (Pcs)',
    'Total Lusin',
    'Ongkos CMT Per Pcs (Rp)',
    'Total Biaya CMT (Rp)',
    'Rincian Ukuran & Warna',
    'Standar Jahit (SPI)',
    'Standar Finishing',
    'Manager Produksi',
    'QC Inspector',
    'Catatan Khusus',
  ];

  const rows = spkList.map((spk) => {
    const sizeSummary = spk.breakdownSize
      .map((b) => {
        const parts = Object.entries(b.sizes)
          .filter(([_, qty]) => Number(qty) > 0)
          .map(([sz, qty]) => `${sz}:${qty}`);
        return `${b.warna} (${parts.join(', ')}) = ${b.subtotal} pcs`;
      })
      .join(' | ');

    return [
      `"${spk.nomorSPK}"`,
      `"${spk.nomorSuratJalanPotong || spk.suratJalanPotongId || '-'}"`,
      `"${spk.tanggalTerbit}"`,
      `"${spk.targetSelesai}"`,
      `"${spk.status}"`,
      `"${spk.tipeProduksi}"`,
      `"${spk.vendorCMT}"`,
      `"${spk.picVendor ? `${spk.picVendor} (${spk.teleponVendor})` : spk.teleponVendor}"`,
      `"${spk.namaModel}"`,
      `"${spk.kodeArtikel}"`,
      `"${spk.kategori}"`,
      spk.totalPcs,
      spk.totalLusin,
      spk.ongkosJahitPerPcs,
      spk.totalBiayaCMT,
      `"${sizeSummary.replace(/"/g, '""')}"`,
      `"${(spk.sopJahit?.jarakJahitanSPI || '').replace(/"/g, '""')}"`,
      `"${(spk.sopJahit?.standarFinishing || '').replace(/"/g, '""')}"`,
      `"${spk.productionManager}"`,
      `"${spk.qcInspector}"`,
      `"${(spk.catatanProduksi || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SPK_Produksi_Ninos_Design_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy SJP or SPK table to clipboard in Tab-Separated Values (TSV) format
 * allowing instant Ctrl+V into Google Sheets or Excel without downloading files
 */
export async function copyTableToClipboard(type: 'SJP' | 'SPK', data: any[]): Promise<boolean> {
  let text = '';
  if (type === 'SJP') {
    const headers = ['No Surat Jalan', 'Tanggal', 'Target Selesai', 'Model', 'Kode', 'Kategori', 'Pemotong', 'Total Pcs', 'Status'];
    const rows = data.map((d: SuratJalanPotong) => [
      d.nomorSurat,
      d.tanggal,
      d.targetSelesai,
      d.namaModel,
      d.kodeArtikel,
      d.kategori,
      d.pemotong,
      d.totalPcs,
      d.status,
    ]);
    text = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  } else {
    const headers = ['No SPK', 'No SJP', 'Tanggal', 'Deadline', 'Model', 'Vendor CMT', 'Total Pcs', 'Total Lusin', 'Ongkos/Pcs', 'Total Biaya', 'Status'];
    const rows = data.map((d: SPKProduksi) => [
      d.nomorSPK,
      d.nomorSuratJalanPotong || '-',
      d.tanggalTerbit,
      d.targetSelesai,
      d.namaModel,
      d.vendorCMT,
      d.totalPcs,
      d.totalLusin,
      d.ongkosJahitPerPcs,
      d.totalBiayaCMT,
      d.status,
    ]);
    text = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
