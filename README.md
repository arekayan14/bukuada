# 📖 Buku Ada — React Edition

## Struktur Proyek

```
BukuAdaReact/
├── frontend/               ← React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js       ← Semua fetch ke backend
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── MainPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── components/
│   │   │   ├── KartuBuku.jsx
│   │   │   ├── PanelKeranjang.jsx
│   │   │   ├── BukuSaya.jsx
│   │   │   ├── FormTambahBuku.jsx
│   │   │   ├── TabelRiwayat.jsx
│   │   │   ├── ModalLoginAdmin.jsx
│   │   │   ├── ModalGantiPassword.jsx
│   │   │   └── Toast.jsx
│   │   ├── App.jsx            ← Router utama
│   │   └── main.jsx
│   └── package.json
│
├── backend/                ← Node.js + Express
│   └── src/
│       ├── db.js              ← Koneksi MySQL
│       ├── routes/
│       │   ├── user.js
│       │   ├── buku.js
│       │   └── peminjaman.js
│       └── server.js          ← Entry point
│
└── database/
    └── Perpus.sql
```

## Cara Menjalankan

### 1. Jalankan Backend
```bash
cd backend
npm install
node src/server.js
```

### 2. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Buka browser → **http://localhost:5173**

## Login
- **User**: ketik nama, langsung masuk
- **Admin**: username `admin`, password `admin123`
