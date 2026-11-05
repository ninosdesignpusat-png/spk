import React from 'react';
import { X, Printer, Tag } from 'lucide-react';
import { SuratJalanPotong } from '../types/ninos';
import { generateBarcodeSvg, triggerPrintWindow } from '../utils/printHelpers';

interface BundleTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sjp: SuratJalanPotong | null;
}

interface BundleTicket {
  bundleNo: number;
  warna: string;
  size: string;
  qty: number;
  model: string;
  kodeArtikel: string;
  nomorSurat: string;
  tanggal: string;
}

export const BundleTicketsModal: React.FC<BundleTicketsModalProps> = ({
  isOpen,
  onClose,
  sjp,
}) => {
  if (!isOpen || !sjp) return null;

  // Generate bundle tickets: bundle size usually 10-20 pcs per bundle
  const BUNDLE_MAX_QTY = 10;
  const tickets: BundleTicket[] = [];
  let bundleCounter = 1;

  sjp.breakdownSize.forEach((bRow) => {
    Object.entries(bRow.sizes).forEach(([sz, totalSzQty]) => {
      let remaining = Number(totalSzQty) || 0;
      while (remaining > 0) {
        const take = Math.min(remaining, BUNDLE_MAX_QTY);
        tickets.push({
          bundleNo: bundleCounter++,
          warna: bRow.warna,
          size: sz,
          qty: take,
          model: sjp.namaModel,
          kodeArtikel: sjp.kodeArtikel,
          nomorSurat: sjp.nomorSurat,
          tanggal: sjp.tanggal,
        });
        remaining -= take;
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:max-h-[96vh] sm:max-w-4xl sm:rounded-2xl flex flex-col shadow-2xl border border-slate-300 overflow-hidden">
        {/* Controls Toolbar */}
        <div className="no-print px-4 sm:px-6 py-3.5 bg-slate-950 text-white flex items-center justify-between border-b border-amber-900/30">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs sm:text-sm">
              Tiket Bundel ({tickets.length} Tag)
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-amber-300 bg-slate-900 border border-amber-600/30 px-2 py-0.5 rounded">
              {sjp.nomorSurat}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerPrintWindow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Tiket</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div className="print-container bg-white w-full max-w-[210mm] p-6 shadow-md border border-slate-300 text-slate-900 print:shadow-none print:border-none print:p-0">
            <div className="no-print mb-4 pb-2 border-b border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>
                Format 6 tiket per lembar potong A4. Gunting sesuai garis putus-putus dan ikat pada masing-masing tumpukan kain.
              </span>
              <span className="font-bold text-slate-700">Total: {sjp.totalPcs} Pcs</span>
            </div>

            {/* Grid of 2 columns on A4 */}
            <div className="grid grid-cols-2 gap-4">
              {tickets.map((t) => {
                const ticketCode = `${sjp.nomorSurat}-B${String(t.bundleNo).padStart(2, '0')}`;
                const barcode = generateBarcodeSvg(ticketCode, 24);

                return (
                  <div
                    key={t.bundleNo}
                    className="border-2 border-dashed border-slate-700 rounded-lg p-3 bg-white space-y-1.5 print:break-inside-avoid print:page-break-inside-avoid text-[10px]"
                  >
                    {/* Header Ticket */}
                    <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                      <div className="flex items-center gap-1">
                        <span className="font-serif-brand font-black text-xs text-slate-900 uppercase">
                          NINOS DESIGN
                        </span>
                        <span className="text-[9px] bg-slate-900 text-white px-1 rounded font-bold">
                          BUNDLE TAG
                        </span>
                      </div>
                      <span className="font-mono font-black text-xs bg-rose-100 text-rose-950 px-1.5 py-0.2 rounded border border-rose-300">
                        NO. #{t.bundleNo}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                        <span>{t.model}</span>
                        <span className="font-mono text-slate-600 font-normal">({t.kodeArtikel})</span>
                      </div>
                      <div className="flex justify-between text-slate-700">
                        <span>Warna: <b>{t.warna}</b></span>
                        <span>Ref: {t.nomorSurat}</span>
                      </div>
                    </div>

                    {/* Big Size & Qty Box */}
                    <div className="grid grid-cols-2 gap-2 py-1 bg-slate-50 border border-slate-300 rounded text-center">
                      <div>
                        <span className="text-[8px] text-slate-500 uppercase block font-semibold">UKURAN</span>
                        <span className="font-mono font-black text-base text-slate-900">{t.size}</span>
                      </div>
                      <div className="border-l border-slate-300">
                        <span className="text-[8px] text-slate-500 uppercase block font-semibold">JUMLAH</span>
                        <span className="font-mono font-black text-base text-rose-950">{t.qty} PCS</span>
                      </div>
                    </div>

                    {/* Barcode and Operator initials */}
                    <div className="flex items-end justify-between pt-1">
                      <div dangerouslySetInnerHTML={{ __html: barcode }} className="scale-90 -ml-2" />
                      <div className="text-right text-[8px] text-slate-500 space-y-0.5">
                        <div>Paraf Pemotong: ______</div>
                        <div>Paraf Penjahit: ______</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
