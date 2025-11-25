import React, { useEffect, useState } from 'react'
import Nav from './components/Nav'
import { Hero } from './components/Hero'
import InstagramFeed from './components/InstagramFeed';


function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route.replace('#','')
}

function Home(){
  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <Hero />

      <section id="rentals" className="mt-12">
        <h2 className="text-2xl font-semibold">Rentals & Booking</h2>
        <p className="mt-2 text-slate-600">Choose a ride and tap to reserve — you'll finish booking in Square.</p>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <WestCliffCard />
          <a href="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/YV7OZX2BA3SK3OIFZ7LCAMYE"
             target="_blank" rel="noreferrer" className="card">
            <div className="card-image" style={{backgroundImage: "url('/images/wilderness-waterfront.jpg')"}} />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">Wilderness Waterfront Path Tour</h3>
              <p className="mt-2 text-sm text-slate-600">A peaceful ride along estuary and coastal paths — ideal for nature lovers.</p>
              <p className="mt-3 font-medium text-sky-600">Guided or self-guided · ~4 hours</p>
            </div>
          </a>
        </div>
      </section>


      {/* Custom Tour Button */}
      <div className="mt-8 flex justify-center">
        <a 
          href="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/PNRDNC4GPASETSC7VWJI4MQ5" 
          target="_blank" 
          rel="noreferrer"
          className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Custom Tour
        </a>
      </div>

      <section id="tours" className="mt-12">
        <h2 className="text-2xl font-semibold">Self-Guided Tours</h2>
        <p className="mt-2 text-slate-600">Explore our curated routes at your own pace. Tap any tour to learn more.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <a href="#/birdwatching" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('/images/birdwatching.jpg')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Birdwatching Route</h4>
              <p className="mt-2 text-sm text-slate-600">Wetlands, marshes, and quiet estuary overlooks — perfect for spotting shorebirds.</p>
            </div>
          </a>

          <a href="#/surf-history" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('/images/surf-history.jpg')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Surf History Ride</h4>
              <p className="mt-2 text-sm text-slate-600">Ride through legendary breaks, murals, and surf culture landmarks.</p>
            </div>
          </a>

          <a href="#/waterfront" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('/images/wilderness-waterfront.jpg')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Wilderness Waterfront Path</h4>
              <p className="mt-2 text-sm text-slate-600">A tranquil coastal path with dunes, estuary views, and quiet wildlife spots.</p>
            </div>
          </a>
        </div>
      </section>

      <section id="contact" className="mt-16 bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold">Contact & Service Area</h2>
        <p className="mt-2 text-slate-600">Serving Santa Cruz, California. We deliver and pick up within the local area.</p>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold">Quick Info</h4>
            <p className="mt-2 text-sm text-slate-600">Phone: (your phone)<br/>Email: (coming soon)</p>
            <p className="mt-4 text-sm">We charge $70 for a 4-hour rental. Drop-off and pick-up service included.</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function WestCliffCard() {
  const slides = [
    { id: 1, type: 'video', src: '/videos/westcliff1.mov', duration: 13000 },
    { id: 2, type: 'image', src: '/images/bikepath.jpeg', duration: 8000 },
    { id: 3, type: 'image', src: '/images/westcliff3.jpeg', duration: 8000 }
  ];

  const [index, setIndex] = useState(0);
  const timeoutRef = React.useRef(null);

  // ⭐ THIS is the correct ref array
  const videoRefs = React.useRef([]);

  const goNext = (e) => {
    if (e) e.preventDefault();
    setIndex((i) => (i + 1) % slides.length);
  };

  const goPrev = (e) => {
    if (e) e.preventDefault();
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };

  // Auto-advance timer
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, slides[index].duration);

    return () => clearTimeout(timeoutRef.current);
  }, [index]);

  // ⭐ Restart video cleanly when activated
  useEffect(() => {
    const slide = slides[index];
    if (slide.type === 'video') {
      const vid = videoRefs.current[index];
      if (vid) {
        vid.pause();
        vid.currentTime = 0;

        const playPromise = vid.play();
        if (playPromise?.catch) playPromise.catch(() => {});
      }
    }
  }, [index]);

  return (
    <a
      href="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/FDAPVUKUCEOUMHGZ2TJXMEGH"
      target="_blank"
      rel="noreferrer"
      className="card relative"
    >
      <div className="relative w-full h-96 overflow-hidden rounded-t-xl bg-slate-100">
        {slides.map((s, i) => {
          const isActive = i === index;

          return (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: isActive ? 1 : 0 }}
            >
              {s.type === 'image' ? (
                <div
                  className="w-full h-full bg-center bg-cover"
                  style={{ backgroundImage: `url('${s.src}')` }}
                />
              ) : (
                <video
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  src={s.src}
                  muted
                  loop
                  playsInline
                  ref={(el) => (videoRefs.current[i] = el)}
                />
              )}
            </div>
          );
        })}

        {/* arrows */}
        <button
          onClick={goPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow"
        >
          ‹
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow"
        >
          ›
        </button>
      </div>

      {/* card body */}
      <div className="p-5">
        <h3 className="text-3xl font-semibold text-center mt-1">
  Westcliff 4-Hour Adventure
</h3>
        <p className="mt-2 text-sm text-slate-600">
          Cruise the coastline from the Wharf to Natural Bridges. Includes delivery & pickup.
        </p>
        <p className="mt-3 font-medium text-sky-600">$70 · 4 hours</p>
      </div>
    </a>
  );
}


function Birdwatching(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Birdwatching Route (Self-guided)</h2><p className="mt-4 text-slate-700">This peaceful half-day route takes you through Santa Cruz's richest bird habitats: tidal wetlands, marsh edges, and quiet estuary overlooks. Keep an eye out for herons, egrets, raptors, and seasonal migrants. We provide a route map and suggested stopping points for prime viewing.</p></article>) }
function SurfHistory(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Surf History Ride (Self-guided)</h2><p className="mt-4 text-slate-700">Ride through Santa Cruz's surf legacy: legendary breaks, murals, and beachfront landmarks.</p></article>) }
function Waterfront(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Wilderness Waterfront Path (Self-guided)</h2><p className="mt-4 text-slate-700">Our newest route follows tranquil waterfront paths, boardwalks, and dunes.</p></article>) }

export default function App(){ 
  const route = useHashRoute(); 
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-800">
      <Nav />
      {route === '/' && <Home />}
      {route === '/rentals' && <Home />}
      {route === '/tours' && <Home />}
      {route === '/birdwatching' && <Birdwatching />}
      {route === '/surf-history' && <SurfHistory />}
      {route === '/waterfront' && <Waterfront />}

      {/* Instagram feed goes here */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <InstagramFeed />
      </div>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-8 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Santa Cruz Bike Adventures — Serving Santa Cruz, CA
        </div>
      </footer>
    </div>
  );
}