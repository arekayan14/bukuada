import { useState } from 'react'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MainPage     from './pages/MainPage'
import AdminPage    from './pages/AdminPage'
import Toast        from './components/Toast'

const PAGE = { LOGIN: 'login', REGISTER: 'register', MAIN: 'main', ADMIN: 'admin' }

export default function App() {
  const [page, setPage]           = useState(PAGE.LOGIN)
  const [user, setUser]           = useState(null)
  const [noHpSementara, setNoHpSementara] = useState('')
  const [toast, setToast]         = useState('')
  const [modeAdmin, setModeAdmin] = useState(false)

  function tampilToast(pesan) {
    setToast(pesan)
    setTimeout(() => setToast(''), 3000)
  }

  function masukKatalog(userData) {
    setUser(userData)
    setModeAdmin(false)
    setPage(PAGE.MAIN)
  }

  function arahkanRegister(no_hp) {
    setNoHpSementara(no_hp)
    setPage(PAGE.REGISTER)
  }

  function masukAdmin() {
    setPage(PAGE.ADMIN)
  }

  function adminLihatKatalog() {
    setModeAdmin(true)
    setPage(PAGE.MAIN)
  }

  function kembaliKeAdmin() {
    setModeAdmin(false)
    setPage(PAGE.ADMIN)
  }

  function logout() {
    setUser(null)
    setPage(PAGE.LOGIN)
  }

  return (
    <>
      {page === PAGE.LOGIN    && <LoginPage    onMasukUser={masukKatalog} onDaftarBaru={arahkanRegister} onMasukAdmin={masukAdmin} />}
      {page === PAGE.REGISTER && <RegisterPage no_hp={noHpSementara} onBerhasil={masukKatalog} onKembali={() => setPage(PAGE.LOGIN)} />}
      {page === PAGE.MAIN     && <MainPage     user={user} modeAdmin={modeAdmin} onKembaliAdmin={kembaliKeAdmin} onLogout={logout} tampilToast={tampilToast} />}
      {page === PAGE.ADMIN    && <AdminPage    onLihatKatalog={adminLihatKatalog} onLogout={logout} tampilToast={tampilToast} />}
      <Toast pesan={toast} />
    </>
  )
}
