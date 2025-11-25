// Updated Nav component with smooth scrolling
import React, { useState, useRef, useEffect } from 'react'
import Logo from './Logo'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onDoc(e) {
      if (!menuRef.current) return
      if (open && !menuRef.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setOpen(false); // Close mobile menu
    
    // If we're not on the home page, go home first
    if (window.location.hash && window.location.hash !== '#/') {
      window.location.hash = '/';
      // Wait a moment for the page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/40">
      <div className="w-full mx-auto px-6 py-3 flex items-center justify-between">

        {/* Left: Logo + Title */}
        <div className="flex items-center gap-4">
          <Logo className="w-12 h-12" />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-slate-900 uppercase tracking-wide text-sm">Santa Cruz Bike Adventures</span>
            <span className="text-xs text-slate-500 uppercase tracking-wide">Delivered Rentals • Guided Tours</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 uppercase text-xs font-semibold tracking-wide">
          <a href="#/" className="text-slate-700 hover:text-black transition">Home</a>
          <button onClick={(e) => handleNavClick(e, 'rentals')} className="text-slate-700 hover:text-black transition">Rentals</button>
          <button onClick={(e) => handleNavClick(e, 'tours')} className="text-slate-700 hover:text-black transition">Tours</button>
          <button onClick={(e) => handleNavClick(e, 'contact')} className="text-slate-700 hover:text-black transition">Contact</button>
          <button onClick={(e) => handleNavClick(e, 'rentals')} className="ml-4 bg-black text-white px-4 py-2 rounded-full hover:bg-slate-800 transition shadow">Book Now</button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((s) => !s)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 bg-white/70 backdrop-blur"
        >
          {!open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-200 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-white border-t border-slate-200 p-6 flex flex-col gap-4 uppercase text-sm font-semibold tracking-wide">
          <a href="#/" onClick={() => setOpen(false)} className="text-slate-800">Home</a>
          <button onClick={(e) => handleNavClick(e, 'rentals')} className="text-slate-800 text-left">Rentals</button>
          <button onClick={(e) => handleNavClick(e, 'tours')} className="text-slate-800 text-left">Tours</button>
          <button onClick={(e) => handleNavClick(e, 'contact')} className="text-slate-800 text-left">Contact</button>
          <button
            onClick={(e) => handleNavClick(e, 'rentals')}
            className="mt-2 inline-block text-center bg-black text-white py-2 rounded-full"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  )
}