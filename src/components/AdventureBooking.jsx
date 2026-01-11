import React, { useState, useEffect } from 'react';

export default function AdventureBooking({ serviceId, locationId }) {
  if (!serviceId || !locationId) {
    console.warn("AdventureBooking missing serviceId or locationId");
    return null;
  }

  const [numBikes, setNumBikes] = useState(1);
  const [rentalDuration, setRentalDuration] = useState('half'); // 'half' or 'full'
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch availability via Netlify Function
  const fetchAvailability = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/.netlify/functions/availability?serviceId=${serviceId}&locationId=${locationId}&date=${selectedDate}`
      );
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setAvailability(data.availabilities || []);
    } catch (err) {
      console.error("Availability error:", err);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate, numBikes, rentalDuration]);

  const getStatusLabel = (count) => {
    if (count <= 0) return "Sold Out";
    if (count > 5) return "5+ left";
    return `${count} left`;
  };

  const getPricing = () => {
    const halfDayPrice = 70;
    const fullDayPrice = 120;
    const price = rentalDuration === 'half' ? halfDayPrice : fullDayPrice;
    return price * numBikes;
  };

  return (
    <div className="mt-4 space-y-3 border-t pt-4">
      {/* Rental Duration */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Rental Duration
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setRentalDuration('half')}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
              rentalDuration === 'half'
                ? 'border-sky-600 bg-sky-50 text-sky-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div>Half Day</div>
            <div className="text-xs font-normal mt-1">4 hours • $70</div>
          </button>
          <button
            onClick={() => setRentalDuration('full')}
            className={`p-3 rounded-lg border-2 transition-all text-sm font-semibold ${
              rentalDuration === 'full'
                ? 'border-sky-600 bg-sky-50 text-sky-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-600'
            }`}
          >
            <div>Full Day</div>
            <div className="text-xs font-normal mt-1">8 hours • $120</div>
          </button>
        </div>
      </div>

      {/* Bikes & Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Bikes
          </label>
          <input
            type="number"
            min="1"
            max="15"
            value={numBikes}
            onChange={(e) => setNumBikes(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-
