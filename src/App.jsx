import React, { useEffect, useState, useRef } from 'react'
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

// Smooth scroll utility
function smoothScrollTo(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Intersection Observer for fade-in animations
function useFadeIn() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isVisible];
}

function VideoHero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden" style={{ paddingTop: '64px' }}>
      {/* Parallax Video Background */}
      <div className="absolute inset-0" style={{ transform: 'translateZ(-1px) scale(1.5)' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/videos/westcliff1.mov"
          muted
          loop
          playsInline
        />
      </div>
      
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative h-full flex flex-col items-center justify-center text-white px-8" style={{ paddingTop: '0' }}>
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-4 animate-fade-in">
          Santa Cruz Bike Adventures
        </h1>
        <p className="text-xl md:text-2xl text-center max-w-2xl mb-8 animate-fade-in-delay">
          Explore the coastline on two wheels
        </p>
        <button
          onClick={() => smoothScrollTo('rentals')}
          className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all animate-fade-in-delay-2"
        >
          Book Your Adventure
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function StatsSection() {
  const [ref, isVisible] = useFadeIn();

  return (
    <section 
      ref={ref}
      className={`py-16 bg-gradient-to-b from-sky-50 to-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">50+</div>
            <div className="text-slate-600">Miles of Coastal Trails</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">100%</div>
            <div className="text-slate-600">Family Friendly</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">4hr</div>
            <div className="text-slate-600">Perfect Adventure Length</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-sky-600 mb-2">$70</div>
            <div className="text-slate-600">Includes Delivery & Pickup</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RentalCard({ title, description, images, price, duration, bookingUrl, delay }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [ref, isVisible] = useFadeIn();

  return (
    <div 
      ref={ref}
      className={`bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image Carousel - 3 images side by side */}
      <div className="grid grid-cols-3 h-80">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`relative cursor-pointer transition-all duration-300 ${
              currentImage === idx ? 'brightness-100' : 'brightness-75 hover:brightness-90'
            }`}
            onClick={() => setCurrentImage(idx)}
          >
            {img.type === 'map' ? (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center p-4">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                  <rect width="200" height="200" fill="#E0F2FE"/>
                  <path d="M20 180 Q60 140, 100 160 T180 140" stroke="#0EA5E9" strokeWidth="3" fill="none"/>
                  <circle cx="20" cy="180" r="6" fill="#DC2626"/>
                  <circle cx="180" cy="140" r="6" fill="#16A34A"/>
                  <text x="100" y="40" fontSize="14" fill="#0F172A" textAnchor="middle" fontWeight="bold">
                    {img.label}
                  </text>
                  <text x="100" y="60" fontSize="10" fill="#64748B" textAnchor="middle">
                    Scenic Coastal Route
                  </text>
                </svg>
              </div>
            ) : (
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {img.label}
            </div>
          </div>
        ))}
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-sky-600">{price}</span>
          <span className="text-slate-500">{duration}</span>
        </div>
        
        {/* Calendar Preview */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="text-sm font-semibold text-slate-700 mb-2">Next Available:</div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="font-semibold">Today</div>
              <div className="text-green-600">3 slots</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="font-semibold">Tomorrow</div>
              <div className="text-green-600">5 slots</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <div className="font-semibold">Wed</div>
              <div className="text-green-600">4 slots</div>
            </div>
          </div>
        </div>

        <a
          href={bookingUrl}
          target="_blank"
          rel="noreferrer"
          className="block w-full bg-sky-600 hover:bg-sky-700 text-white text-center px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Book Now
        </a>
      </div>
    </div>
  );
}

function Home(){
  return (
    <div>
      <VideoHero />
      <StatsSection />

      <section id="rentals" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Choose Your Adventure</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Select your perfect coastal ride. Each rental includes delivery, pickup, helmet, lock, and route map.
          </p>

          <div className="space-y-8">
            <RentalCard
              title="Westcliff 4-Hour Adventure"
              description="Cruise the scenic coastline from the Wharf to Natural Bridges. Experience breathtaking ocean views, sea lions, and coastal wildlife."
              images={[
                { src: '/images/bikepath.jpeg', label: 'Coastal Path' },
                { src: '/images/westcliff3.jpeg', label: 'Ocean Views' },
                { type: 'map', label: 'Westcliff Route' }
              ]}
              price="$70"
              duration="4 hours"
              bookingUrl="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/FDAPVUKUCEOUMHGZ2TJXMEGH"
              delay={0}
            />

            <RentalCard
              title="Wilderness Waterfront Path Tour"
              description="A peaceful ride along estuary and coastal paths — ideal for nature lovers. Discover quiet wildlife spots, tidal wetlands, and serene waterfront views."
              images={[
                { src: '/images/westcliff3.jpeg', label: 'Waterfront' },
                { src: '/images/bikepath.jpeg', label: 'Nature Trail' },
                { type: 'map', label: 'Waterfront Route' }
              ]}
              price="$70"
              duration="4 hours"
              bookingUrl="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/YV7OZX2BA3SK3OIFZ7LCAMYE"
              delay={200}
            />

            <RentalCard
              title="Custom Tour"
              description="Design your own adventure! Tell us what you want to see and explore, and we'll create a personalized route just for you. Perfect for special occasions or unique interests."
              images={[
                { src: '/images/bikepath.jpeg', label: 'Your Route' },
                { src: '/images/westcliff3.jpeg', label: 'Custom Path' },
                { type: 'map', label: 'Custom Design' }
              ]}
              price="Contact us"
              duration="Flexible"
              bookingUrl="https://book.squareup.com/appointments/4nurjndxax52bh/location/LY85EFNS8N2Q3/services/PNRDNC4GPASETSC7VWJI4MQ5"
              delay={400}
            />
          </div>
        </div>
      </section>

      <section id="tours" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-4">Self-Guided Tours</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Explore our curated routes at your own pace. Tap any tour to learn more.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <TourCard
              href="#/birdwatching"
              image="/images/birdwatching.jpg"
              title="Birdwatching Route"
              description="Wetlands, marshes, and quiet estuary overlooks — perfect for spotting shorebirds."
              delay={0}
            />
            <TourCard
              href="#/surf-history"
              image="/images/surf-history.jpg"
              title="Surf History Ride"
              description="Ride through legendary breaks, murals, and surf culture landmarks."
              delay={200}
            />
            <TourCard
              href="#/waterfront"
              image="/images/westcliff3.jpeg"
              title="Wilderness Waterfront Path"
              description="A tranquil coastal path with dunes, estuary views, and quiet wildlife spots."
              delay={400}
            />
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gradient-to-br from-sky-50 to-white p-8 rounded-2xl shadow-lg">
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
        </div>
      </section>
    </div>
  )
}

function TourCard({ href, image, title, description, delay }) {
  const [ref, isVisible] = useFadeIn();

  return (
    <a
      ref={ref}
      href={href}
      className={`block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <h4 className="font-semibold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </a>
  );
}

function Birdwatching(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Birdwatching Route (Self-guided)</h2><p className="mt-4 text-slate-700">This peaceful half-day route takes you through Santa Cruz's richest bird habitats: tidal wetlands, marsh edges, and quiet estuary overlooks. Keep an eye out for herons, egrets, raptors, and seasonal migrants. We provide a route map and suggested stopping points for prime viewing.</p></article>) }
function SurfHistory(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Surf History Ride (Self-guided)</h2><p className="mt-4 text-slate-700">Ride through Santa Cruz's surf legacy: legendary breaks, murals, and beachfront landmarks.</p></article>) }
function Waterfront(){ return (<article className="max-w-5xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600">← Return to Home</button><h2 className="text-3xl font-semibold">Wilderness Waterfront Path (Self-guided)</h2><p className="mt-4 text-slate-700">Our newest route follows tranquil waterfront paths, boardwalks, and dunes.</p></article>) }

export default function App(){ 
  const route = useHashRoute(); 
  
  // Add smooth scroll handler for nav
  useEffect(() => {
    window.smoothScrollTo = smoothScrollTo;
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out 0.3s backwards; }
        .animate-fade-in-delay-2 { animation: fade-in 1s ease-out 0.6s backwards; }
      `}</style>
      
      <Nav />
      {route === '/' && <Home />}
      {route === '/rentals' && <Home />}
      {route === '/tours' && <Home />}
      {route === '/birdwatching' && <Birdwatching />}
      {route === '/surf-history' && <SurfHistory />}
      {route === '/waterfront' && <Waterfront />}

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