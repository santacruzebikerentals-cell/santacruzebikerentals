import React, { useEffect, useState } from 'react'
import Nav from './components/Nav'
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

function VideoHero() {
  const videoRef = React.useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/westcliff1.mov"
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full flex flex-col items-center justify-center text-white px-8">
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-4">
          Santa Cruz Bike Adventures
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-2xl">
          Explore the coastline on two wheels
        </p>
      </div>
    </section>
  );
}

function RentalSection({ title, description, image, price, duration, bookingUrl, index }) {
  return (
    <section className="sticky top-0 h-screen w-full flex flex-col">
      <div 
        className="flex-1 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
      </div>
      
      <div className="bg-white px-8 py-12 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">{title}</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">{description}</p>
        <p className="text-xl font-semibold text-sky-600 mb-6">{price} · {duration}</p>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
        >
          Book Now
        </a>
      </div>
    </section>
  );
}

function Home(){
  return (
    <div>
      <VideoHero />

      <div className="relative">
        <RentalSection
          title="Westcliff 4-Hour Adventure"
          description="Cruise the scenic coastline from the Wharf to Natural Bridges. Experience breathtaking ocean views, sea lions, and coastal wildlife. Includes delivery & pickup service."
          image="/images/bikepath.jpeg"
          price="$70"
          duration="4 hours"
          bookingUrl="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/FDAPVUKUCEOUMHGZ2TJXMEGH"
          index={0}
        />

        <RentalSection
          title="Wilderness Waterfront Path Tour"
          description="A peaceful ride along estuary and coastal paths — ideal for nature lovers. Discover quiet wildlife spots, tidal wetlands, and serene waterfront views."
          image="/images/wilderness-waterfront.jpg"
          price="$70"
          duration="4 hours"
          bookingUrl="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/YV7OZX2BA3SK3OIFZ7LCAMYE"
          index={1}
        />

        <RentalSection
          title="Custom Tour"
          description="Design your own adventure! Tell us what you want to see and explore, and we'll create a personalized route just for you. Perfect for special occasions or unique interests."
          image="/images/westcliff3.jpeg"
          price="Contact us"
          duration="Flexible"
          bookingUrl="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/PNRDNC4GPASETSC7VWJI4MQ5"
          index={2}
        />
      </div>

      <section className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Self-Guided Tours</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Explore our curated routes at your own pace. Tap any tour to learn more.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
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
        </div>
      </section>

      <section className="bg-slate-50 py-16 px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
          <h2 className="text-3xl font-bold mb-4">Contact & Service Area</h2>
          <p className="text-slate-600 mb-6">Serving Santa Cruz, California. We deliver and pick up within the local area.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-2">Quick Info</h4>
              <p className="text-sm text-slate-600">Phone: (your phone)<br/>Email: (coming soon)</p>
              <p className="mt-4 text-sm">We charge $70 for a 4-hour rental. Drop-off and pick-up service included.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function Birdwatching(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Birdwatching Route (Self-guided)</h2><p className="mt-4 text-slate-700">This peaceful half-day route takes you through Santa Cruz's richest bird habitats: tidal wetlands, marsh edges, and quiet estuary overlooks. Keep an eye out for herons, egrets, raptors, and seasonal migrants. We provide a route map and suggested stopping points for prime viewing.</p></article>) }
function SurfHistory(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Surf History Ride (Self-guided)</h2><p className="mt-4 text-slate-700">Ride through Santa Cruz's surf legacy: legendary breaks, murals, and beachfront landmarks.</p></article>) }
function Waterfront(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Wilderness Waterfront Path (Self-guided)</h2><p className="mt-4 text-slate-700">Our newest route follows tranquil waterfront paths, boardwalks, and dunes.</p></article>) }

export default function App(){ 
  const route = useHashRoute(); 
  return (
    <div className="min-h-screen bg-white text-slate-800">
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