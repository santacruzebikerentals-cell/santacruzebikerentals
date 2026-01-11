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

const fetchAvailability = async () => {
  if (!selectedDate) return;

  setLoading(true);
  try {
    const response = await fetch(`/.netlify/functions/availability?serviceId=${serviceId}&locationId=${locationId}&date=${selectedDate}`);
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

    }
    if (!selectedDate) return;

    setLoading(true);
    try {
      const startAt = new Date(selectedDate).toISOString();
      const endAt = new Date(new Date(selectedDate).getTime() + 86400000).toISOString();

      const response = await fetch(
        'https://connect.squareupsandbox.com/v2/bookings/availability/search',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SQUARE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: {
              filter: {
                start_at_range: { start_at: startAt, end_at: endAt },
                location_id: locationId,
                segment_filters: [{ service_variation_id: serviceId }]
              }
            }
          })
        }
      );

      if (!response.ok) {
        console.error("Square API error", response.status, await response.text());
        setAvailability([]);
        return;
      }

      const data = await response.json();
      console.log("Square availability response:", data); // Debug log
      setAvailability(data.availabilities || []);
    } catch (err) {
      console.error("Availability error:", err);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  ;

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
    const fullDayPrice = 120; // Adjust this to your actual price
    const price = rentalDuration === 'half' ? halfDayPrice : fullDayPrice;
    return price * numBikes;
  };

  return (
    <div className="mt-4 space-y-3 border-t pt-4">
      {/* Rental Duration Selection */}
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

      {/* Compact Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Number of Bikes */}
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

        {/* Select Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Available Times - Only show when date is selected */}
      {selectedDate && (
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-2">
            Available Times
          </label>
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
              <p className="text-xs text-slate-500 mt-2">Checking availability...</p>
            </div>
          ) : availability.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {availability.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedTime(slot.start_at)}
                  className={`text-left p-2 border rounded-lg transition-all text-sm ${
                    selectedTime === slot.start_at 
                      ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-200' 
                      : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold text-slate-900">
                    {new Date(slot.start_at).toLocaleTimeString([], { hour: 'numeric', minute:'2-digit' })}
                  </div>
                  <div className="text-[10px] text-sky-600 font-medium">
                    {getStatusLabel(10)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 mb-3">No available times for this date</p>
              <p className="text-xs text-slate-400 mb-3">Try a different date</p>
              <a 
                href="mailto:your-email@example.com?subject=Bike Rental Inquiry" 
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Email Us
              </a>
            </div>
          )}
        </div>
      )}

      {/* Confirm Button - Only show when time is selected */}
      {selectedTime && (
        <div>
          <div className="mb-2 p-3 bg-slate-50 rounded-lg text-sm">
            <div className="font-semibold text-slate-800">Total: ${getPricing()}</div>
            <div className="text-xs text-slate-600 mt-1">
              {numBikes} bike{numBikes > 1 ? 's' : ''} × {rentalDuration === 'half' ? '4 hours' : '8 hours'}
            </div>
          </div>
          <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md">
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
