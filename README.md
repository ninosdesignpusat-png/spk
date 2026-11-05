# NINOS DESIGN - Sistem Surat Jalan Potong & SPK Produksi

Aplikasi manajemen operasional garmen & konveksi khusus untuk **Ninos Design** (Muslim Fashion & Modest Wear), yang mempermudah penerbitan **Surat Jalan Potong Bahan (SJP)**, **Surat Perintah Kerja (SPK) Produksi**, cetak lembar kerja resmi & tiket bundel, serta sinkronisasi otomatis ke **Google Sheets**.

---

## 🌟 Fitur Utama

### 1. Surat Jalan Potong Bahan (SJP)
- **Penomoran Otomatis**: Format resmi standar `SJP-ND/YYYY/MM/XXX` atau kustom manual.
- **Rincian Bahan Baku Lengkap**:
  - Jenis kain (Toyobo, Armani Silk, Ceruty, Katun Madinah, Crinkle Airflow, dll.)
  - Jumlah roll, panjang bahan diserahkan (Meter / Yard / Kg)
  - Estimasi konsumsi kain per pcs (Marker Consumption)
  - Estimasi hasil potong vs Realisasi hasil potong & sisa bahan
- **Matriks Hasil Potong per Ukuran (Size Breakdown)**:
  - Input jumlah potong per warna & size (S, M, L, XL, XXL, All Size).
  - Penghitungan subtotal per warna & grand total pieces otomatis.
- **Daftar Aksesoris Disertakan**: Resleting Jepang YKK, kancing, woven label Ninos Design, care label, hangtag, benang senada.
- **Instruksi Khusus Pemotongan**: Arah serat kain, batas toleransi susut, penomoran lot ikatan.
- **Konversi 1-Klik ke SPK Produksi**: Setelah bahan selesai dipotong, cukup klik *"Buat SPK"* untuk langsung membuat SPK Produksi dengan data model, kain, dan ukuran yang sama secara otomatis!

### 2. SPK Produksi (Surat Perintah Kerja Jahit CMT)
- **Penomoran Otomatis**: Format `SPK-ND/YYYY/MM/XXX`.
- **Terhubung dengan SJP**: Terintegrasi langsung dengan nomor Surat Jalan Potong terkait.
- **Pengaturan CMT / In-House**:
  - Penjahit CMT Makloon vs Workshop In-House
  - Nama vendor, PIC, kontak WhatsApp/telepon
  - Target penyerahan / Deadline produksi dengan penanda visual
- **Kalkulasi Biaya CMT**:
  - Input ongkos jahit per pcs (Rp)
  - Penghitungan total biaya CMT dan konversi otomatis ke satuan Lusin (Dz)
  - Opsi sembunyikan/tampilkan biaya CMT saat lembar kerja dicetak ke penjahit
- **SOP & Standar Mutu Jahit Ninos Design**:
  - Jarak jahitan (Stitches Per Inch / SPI: 11-12 SPI)
  - Tipe jahitan (obras 4 benang senada, kelim rol, stik balik)
  - Posisi label leher & care label
  - Standar finishing (steam uap suhu sedang, lipat polybag, silica gel)
  - Toleransi ukuran pola
- **Pelacak Status Pengerjaan Produksi**:
  - `Draft` ➔ `Bahan Diterima` ➔ `Sedang Jahit` ➔ `QC & Finishing` ➔ `Selesai`

### 3. Download & Cetak Dokumen Resmi
- **Format Cetak Presisi Kertas A4**:
  - Kop Perusahaan Ninos Design lengkap dengan logo, kontak & alamat workshop
  - Barcode SVG & QR Code verifikasi dokumen
  - Layout tabel dengan batas cetak rapat, anti-terpotong (`@media print` optimized)
  - 4 Kolom Tanda Tangan Resmi: Admin/PPIC, Pemotong/Vendor, Checker QC, Manajemen
- **Download PDF**: Melalui fungsi simpan PDF browser dengan kualitas vektor tajam tanpa pikselasi.
- **Cetak Tiket Bundel Potongan (Bundle Tickets)**:
  - Otomatis membuat tiket ikatan per 10 pcs kain untuk diikatkan pada bundle potongan kain agar tidak tertukar lot warna atau shading di meja penjahit.

### 4. Integrasi Google Sheets (Dua Arah & Copy-Paste)
- **Google Apps Script Web App**:
  - Masukkan Web App URL di menu Spreadsheet.
  - Klik **"Sinkronkan Sekarang"**: Aplikasi langsung memperbarui tab `Surat_Jalan_Potong` dan `SPK_Produksi` di spreadsheet Google Anda!
  - Disertai fitur **"Tes Koneksi (Ping)"** untuk memastikan URL aktif.
- **Salin Format Tabular (Instant Ctrl+V)**:
  - Tombol **"Salin ke Spreadsheet"** menyalin data dalam format TSV ke clipboard, siap di-paste langsung (Ctrl+V) ke spreadsheet tanpa perlu setup apapun!
- **Download File CSV**:
  - Format UTF-8 BOM yang langsung rapi dibuka di Microsoft Excel maupun Google Sheets.
- **Kode Google Apps Script Siap Pakai**:
  - Tersedia di dalam aplikasi dengan tutorial langkah demi langkah 1 menit.

### 5. Master Data & Backup
- Katalog Model & Desain Ninos Design
- Daftar Vendor CMT & Meja Potong
- Fitur Backup JSON dan Restore Data lokal

---

## 🚀 Cara Menjalankan Aplikasi

1. Jalankan development server:
   ```bash
   pnpm dev
   # atau
   npm run dev
   ```
2. Buka browser di alamat:
   ```
   http://localhost:3000
   ```
3. Untuk build versi production:
   ```bash
   pnpm build
   ```
