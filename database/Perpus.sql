-- ============================================================
--  DATABASE Buku Ada Perpustakaan
-- ============================================================
CREATE DATABASE IF NOT EXISTS buku_ada_db;
USE buku_ada_db;

-- Hapus tabel lama (urutan penting)
DROP TABLE IF EXISTS peminjaman;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS buku;

-- 1. TABEL BUKU
CREATE TABLE buku (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    judul       VARCHAR(255) NOT NULL,
    rak         VARCHAR(50),
    gambar      TEXT,
    stok        INT DEFAULT 1,
    dipinjam    INT DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL USERS
CREATE TABLE users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nama        VARCHAR(100) NOT NULL,
    no_hp       VARCHAR(20),
    no_ktp      VARCHAR(30),
    role        ENUM('User', 'Admin') DEFAULT 'User',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL PEMINJAMAN (Dihubungkan ke user_id dan buku_id)
CREATE TABLE peminjaman (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL, -- Menggunakan ID agar akurat
    buku_id         INT NOT NULL,
    status          ENUM('dipinjam', 'dikembalikan') DEFAULT 'dipinjam',
    tanggal_pinjam  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_kembali TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (buku_id) REFERENCES buku(id) ON DELETE CASCADE
);

-- ============================================================
--  DATA AWAL (INSERT)
-- ============================================================

-- Masukkan User Admin & Contoh User terlebih dahulu
INSERT INTO users (nama, no_hp, no_ktp, role) VALUES 
('Yanuar Admin', '08123456789', '1234567890123456', 'Admin'),
('User Contoh', '08987654321', '3201234567890001', 'User');

-- Masukkan Data Buku
INSERT INTO buku (judul, rak, gambar, stok, dipinjam) VALUES 
('Metodologi Penelitian', 'A-1', 'https://tirtabuanamedia.co.id/wp-content/uploads/2022/12/Metodologi-Penelitian-LengkapPraktis-dan-Mudah-Dipahami-COVER-PINK.jpg', 3, 0),
('Belajar JavaScript Pemula', 'B-3', 'https://cdn.gramedia.com/uploads/items/9786230024320_Cov_HTML5_dan_Javascript_untuk_Pemula.jpg', 2, 0),
('Creative Thinking', 'C-2', 'https://d2kchovjbwl1tk.cloudfront.net/vendor/4817/product/65265a7a921b338f1c40e0ae_1723044172348.jpeg', 4, 0),
('Atomic Habits', 'B-1', 'https://cdn.gramedia.com/uploads/items/9786020633176_.Atomic_Habit.jpg', 5, 0);

-- Masukkan Contoh Riwayat Peminjaman (User ID 2 meminjam Buku ID 1)
INSERT INTO peminjaman (user_id, buku_id, tanggal_pinjam) VALUES (2, 1, NOW());