import React, { useEffect, useState } from 'react'
import { Calendar, Bike, AlertCircle, CheckCircle, Clock, X } from 'lucide-react'

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route.replace('#','')
}

function BookingModal({ isOpen, onClose, selectedService }) {
  const [numBikes, setNumBikes] = useState(1)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const SQUARE_ACCESS_TOKEN = 'EAAAl11LbuyBJIPjHhaVQevLXxHvZsI_HD7g7qNuv9swDlmjYBVKxZho52xf_6hv'
  const LOCATION_ID = 'LY85EFNS8N2Q3'

  // Service configurations
  const services = {
    westcliff: { name: 'West Cliff 4-Hour E-Bike Adventure', duration: 4, price: 70 },
    wilderness: { name: 'Wilderness Waterfront Path Tour', duration: 4, price: 70 }
  }

  const currentService = services[selectedService] || services.westcliff

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      const endHour = hour + currentService.duration
      if (endHour <= 17) {
        const time = `${hour.toString().padStart(2, '0')}:00`
        const display = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        slots.push({ value: time, display })
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const createBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage({ type: 'error', text: 'Please select both date and time' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`)
      const durationMinutes = currentService.duration * 60
      
      const bookingData = {
        booking: {
          location_id: LOCATION_ID,
          start_at: startDateTime.toISOString(),
          customer_note: `${numBikes} bike(s) - ${currentService.name}`,
          appointment_segments: [{
            duration_minutes: durationMinutes,
            service_variation_id: 'YOUR_SERVICE_VARIATION_ID',
            team_member_id: 'YOUR_TEAM_MEMBER_ID'
          }]
        }
      }

      const response = await fetch('https://connect.squareupsandbox.com/v2/bookings', {
        method: 'POST',
        headers: {
          'Square-Version': '2024-12-18',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      const data = await response.json()

      if (data.booking) {
        const endTime = new Date(startDateTime.getTime() + durationMinutes * 60000)
        setMessage({ 
          type: 'success', 
          text: `Booking confirmed! ${numBikes} bike(s) from ${startDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} to ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}. Booking ID: ${data.booking.id}` 
        })
      } else if (data.errors) {
        setMessage({ 
          type: 'error', 
          text: `Error: ${data.errors.map(e => e.detail).join(', ')}` 
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const getTodayDate = () => new Date().toISOString().split('T')[0]

  const getEndTime = () => {
    if (!selectedTime) return ''
    const [hours, minutes] = selectedTime.split(':').map(Number)
    const endHour = hours + currentService.duration
    const endTime = new Date(`2000-01-01T${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
    return endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bike className="w-6 h-6 text-sky-600" />
            <h2 className="text-2xl font-bold text-slate-900">Book Your Ride</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
            <h3 className="font-semibold text-sky-900">{currentService.name}</h3>
            <p className="text-sm text-sky-700 mt-1">${currentService.price} · {currentService.duration} hours</p>
          </div>

          {/* Number of Bikes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Number of Bikes (1-15)
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={numBikes}
              onChange={(e) => setNumBikes(Math.min(15, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              min={getTodayDate()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Start Time (9 AM - 5 PM)
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.display}
                </option>
              ))}
            </select>
            {selectedTime && (
              <p className="mt-2 text-sm text-slate-600">
                Return time: {getEndTime()}
              </p>
            )}
          </div>

          {/* Booking Summary */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm text-slate-700">
              <p><span className="font-medium">Bikes:</span> {numBikes}</p>
              <p><span className="font-medium">Duration:</span> {currentService.duration} hours</p>
              {selectedDate && <p><span className="font-medium">Date:</span> {new Date(selectedDate + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              {selectedTime && <p><span className="font-medium">Time:</span> {new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {getEndTime()}</p>}
              <p className="pt-2 text-base"><span className="font-medium">Total:</span> ${currentService.price * numBikes}</p>
            </div>
          </div>

          {/* Create Booking Button */}
          <button
            onClick={createBooking}
            disabled={loading || !selectedDate || !selectedTime}
            className="w-full bg-sky-600 text-white py-3 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
          >
            <CheckCircle className="w-5 h-5" />
            {loading ? 'Creating Booking...' : `Book ${numBikes} Bike${numBikes > 1 ? 's' : ''}`}
          </button>

          {/* Message Display */}
          {message.text && (
            <div className={`p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Setup Info */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-900 text-sm mb-2">⚠️ Setup Required:</h4>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Replace YOUR_SERVICE_VARIATION_ID with actual Square service ID</li>
              <li>• Replace YOUR_TEAM_MEMBER_ID with actual team member ID</li>
              <li>• This is currently using Square Sandbox for testing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function Nav(){
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
          <a href="#rentals" className="text-sm text-slate-700 hover:text-slate-900">Rentals</a>
          <a href="#tours" className="text-sm text-slate-700 hover:text-slate-900">Tours</a>
          <a href="#contact" className="text-sm text-slate-700 hover:text-slate-900">Contact</a>
          <a href="#rentals" className="text-sm bg-sky-600 text-white px-3 py-2 rounded">Book Now</a>
        </nav>
      </div>
    </header>
  )
}

function Home({ onOpenBooking }){
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900">Ride the Coastline. Explore the Wild. No Hassle.</h1>
          <p className="mt-4 text-lg text-slate-700">Premium E-Bike Rentals Delivered Anywhere in Santa Cruz.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => onOpenBooking('westcliff')} className="inline-block bg-sky-600 text-white px-5 py-3 rounded-lg shadow hover:scale-[1.02] transition">Book Your Ride</button>
            <a href="#tours" className="inline-block border border-slate-200 px-5 py-3 rounded-lg">See Tours</a>
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
        <p className="mt-2 text-slate-600">Choose a ride and book directly — no external links needed.</p>

        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <WestCliffCard onOpenBooking={onOpenBooking} />
          <button onClick={() => onOpenBooking('wilderness')} className="card text-left">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60')"}} />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-slate-900">Wilderness Waterfront Path Tour</h3>
              <p className="mt-2 text-sm text-slate-600">A peaceful ride along estuary and coastal paths — ideal for nature lovers.</p>
              <p className="mt-3 font-medium text-sky-600">Guided or self-guided · ~4 hours</p>
            </div>
          </button>
        </div>
      </section>

      <section id="tours" className="mt-12">
        <h2 className="text-2xl font-semibold">Self-Guided Tours</h2>
        <p className="mt-2 text-slate-600">Explore our curated routes at your own pace. Tap any tour to learn more.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <a href="#/birdwatching" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=60')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Birdwatching Route</h4>
              <p className="mt-2 text-sm text-slate-600">Wetlands, marshes, and quiet estuary overlooks — perfect for spotting shorebirds.</p>
            </div>
          </a>

          <a href="#/surf-history" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=60')"}} />
            <div className="p-5">
              <h4 className="font-semibold text-slate-900">Surf History Ride</h4>
              <p className="mt-2 text-sm text-slate-600">Ride through legendary breaks, murals, and surf culture landmarks.</p>
            </div>
          </a>

          <a href="#/waterfront" className="card small-card">
            <div className="card-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=60')"}} />
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

function WestCliffCard({ onOpenBooking }){
  const slides = [
    { type: 'image', src: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=60' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&q=60' }
  ]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % slides.length)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <button onClick={() => onOpenBooking('westcliff')} className="card relative text-left">
      <div className="relative">
        {slides.map((s, i) => (
          <div key={i} style={{display: i === index ? 'block' : 'none'}} className="w-full h-64">
            <div style={{backgroundImage: `url('${s.src}')`}} className="card-image" />
          </div>
        ))}

        <button onClick={(e) => { e.stopPropagation(); setIndex((index - 1 + slides.length) % slides.length) }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition">‹</button>
        <button onClick={(e) => { e.stopPropagation(); setIndex((index + 1) % slides.length) }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition">›</button>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900">West Cliff 4-Hour E-Bike Adventure</h3>
        <p className="mt-2 text-sm text-slate-600">Cruise the coastline from the Wharf to Natural Bridges. Includes delivery & pickup anywhere in Santa Cruz.</p>
        <p className="mt-3 font-medium text-sky-600">$70 · 4 hours</p>
      </div>
    </button>
  )
}

function Birdwatching(){ return (<article className="max-w-4xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600 hover:text-sky-700">← Return to Home</button><h2 className="text-3xl font-semibold">Birdwatching Route (Self-guided)</h2><p className="mt-4 text-slate-700">This peaceful half-day route takes you through Santa Cruz's richest bird habitats: tidal wetlands, marsh edges, and quiet estuary overlooks. Keep an eye out for herons, egrets, raptors, and seasonal migrants. We provide a route map and suggested stopping points for prime viewing.</p></article>) }
function SurfHistory(){ return (<article className="max-w-4xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600 hover:text-sky-700">← Return to Home</button><h2 className="text-3xl font-semibold">Surf History Ride (Self-guided)</h2><p className="mt-4 text-slate-700">Ride through Santa Cruz's surf legacy: legendary breaks, murals, and beachfront landmarks.</p></article>) }
function Waterfront(){ return (<article className="max-w-4xl mx-auto px-6 py-12"><button onClick={() => (window.location.hash = '/')} className="inline-block mb-6 text-sky-600 hover:text-sky-700">← Return to Home</button><h2 className="text-3xl font-semibold">Wilderness Waterfront Path (Self-guided)</h2><p className="mt-4 text-slate-700">Our newest route follows tranquil waterfront paths, boardwalks, and dunes.</p></article>) }

export default function App(){ 
  const route = useHashRoute()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('westcliff')

  const openBooking = (service) => {
    setSelectedService(service)
    setBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white text-slate-800">
      <Nav />
      {route === '/' && <Home onOpenBooking={openBooking} />}
      {route === '/rentals' && <Home onOpenBooking={openBooking} />}
      {route === '/tours' && <Home onOpenBooking={openBooking} />}
      {route === '/birdwatching' && <Birdwatching />}
      {route === '/surf-history' && <SurfHistory />}
      {route === '/waterfront' && <Waterfront />}
      
      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)}
        selectedService={selectedService}
      />
      
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500">
          © {new Date().getFullYear()} Santa Cruz Bike Adventures — Serving Santa Cruz, CA
        </div>
      </footer>
    </div>
  )
}