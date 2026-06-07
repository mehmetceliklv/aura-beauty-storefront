'use client'

export default function AnnouncementBar() {
  return (
    <div className="bg-[#0F0F0F] text-white py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-6 text-[10px] tracking-[0.12em] uppercase font-light text-white/60">
          <span>Mon–Sat 10:00–19:00</span>
        </div>
        <p className="text-[11px] tracking-[0.15em] uppercase font-light text-center flex-1">
          Free shipping on orders over €80 · Complimentary samples with every order
        </p>
        <div className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.12em] text-white/60">
          <button
            type="button"
            className="hover:text-white transition-colors duration-300"
            aria-label="Switch to English"
          >
            EN
          </button>
          <span>|</span>
          <button
            type="button"
            className="hover:text-white transition-colors duration-300"
            aria-label="Switch to Ukrainian"
          >
            UA
          </button>
        </div>
      </div>
    </div>
  )
}
