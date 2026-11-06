#!/bin/bash
# Script Push Cepat ke GitHub - Nino's Design

MSG=${1:-"Update aplikasi Nino's Design"}

echo "📦 Menyiapkan perubahan file..."
git add .

echo "📝 Menyimpan commit: \"$MSG\""
git commit -m "$MSG"

echo "🚀 Mengirim perubahan ke GitHub..."
git push origin main

if [ $? -eq 0 ]; then
  echo "✅ Berhasil! Semua perubahan sudah ter-update di GitHub."
else
  echo "⚠️ Gagal push. Pastikan remote origin GitHub sudah terhubung."
fi
