// services/api.js — semua request ke backend ada di sini
const BASE_URL = 'http://76.13.23.214:5000/api';

const post = (url, data) =>
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

const api = {
    // USER
    cekUser:        (nama)              => fetch(`${BASE_URL}/user/${encodeURIComponent(nama)}`).then(r => r.json()),
    daftarUser:     (data)              => post(`${BASE_URL}/user`, data),

    // BUKU
    getBuku:        ()                  => fetch(`${BASE_URL}/buku`).then(r => r.json()),
    tambahBuku:     (data)              => post(`${BASE_URL}/buku`, data),
    hapusBuku:      (id)                => fetch(`${BASE_URL}/buku/${id}`, { method: 'DELETE' }).then(r => r.json()),

    // PEMINJAMAN
    pinjamBuku:     (bukuId, namaUser)  => post(`${BASE_URL}/peminjaman/pinjam`, { bukuId, namaUser }),
    kembalikanBuku: (bukuId, namaUser)  => post(`${BASE_URL}/peminjaman/kembalikan`, { bukuId, namaUser }),
    kembalikanAdmin:(pinjamId)          => post(`${BASE_URL}/peminjaman/kembalikan-admin`, { pinjamId }),
    getPinjamanUser:(nama)              => fetch(`${BASE_URL}/peminjaman/user/${encodeURIComponent(nama)}`).then(r => r.json()),
    getRiwayat:     ()                  => fetch(`${BASE_URL}/peminjaman`).then(r => r.json()),
};

export default api;
