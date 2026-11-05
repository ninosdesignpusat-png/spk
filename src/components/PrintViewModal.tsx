import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  CheckCircle,
  Eye,
  EyeOff,
  Building2,
  Calendar,
  Layers,
  Scissors,
  FileText,
} from 'lucide-react';
import { SuratJalanPotong, SPKProduksi } from '../types/ninos';
import {
  formatRupiah,
  formatDateIndo,
  generateBarcodeSvg,
  generateQrCodeSvg,
  triggerPrintWindow,
} from '../utils/printHelpers';

interface PrintViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'SJP' | 'SPK';
  sjpData?: SuratJalanPotong | null;
  spkData?: SPKProduksi | null;
}

export const PrintViewModal: React.FC<PrintViewModalProps> = ({
  isOpen,
  onClose,
  documentType,
  sjpData,
  spkData,
}) => {
  const [showCMTCost, setShowCMTCost] = useState(true);

  if (!isOpen) return null;

  const isSJP = documentType === 'SJP' && sjpData;
  const isSPK = documentType === 'SPK' && spkData;

  const docNumber = isSJP ? sjpData.nomorSurat : isSPK ? spkData.nomorSPK : 'DOC-000';
  const barcodeSvg = generateBarcodeSvg(docNumber);
  const qrSvg = generateQrCodeSvg(docNumber);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* Container */}
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Modal Controls Toolbar (Hidden when printing via CSS @media print) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-sm tracking-wide">
              Pratinjau Cetak {isSJP ? 'Surat Jalan Potong' : 'SPK Produksi'}
            </span>
            <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
              {docNumber}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isSPK && (
              <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showCMTCost}
                  onChange={(e) => setShowCMTCost(e.target.checked)}
                  className="rounded border-slate-700 text-rose-600 focus:ring-0"
                />
                <span>Tampilkan Biaya / Ongkos CMT</span>
              </label>
            )}

            <button
              onClick={triggerPrintWindow}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-950/30 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Simulates A4 Sheet) */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div className="print-container bg-white w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-10 shadow-lg border border-slate-300 text-slate-900 text-xs font-sans print:shadow-none print:border-none print:p-0">
            {/* KOP SURAT RESMI NINO'S DESIGN */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-xl bg-slate-950 p-1 flex items-center justify-center border border-amber-600/40 shadow-sm shrink-0">
                  <img
                    src="/logo.png"
                    alt="NINO'S DESIGN"
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black font-serif-brand tracking-widest text-slate-900 uppercase">
                    NINO'S DESIGN
                  </h1>
                  <p className="text-[11px] font-bold text-amber-800 tracking-wider uppercase">
                    Modest Fashion & Garment Manufacturing
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
                    Workshop & Konveksi: Jl. Raya Industri Garment No. 88, Jawa Tengah<br />
                    WhatsApp Hotline: 0812-3456-7890 | Email: produksi@ninosdesign.com
                  </p>
                </div>
              </div>

              {/* Barcode & Document Type Badge */}
              <div className="text-right flex flex-col items-end">
                <div
                  dangerouslySetInnerHTML={{ __html: barcodeSvg }}
                  className="mb-1"
                />
                <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                  {docNumber}
                </span>
                <span className="text-[9px] text-slate-400 uppercase mt-0.5">
                  Dicetak: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* DOCUMENT TITLE */}
            <div className="text-center my-3">
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900 font-serif-brand underline decoration-2 decoration-rose-900 underline-offset-4">
                {isSJP ? 'SURAT JALAN POTONG BAHAN (SJP)' : 'SURAT PERINTAH KERJA (SPK) PRODUKSI'}
              </h2>
              <span className="text-[11px] font-semibold text-slate-600">
                {isSJP
                  ? 'Dokumen Penyerahan Bahan Baku & Instruksi Pemotongan Kain'
                  : `Penugasan Produksi Jahit CMT (${spkData?.tipeProduksi || 'Makloon'})`}
              </span>
            </div>

            {/* HEADER DATA BOX */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-300 rounded-lg mb-4 text-[11px]">
              {isSJP && (
                <>
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Nomor Surat Jalan:</span>
                      <span className="font-mono font-bold text-slate-900">{sjpData.nomorSurat}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Model / Desain:</span>
                      <span className="font-bold text-slate-900">{sjpData.namaModel}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Kode Artikel:</span>
                      <span className="font-mono text-slate-800">{sjpData.kodeArtikel} ({sjpData.kategori})</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Tukang / Meja Potong:</span>
                      <span className="font-bold text-slate-900">{sjpData.pemotong}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Tanggal Potong:</span>
                      <span className="font-semibold text-slate-800">{formatDateIndo(sjpData.tanggal)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Target Selesai:</span>
                      <span className="font-bold text-rose-900">{formatDateIndo(sjpData.targetSelesai)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Total Hasil Potong:</span>
                      <span className="font-black text-rose-900 text-sm">{sjpData.totalPcs} Pcs</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Status Dokumen:</span>
                      <span className="font-bold uppercase text-slate-800">{sjpData.status}</span>
                    </div>
                  </div>
                </>
              )}

              {isSPK && (
                <>
                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Nomor SPK:</span>
                      <span className="font-mono font-bold text-slate-900">{spkData.nomorSPK}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Ref. No SJP Potong:</span>
                      <span className="font-mono text-slate-800">
                        {spkData.nomorSuratJalanPotong || spkData.suratJalanPotongId || '-'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Model / Desain:</span>
                      <span className="font-bold text-slate-900">{spkData.namaModel}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Kode Artikel:</span>
                      <span className="font-mono text-slate-800">{spkData.kodeArtikel} ({spkData.kategori})</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Vendor CMT / Penjahit:</span>
                      <span className="font-bold text-slate-900">
                        {spkData.vendorCMT} {spkData.picVendor ? `(PIC: ${spkData.picVendor})` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Tanggal Terbit SPK:</span>
                      <span className="font-semibold text-slate-800">{formatDateIndo(spkData.tanggalTerbit)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Deadline Penyerahan:</span>
                      <span className="font-black text-rose-900">{formatDateIndo(spkData.targetSelesai)}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 text-slate-500 font-medium">Total Qty Target:</span>
                      <span className="font-black text-emerald-900 text-sm">
                        {spkData.totalPcs} Pcs ({spkData.totalLusin} Lusin)
                      </span>
                    </div>
                    {showCMTCost && (
                      <div className="flex">
                        <span className="w-32 text-slate-500 font-medium">Ongkos CMT / Total:</span>
                        <span className="font-bold text-slate-900">
                          {formatRupiah(spkData.ongkosJahitPerPcs)}/pcs ({formatRupiah(spkData.totalBiayaCMT)})
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* TABEL 1: RINCIAN KAIN (JIKA SJP) */}
            {isSJP && (
              <div className="mb-4">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-rose-900" />
                  <span>A. Rincian Bahan Kain yang Diserahkan & Dipotong</span>
                </h3>
                <table className="print-table w-full border-collapse border border-slate-900 text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 font-bold border-b border-slate-900">
                      <th className="border border-slate-900 p-1.5 text-left">Nama Bahan Kain</th>
                      <th className="border border-slate-900 p-1.5 text-left">Warna</th>
                      <th className="border border-slate-900 p-1.5 text-right w-16">Roll</th>
                      <th className="border border-slate-900 p-1.5 text-right w-24">Panjang Diserahkan</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Konsumsi/Pcs</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Est. Pcs</th>
                      <th className="border border-slate-900 p-1.5 text-right w-24 bg-rose-50 font-black">Realisasi Potong</th>
                      <th className="border border-slate-900 p-1.5 text-right w-20">Sisa Kain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sjpData.daftarKain.map((k) => (
                      <tr key={k.id} className="border-b border-slate-400">
                        <td className="border border-slate-900 p-1.5 font-medium">{k.namaKain}</td>
                        <td className="border border-slate-900 p-1.5">{k.warna}</td>
                        <td className="border border-slate-900 p-1.5 text-right">{k.jumlahRoll} roll</td>
                        <td className="border border-slate-900 p-1.5 text-right font-semibold">{k.totalPanjang} {k.satuan}</td>
                        <td className="border border-slate-900 p-1.5 text-right">{k.estimasiPemakaianPerPcs} {k.satuan}</td>
                        <td className="border border-slate-900 p-1.5 text-right text-slate-600">{k.estimasiHasilPcs} pcs</td>
                        <td className="border border-slate-900 p-1.5 text-right font-black text-rose-950 bg-rose-50/50">
                          {k.realisasiHasilPcs} pcs
                        </td>
                        <td className="border border-slate-900 p-1.5 text-right text-slate-600">{k.sisaBahan} {k.satuan}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-50 font-bold border-t border-slate-900">
                      <td colSpan={2} className="border border-slate-900 p-1.5 text-right uppercase">
                        Total Kain:
                      </td>
                      <td className="border border-slate-900 p-1.5 text-right">
                        {sjpData.daftarKain.reduce((acc, k) => acc + k.jumlahRoll, 0)} roll
                      </td>
                      <td className="border border-slate-900 p-1.5 text-right">
                        {sjpData.daftarKain.reduce((acc, k) => acc + k.totalPanjang, 0)} Meter
                      </td>
                      <td colSpan={2} className="border border-slate-900 p-1.5 text-right uppercase">
                        Total Realisasi Potong:
                      </td>
                      <td className="border border-slate-900 p-1.5 text-right font-black text-rose-950 bg-rose-100">
                        {sjpData.totalPcs} Pcs
                      </td>
                      <td className="border border-slate-900 p-1.5"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* TABEL 2: MATRIKS UKURAN (SIZE BREAKDOWN) */}
            <div className="mb-4">
              <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1.5 flex items-center gap-1">
                <span>{isSJP ? 'B.' : 'A.'} Rincian Ukuran / Matriks Size Breakdown Target</span>
              </h3>
              <table className="print-table w-full border-collapse border border-slate-900 text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-900">
                    <th className="border border-slate-900 p-1.5 text-left">Warna Kain / Varian</th>
                    <th className="border border-slate-900 p-1.5 text-center w-14">Size S</th>
                    <th className="border border-slate-900 p-1.5 text-center w-14">Size M</th>
                    <th className="border border-slate-900 p-1.5 text-center w-14">Size L</th>
                    <th className="border border-slate-900 p-1.5 text-center w-14">Size XL</th>
                    <th className="border border-slate-900 p-1.5 text-center w-14">Size XXL</th>
                    <th className="border border-slate-900 p-1.5 text-right w-24 bg-slate-200 font-black">
                      Total Pcs
                    </th>
                    <th className="border border-slate-900 p-1.5 text-right w-20">Lusin</th>
                  </tr>
                </thead>
                <tbody>
                  {(isSJP ? sjpData.breakdownSize : spkData?.breakdownSize || []).map((row) => (
                    <tr key={row.id} className="border-b border-slate-400">
                      <td className="border border-slate-900 p-1.5 font-bold">{row.warna}</td>
                      <td className="border border-slate-900 p-1.5 text-center tabular-nums">{row.sizes['S'] || 0}</td>
                      <td className="border border-slate-900 p-1.5 text-center tabular-nums">{row.sizes['M'] || 0}</td>
                      <td className="border border-slate-900 p-1.5 text-center tabular-nums">{row.sizes['L'] || 0}</td>
                      <td className="border border-slate-900 p-1.5 text-center tabular-nums">{row.sizes['XL'] || 0}</td>
                      <td className="border border-slate-900 p-1.5 text-center tabular-nums">{row.sizes['XXL'] || 0}</td>
                      <td className="border border-slate-900 p-1.5 text-right font-black tabular-nums bg-slate-50">
                        {row.subtotal}
                      </td>
                      <td className="border border-slate-900 p-1.5 text-right tabular-nums text-slate-600">
                        {(row.subtotal / 12).toFixed(1)} Dz
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-200 font-black border-t-2 border-slate-900 text-[11px]">
                    <td className="border border-slate-900 p-1.5 uppercase">GRAND TOTAL:</td>
                    <td className="border border-slate-900 p-1.5 text-center">
                      {(isSJP ? sjpData.breakdownSize : spkData?.breakdownSize || []).reduce(
                        (acc, r) => acc + (r.sizes['S'] || 0),
                        0
                      )}
                    </td>
                    <td className="border border-slate-900 p-1.5 text-center">
                      {(isSJP ? sjpData.breakdownSize : spkData?.breakdownSize || []).reduce(
                        (acc, r) => acc + (r.sizes['M'] || 0),
                        0
                      )}
                    </td>
                    <td className="border border-slate-900 p-1.5 text-center">
                      {(isSJP ? sjpData.breakdownSize : spkData?.breakdownSize || []).reduce(
                        (acc, r) => acc + (r.sizes['L'] || 0),
                        0
                      )}
                    </td>
                    <td className="border border-slate-900 p-1.5 text-center">
                      {(isSJP ? sjpData.breakdownSize : spkData?.breakdownSize || []).reduce(
                        (acc, r) => acc + (r.sizes['XL'] || 0),
                        0
                      )}
                    </td>
                    <td className="border border-slate-900 p-1.5 text-center">
                      {(isSJP ? sjpData.breakdownSize : spkData?.breakdownSize || []).reduce(
                        (acc, r) => acc + (r.sizes['XXL'] || 0),
                        0
                      )}
                    </td>
                    <td className="border border-slate-900 p-1.5 text-right font-black text-rose-950 bg-rose-100">
                      {isSJP ? sjpData.totalPcs : spkData?.totalPcs} PCS
                    </td>
                    <td className="border border-slate-900 p-1.5 text-right font-black">
                      {isSJP ? (sjpData.totalPcs / 12).toFixed(1) : spkData?.totalLusin} DZ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* SPK TECHNICAL SPECIFICATIONS & SOP (KHUSUS SPK) */}
            {isSPK && spkData.sopJahit && (
              <div className="mb-4 print-avoid-break">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1.5">
                  B. Standar Mutu & SOP Jahit Ninos Design (Wajib Dipatuhi)
                </h3>
                <div className="border border-slate-900 rounded p-2.5 bg-slate-50 text-[10px] space-y-1.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-bold text-slate-800 block">Jarak Jahitan (SPI):</span>
                      <span className="text-slate-700">{spkData.sopJahit.jarakJahitanSPI}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Tipe Jahitan & Kelim:</span>
                      <span className="text-slate-700">{spkData.sopJahit.tipeJahitan}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-300">
                    <div>
                      <span className="font-bold text-slate-800 block">Penempatan Label Ninos:</span>
                      <span className="text-slate-700">{spkData.sopJahit.posisiLabel}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Penempatan Aksesoris / Resleting:</span>
                      <span className="text-slate-700">{spkData.sopJahit.posisiAksesoris}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-300">
                    <div>
                      <span className="font-bold text-slate-800 block">Standar Finishing & Kemasan:</span>
                      <span className="text-slate-700">{spkData.sopJahit.standarFinishing}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Toleransi Ukuran:</span>
                      <span className="text-slate-700">{spkData.sopJahit.toleransiUkuran}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TABEL 3: AKSESORIS DISERTAKAN (UNTUK SJP ATAU CATATAN) */}
            {isSJP && sjpData.daftarAksesoris && sjpData.daftarAksesoris.length > 0 && (
              <div className="mb-4 print-avoid-break">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-800 mb-1.5">
                  C. Aksesoris & Kelengkapan Jahit yang Diserahkan
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-slate-900 rounded p-2 bg-slate-50 text-[10px]">
                  {sjpData.daftarAksesoris.map((ak) => (
                    <div key={ak.id} className="flex justify-between border-b border-slate-200 pb-0.5">
                      <span className="text-slate-700">{ak.nama}:</span>
                      <span className="font-bold text-slate-900">{ak.jumlah} {ak.satuan}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INSTRUKSI / CATATAN KHUSUS */}
            <div className="mb-5 p-2.5 border border-slate-900 rounded bg-slate-50 text-[10px] print-avoid-break">
              <span className="font-bold text-slate-900 block mb-0.5">
                Instruksi Khusus & Ketentuan Garment:
              </span>
              <p className="text-slate-700 leading-normal">
                {isSJP
                  ? sjpData.instruksiPotong ||
                    'Potong rapi sesuai arah serat kain. Berikan penomoran bundle ticket pada setiap ikatan agar lot tidak tercampur.'
                  : spkData?.catatanProduksi ||
                    'Barang wajib selesai tepat waktu. Setiap barang cacat jahit/reject akibat kelalaian penjahit wajib diperbaiki atau diganti.'}
              </p>
            </div>

            {/* SIGNATURES AREA (4 KOLOM TANDA TANGAN RESMI) */}
            <div className="print-avoid-break border-t border-slate-900 pt-3">
              <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                {/* Sign 1 */}
                <div className="flex flex-col justify-between h-28 border border-slate-300 rounded p-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-700">Dibuat Oleh (Admin/PPIC)</span>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-[9px] text-slate-400 italic">(Tanda Tangan)</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    {isSJP ? sjpData.penanggungJawabGudang : spkData?.productionManager || 'Admin Produksi'}
                  </div>
                </div>

                {/* Sign 2 */}
                <div className="flex flex-col justify-between h-28 border border-slate-300 rounded p-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-700">
                    {isSJP ? 'Pemotong / Meja' : 'Penerima / Vendor CMT'}
                  </span>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-[9px] text-slate-400 italic">(Tanda Tangan & Cap)</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    {isSJP ? sjpData.pemotong : spkData?.vendorCMT || 'Penjahit'}
                  </div>
                </div>

                {/* Sign 3 */}
                <div className="flex flex-col justify-between h-28 border border-slate-300 rounded p-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-700">Quality Control (QC)</span>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-[9px] text-slate-400 italic">(Tanda Tangan)</span>
                  </div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    {isSJP ? sjpData.checkerQc : spkData?.qcInspector || 'Lead QC'}
                  </div>
                </div>

                {/* Sign 4 */}
                <div className="flex flex-col justify-between h-28 border border-slate-300 rounded p-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-700">Disetujui (Manajemen)</span>
                  <div className="h-12 flex items-center justify-center">
                    <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="scale-75 -my-2" />
                  </div>
                  <div className="border-t border-slate-400 pt-1 font-bold text-slate-900">
                    Ninos Design Management
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center text-[9px] text-slate-400">
                Dokumen resmi sistem produksi Ninos Design. Validasi digital dan barcode dapat diverifikasi melalui sistem internal.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
