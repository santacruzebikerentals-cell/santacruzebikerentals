import React from 'react'

export default function Nav(){
  return (
    <header className="bg-white/60 backdrop-blur sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center text-white font-bold">SC</div>
          <div>
            <div className="font-semibold text-slate-900">Santa Cruz Bike Adventures</div>
            <div className="text-xs text-slate-500">Delivered rentals & guided tours</div>
          </div>
        </div>

        <nav className="hidden md:flex gap-4 items-center">
          <a href="#/" className="text-sm text-slate-700 hover:text-slate-900">Home</a>
          <a href="#/rentals" className="text-sm text-slate-700 hover:text-slate-900">Rentals</a>
          <a href="#/tours" className="text-sm text-slate-700 hover:text-slate-900">Tours</a>
          <a href="#/contact" className="text-sm text-slate-700 hover:text-slate-900">Contact</a>
          <a href="#/rentals" className="text-sm bg-sky-600 text-white px-3 py-2 rounded">Book Now</a>
        </nav>

        <div className="md:hidden">
          <button onClick={() => { const el = document.querySelector('nav'); el && el.classList.toggle('open') }} className="px-3 py-2 bg-sky-600 text-white rounded">Menu</button>
        </div>
      </div>
    </header>
  )
}
