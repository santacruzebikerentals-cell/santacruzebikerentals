import React, { useEffect, useState } from 'react'
import Nav from './components/Nav'

// Hash router: '', '#/', '#/birdwatching', '#/surf-history', '#/waterfront'
function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route.replace('#','')
}

function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900">Ride the Coastline. Explore the Wild. No Hassle.</h1>
          <p className="mt-4 text-lg text-slate-700">Premium E-Bike Rentals Delivered Anywhere in Santa Cruz.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#/rentals" className="inline-block bg-sky-600 text-white px-5 py-3 rounded-lg shadow hover:scale-[1.02] transition">Book Your Ride</a>
            <a href="#/tours" className="inline-block border border-slate-200 px-5 py-3 rounded-lg">See Tours</a>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>• $70 / 4-hour e-bike rental</li>
            <li>• Local drop-off & pick-up included</li>
            <li>• Self-guided & guided tours available</li>
          </ul>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img alt="Santa Cruz coastline" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60" className="w-full h-72 object-cover"/>
        </div>
      </section>

      <section id="rentals" className="mt-12">
        <h2 className="text-2xl font-semibold">Rentals & Booking</h2>
        <p className="mt-2 text-slate-600">Choose a ride and tap to reserve — you’ll finish booking in Square.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <a href="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/FDAPVUKUCEOUMHGZ2TJXMEGH" target="_blank" rel="noreferrer" className="card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1595433707802-6f2b66a8f1a4?auto=format&fit=crop&w=1000&q=80')"}} />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">West Cliff 4-Hour E-Bike Adventure</h3>
              <p className="mt-2 text-sm text-slate-600">Cruise the coastline from the Wharf to Natural Bridges. Includes delivery & pickup anywhere in Santa Cruz.</p>
              <p className="mt-3 font-medium text-sky-600">$70 · 4 hours</p>
            </div>
          </a>

          <a href="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/YV7OZX2BA3SK3OIFZ7LCAMYE" target="_blank" rel="noreferrer" className="card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1621624198955-62bdb02a2d36?auto=format&fit=crop&w=1000&q=80')"}} />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">Wilderness Waterfront Path Tour</h3>
              <p className="mt-2 text-sm text-slate-600">A peaceful ride along estuary and coastal paths — ideal for nature lovers.</p>
              <p className="mt-3 font-medium text-sky-600">Guided or self-guided · ~4 hours</p>
            </div>
          </a>

          <div className="card cursor-default opacity-90">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1000&q=80')"}} />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">Guided Tour Inquiry</h3>
              <p className="mt-2 text-sm text-slate-600">Interested in a guided experience? We’ll connect you with a local guide soon — contact details coming shortly.</p>
              <p className="mt-3 font-medium text-sky-600">Contact for guided options</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tours" className="mt-12">
        <h2 className="text-2xl font-semibold">Self-Guided Tours</h2>
        <p className="mt-2 text-slate-600">Explore our curated routes at your own pace. Tap any tour to learn more.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <a href="#/birdwatching" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Birdwatching Route</h4>
              <p className="mt-2 text-sm text-slate-600">Wetlands, marshes, and quiet estuary overlooks — perfect for spotting shorebirds.</p>
            </div>
          </a>

          <a href="#/surf-history" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1000&q=80')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Surf History Ride</h4>
              <p className="mt-2 text-sm text-slate-600">Ride through legendary breaks, murals, and surf culture landmarks.</p>
            </div>
          </a>

          <a href="#/waterfront" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80')"}} />
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

function Birdwatching() {
  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button>
      <h2 className="text-3xl font-semibold">Birdwatching Route (Self-guided)</h2>
      <p className="mt-4 text-slate-700">This peaceful half-day route takes you through Santa Cruz's richest bird habitats: tidal wetlands, marsh edges, and quiet estuary overlooks. Keep an eye out for herons, egrets, raptors, and seasonal migrants. We provide a route map and suggested stopping points for prime viewing.</p>
      <img className="mt-6 rounded-lg shadow" src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=60" alt="birdwatching" />
      <h3 className="mt-6 font-semibold">Suggested Itinerary</h3>
      <ol className="list-decimal pl-6 mt-2 text-slate-600">
        <li>Start at the lagoon overlook</li>
        <li>Ride slowly along the marsh edge</li>
        <li>Stop at the interpretive kiosk for local species notes</li>
      </ol>
    </article>
  )
}

function SurfHistory() {
  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button>
      <h2 className="text-3xl font-semibold">Surf History Ride (Self-guided)</h2>
      <p className="mt-4 text-slate-700">Ride through Santa Cruz’s surf legacy: legendary breaks, murals, and beachfront landmarks. This route highlights the people and places that shaped West Coast surfing culture. Great for casual riders interested in local stories and scenic photo stops.</p>
      <img className="mt-6 rounded-lg shadow" src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=1200&q=60" alt="surf history" />
      <h3 className="mt-6 font-semibold">Suggested Stops</h3>
      <ul className="list-disc pl-6 mt-2 text-slate-600">
        <li>Steamer Lane overlook</li>
        <li>Local surf museum and murals</li>
        <li>Historic beachside cafes</li>
      </ul>
    </article>
  )
}

function Waterfront() {
  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button>
      <h2 className="text-3xl font-semibold">Wilderness Waterfront Path (Self-guided)</h2>
      <p className="mt-4 text-slate-700">Our newest route follows tranquil waterfront paths, boardwalks, and dunes. Ideal for riders seeking quiet nature, wide bay views, and occasional wildlife sightings. The path is mostly flat and approachable for all ability levels.</p>
      <img className="mt-6 rounded-lg shadow" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60" alt="waterfront" />
      <h3 className="mt-6 font-semibold">Tips</h3>
      <ul className="list-disc pl-6 mt-2 text-slate-600">
        <li>Bring binoculars for birdlife</li>
        <li>Pack a light jacket — coastal breezes can be cool</li>
      </ul>
    </article>
  )
}

export default function App(){
  const route = useHashRoute()
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-800">
      <Nav />
      {route === '/' && <Home />}
      {route === '/rentals' && <Home />}
      {route === '/tours' && <Home />}
      {route === '/birdwatching' && <Birdwatching />}
      {route === '/surf-history' && <SurfHistory />}
      {route === '/waterfront' && <Waterfront />}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500">© {new Date().getFullYear()} Santa Cruz Bike Adventures — Serving Santa Cruz, CA</div>
      </footer>
    </div>
  )
}
