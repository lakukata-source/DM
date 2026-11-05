# Marketing Planner AI

MVP aplikasi PWA pribadi untuk perencanaan digital marketing. Antarmuka bahasa Indonesia, data lokal di IndexedDB, multi-workspace, AI chat `/brief` dan `/budget`, budget allocator, ekspor anggaran Excel, backup JSON, tema gelap/terang.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Build produksi: `npm run build`. Jalankan hasil build dengan `npm run preview`.

## Memulai

1. Buat workspace perusahaan di tab **Workspace**.
2. Isi endpoint AI, model, dan API key di Pengaturan. Aplikasi memakai endpoint kompatibel OpenAI Chat Completions; key disimpan di IndexedDB browser dan **tidak** termasuk dalam file backup.
3. Buat rencana di tab **Budget** atau gunakan `/budget` di Chat, edit kartu JSON jika perlu, lalu simpan ke modul.
4. Unduh rencana menjadi `.xlsx` dengan sheet Ringkasan dan Rincian Alokasi.
5. Ekspor/impor cadangan JSON dari Pengaturan.

## Privasi dan batasan

Tidak ada registrasi atau integrasi platform iklan. Data disimpan lokal di browser; hanya pesan AI dan konteks workspace aktif yang dikirim ke endpoint AI yang dikonfigurasi. Penyimpanan browser tidak terenkripsi secara otomatis. Karena key dipakai langsung dari browser, gunakan endpoint AI yang mengizinkan permintaan browser (CORS). Tidak disediakan service worker/offline caching pada MVP awal.

## MVP saat ini

Workspace, profil brand, brief, Budget Allocator, percakapan per workspace, perintah `/brief` dan `/budget`, kartu hasil terstruktur, perhitungan alokasi rupiah, ekspor XLSX dan backup JSON. Modul riset, kampanye, eksperimen A/B, metrik performa/CSV, PDF, dan service worker PWA lanjutan belum termasuk tahap ini.
