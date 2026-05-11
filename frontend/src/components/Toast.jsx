export default function Toast({ pesan }) {
  if (!pesan) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg z-[100] transition-all duration-300">
      {pesan}
    </div>
  )
}
