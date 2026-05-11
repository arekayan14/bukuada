export default function ToastKonfirmasi({ pesan, onYa, onTidak }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-slate-800 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg">
      <span>{pesan}</span>
      <button onClick={onYa} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full transition">
        Ya
      </button>
      <button onClick={onTidak} className="bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-full transition">
        Batal
      </button>
    </div>
  )
}
