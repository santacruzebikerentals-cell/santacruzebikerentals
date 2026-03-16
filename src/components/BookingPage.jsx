import React, { useState, useEffect } from 'react';

/* ─── constants ─── */
const TOURS = [
  {
    id: 'westcliff',
    name: 'West Cliff Ride',
    serviceId: 'FDAPVUKUCEOUMHGZ2TJXMEGH',
    image: '/images/bikepath.jpeg',
    desc: 'Cruise the coastline from the Wharf to Natural Bridges. Includes delivery & pickup.',
  },
  {
    id: 'wilderness',
    name: 'Wilderness Waterfront Path',
    serviceId: 'YV7OZX2BA3SK3OIFZ7LCAMYE',
    image: '/images/wilderness-waterfront.jpg',
    desc: 'A peaceful ride along estuary and coastal paths — ideal for nature lovers.',
  },
];

const DURATIONS = [
  { id: 'half', label: 'Half Day', hours: 4, price: 70 },
  { id: 'full', label: 'Full Day', hours: 8, price: 120 },
];

const STEPS = ['Tour', 'Schedule', 'Riders', 'Review'];

function emptyRider() {
  return { firstName: '', lastName: '', email: '', phone: '', height: '' };
}

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  });
}

/* ─── main component ─── */
export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [tour, setTour] = useState(null);
  const [duration, setDuration] = useState(null);
  const [bikeCount, setBikeCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [riders, setRiders] = useState([emptyRider()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const totalPrice = duration ? duration.price * bikeCount : 0;

  /* sync riders array length with bikeCount */
  useEffect(() => {
    setRiders((prev) => {
      if (bikeCount > prev.length) {
        return [...prev, ...Array.from({ length: bikeCount - prev.length }, emptyRider)];
      }
      return prev.slice(0, bikeCount);
    });
  }, [bikeCount]);

  /* fetch availability when date or tour changes */
  useEffect(() => {
    if (!selectedDate || !tour) return;
    setLoadingSlots(true);
    setSlots([]);
    setSelectedSlot(null);
    setError('');

    fetch('/.netlify/functions/square-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId: tour.serviceId, date: selectedDate }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSlots(data.availabilities || []);
      })
      .catch((e) => setError(e.message || 'Failed to load available times'))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, tour]);

  /* submit booking */
  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/.netlify/functions/square-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: tour.serviceId,
          tourName: tour.name,
          duration,
          bikeCount,
          startAt: selectedSlot.startAt,
          teamMemberId: selectedSlot.teamMemberId,
          serviceVariationVersion: selectedSlot.serviceVariationVersion,
          riders,
          totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setConfirmation(data);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  /* ─── confirmation screen ─── */
  if (step === 4 && confirmation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600 mb-6">Your reservation has been created. A confirmation email is on its way.</p>

          <div className="text-left bg-slate-50 rounded-xl p-6 mb-6 space-y-3">
            <Row label="Booking ID" value={confirmation.bookingId} />
            <Row label="Tour" value={tour.name} />
            <Row label="Date" value={formatDate(selectedSlot.startAt)} />
            <Row label="Time" value={formatTime(selectedSlot.startAt)} />
            <Row label="Duration" value={`${duration.label} (${duration.hours} hrs)`} />
            <Row label="Bikes" value={bikeCount} />
            <Row label="Total" value={`$${totalPrice}`} bold />
          </div>

          <h3 className="text-left font-semibold text-slate-800 mb-2">Riders</h3>
          <div className="text-left space-y-2 mb-8">
            {riders.map((r, i) => (
              <div key={i} className="bg-white border rounded-lg px-4 py-2 text-sm flex justify-between">
                <span>{r.firstName} {r.lastName}</span>
                <span className="text-slate-500">Height: {r.height}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => (window.location.hash = '/')}
            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* ─── booking wizard ─── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => (window.location.hash = '/')} className="text-sky-600 hover:text-sky-800 mb-6 inline-flex items-center gap-1 text-sm font-medium">
        ← Back to Home
      </button>

      <h1 className="text-3xl font-bold text-slate-900 mb-1">Book Your Ride</h1>
      <p className="text-slate-500 mb-8">Reserve your bikes in a few easy steps.</p>

      {/* step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 text-sm font-medium ${i <= step ? 'text-sky-600' : 'text-slate-400'}`}>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${i < step ? 'bg-sky-600 text-white' : i === step ? 'bg-sky-100 text-sky-700 ring-2 ring-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                {i < step ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-sky-600' : 'bg-slate-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
          <button onClick={() => setError('')} className="float-right font-bold">×</button>
        </div>
      )}

      {/* ─── step 0 : tour + duration + bikes ─── */}
      {step === 0 && (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Select Your Tour</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {TOURS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTour(t); setSelectedDate(''); setSlots([]); setSelectedSlot(null); }}
                  className={`text-left rounded-xl border-2 overflow-hidden transition-all
                    ${tour?.id === t.id ? 'border-sky-500 ring-2 ring-sky-200 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="h-36 bg-cover bg-center" style={{ backgroundImage: `url('${t.image}')` }} />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Choose Duration</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDuration(d)}
                  className={`p-5 rounded-xl border-2 text-left transition-all
                    ${duration?.id === d.id ? 'border-sky-500 ring-2 ring-sky-200 bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="text-lg font-bold text-slate-900">{d.label}</div>
                  <div className="text-sm text-slate-500">{d.hours} hours</div>
                  <div className="mt-2 text-2xl font-bold text-sky-600">${d.price}<span className="text-sm font-normal text-slate-400"> / bike</span></div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Number of Bikes</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBikeCount((c) => Math.max(1, c - 1))}
                className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-xl font-bold text-slate-600 hover:border-sky-500 hover:text-sky-600 transition-colors"
              >
                −
              </button>
              <span className="text-3xl font-bold text-slate-900 w-12 text-center">{bikeCount}</span>
              <button
                onClick={() => setBikeCount((c) => Math.min(15, c + 1))}
                className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center text-xl font-bold text-slate-600 hover:border-sky-500 hover:text-sky-600 transition-colors"
              >
                +
              </button>
              <span className="text-sm text-slate-400">max 15</span>
            </div>
            {duration && (
              <p className="mt-3 text-slate-600 font-medium">
                Subtotal: <span className="text-sky-600 font-bold text-lg">${totalPrice}</span>
                <span className="text-sm text-slate-400"> ({bikeCount} × ${duration.price})</span>
              </p>
            )}
          </section>

          <button
            onClick={() => { setError(''); setStep(1); }}
            disabled={!tour || !duration}
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Next: Pick a Date →
          </button>
        </div>
      )}

      {/* ─── step 1 : date & time ─── */}
      {step === 1 && (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Select a Date</h2>
            <input
              type="date"
              min={tomorrow()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus:border-sky-500 focus:outline-none w-full sm:w-auto"
            />
          </section>

          {selectedDate && (
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Available Times</h2>
              {loadingSlots && (
                <div className="flex items-center gap-3 text-slate-500 py-4">
                  <div className="w-5 h-5 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
                  Loading available times…
                </div>
              )}
              {!loadingSlots && slots.length === 0 && (
                <p className="text-slate-500 py-4">No available times for this date. Please choose another date.</p>
              )}
              {!loadingSlots && slots.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                        ${selectedSlot?.startAt === slot.startAt
                          ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-200'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                    >
                      {formatTime(slot.startAt)}
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(0)} className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 transition-colors">
              ← Back
            </button>
            <button
              onClick={() => { setError(''); setStep(2); }}
              disabled={!selectedSlot}
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: Rider Info →
            </button>
          </div>
        </div>
      )}

      {/* ─── step 2 : rider information ─── */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">Rider Information</h2>
          <p className="text-sm text-slate-500">Please provide details for each rider. The first rider is the primary contact.</p>

          {riders.map((rider, i) => (
            <div key={i} className="bg-white border rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-slate-800">
                Rider {i + 1} {i === 0 && <span className="text-xs text-sky-600 ml-2">(Primary Contact)</span>}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First Name" value={rider.firstName} required
                  onChange={(v) => updateRider(i, 'firstName', v)} />
                <Input label="Last Name" value={rider.lastName} required
                  onChange={(v) => updateRider(i, 'lastName', v)} />
                <Input label="Email" type="email" value={rider.email} required
                  onChange={(v) => updateRider(i, 'email', v)} />
                <Input label="Phone" type="tel" value={rider.phone} required
                  onChange={(v) => updateRider(i, 'phone', v)} />
                <Input label="Height" placeholder={'e.g. 5\'8"'} value={rider.height} required
                  onChange={(v) => updateRider(i, 'height', v)} />
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 transition-colors">
              ← Back
            </button>
            <button
              onClick={() => {
                if (!validateRiders()) return;
                setError('');
                setStep(3);
              }}
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Next: Review →
            </button>
          </div>
        </div>
      )}

      {/* ─── step 3 : review ─── */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-slate-800">Review Your Booking</h2>

          <div className="bg-white border rounded-xl p-6 space-y-3">
            <Row label="Tour" value={tour.name} />
            <Row label="Duration" value={`${duration.label} (${duration.hours} hrs)`} />
            <Row label="Bikes" value={bikeCount} />
            <Row label="Date" value={formatDate(selectedSlot.startAt)} />
            <Row label="Time" value={formatTime(selectedSlot.startAt)} />
            <hr className="border-slate-100" />
            <Row label="Total" value={`$${totalPrice}`} bold />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Riders</h3>
            <div className="space-y-2">
              {riders.map((r, i) => (
                <div key={i} className="bg-slate-50 rounded-lg px-4 py-3 text-sm grid sm:grid-cols-4 gap-2">
                  <span className="font-medium">{r.firstName} {r.lastName}</span>
                  <span className="text-slate-500">{r.email}</span>
                  <span className="text-slate-500">{r.phone}</span>
                  <span className="text-slate-500">Height: {r.height}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(2)} className="px-6 py-3 rounded-lg border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300 transition-colors">
              ← Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {submitting ? 'Creating Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function updateRider(index, field, value) {
    setRiders((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function validateRiders() {
    for (let i = 0; i < riders.length; i++) {
      const r = riders[i];
      if (!r.firstName.trim() || !r.lastName.trim() || !r.email.trim() || !r.phone.trim() || !r.height.trim()) {
        setError(`Please fill in all fields for Rider ${i + 1}.`);
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
        setError(`Please enter a valid email for Rider ${i + 1}.`);
        return false;
      }
    }
    return true;
  }
}

/* ─── small helpers ─── */
function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className={`text-slate-900 ${bold ? 'text-lg font-bold text-sky-600' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label} {required && <span className="text-red-400">*</span>}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full border-2 border-slate-200 rounded-lg px-4 py-2.5 text-slate-800 placeholder:text-slate-300 focus:border-sky-500 focus:outline-none transition-colors"
      />
    </label>
  );
}
