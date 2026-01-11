import React, { useState, useEffect } from 'react';
import { Calendar, Bike, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function BikeRentalBooking() {
  const [numBikes, setNumBikes] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [rentalType, setRentalType] = useState('half'); // 'half' or 'full'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Accessing the token from .env file via Vite
  const SQUARE_ACCESS_TOKEN = import.meta.env.VITE_SQUARE_ACCESS_TOKEN || '';
  const LOCATION_ID = 'LY85EFNS8N2Q3';

  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const display = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      // Check if rental would end by 5 PM
      const endHour = hour + (rentalType === 'half' ? 4 : 8);
      if (endHour <= 17) {
        slots.push({ value: time, display, endHour });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const createBooking = async () => {
    if (!selectedDate || !selectedTime) {
      setMessage({ type: 'error', text: 'Please select both date and time' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const startDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
      const durationMinutes = rentalType === 'half' ? 240 : 480; 
      
      const bookingData = {
        booking: {
          location_id: LOCATION_ID,
          start_at: startDateTime.toISOString(),
          customer_note: `${numBikes} bike(s) - ${rentalType === 'half' ? 'Half Day (4hr)' : 'Full Day (8hr)'} rental`,
          appointment_segments: []
        }
      };

      // Create a segment for each bike
      // Note: You must replace 'YOUR_SERVICE_VARIATION_ID' with the ID from your Square Dashboard
      for (let i = 0; i < numBikes; i++) {
        bookingData.booking.appointment_segments.push({
          duration_minutes: durationMinutes,
          service_variation_id: 'YOUR_SERVICE_VARIATION_ID', 
        });
      }

      const response = await fetch('https://connect.squareupsandbox.com/v2/bookings', {
        method: 'POST',
        headers: {
          'Square-Version': '2024-12-18',
          'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (data.booking) {
        const endTime = new Date(startDateTime.getTime() + durationMinutes * 60000);
        setMessage({ 
          type: 'success', 
          text: `Booking successful! ${numBikes} bike(s) reserved for ${selectedDate}.` 
        });
      } else if (data.errors) {
        setMessage({ 
          type: 'error', 
          text: `Error: ${data.errors.map(e => e.detail).join(', ')}` 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Connection Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const getEndTime = () => {
    if (!selectedTime) return '';
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const duration = rentalType === 'half' ? 4 : 8;
    const endHour = hours + duration;
    const endTime = new Date(`2000-01-01T${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    return endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden md:max-w-2xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Bike className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Book Your Ride</h1>
        </div>

        <div className="space-y-6">
          {/* Number of Bikes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Bikes</label>
            <input
              type="number"
              min="1" max="15"
              value={numBikes}
              onChange={(e) => setNumBikes(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Duration Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rental Duration</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setRentalType('half')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  rentalType === 'half' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Clock className={`w-6 h-6 mb-1 ${rentalType === 'half' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="font-bold text-gray-900">Half Day</span>
                <span className="text-xs text-gray-500">4 Hours</span>
              </button>
              <button
                onClick={() => setRentalType('full')}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  rentalType === 'full' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Calendar className={`w-6 h-6 mb-1 ${rentalType === 'full' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className="font-bold text-gray-900">Full Day</span>
                <span className="text-xs text-gray-500">8 Hours</span>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              min={getTodayDate()}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>{slot.display}</option>
              ))}
            </select>
            {selectedTime && (
              <p className="mt-2 text-xs text-gray-500 italic">Expected Return: {getEndTime()}</p>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={createBooking}
            disabled={loading || !selectedDate}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : `Confirm Booking`}
          </button>

          {/* Status Message */}
          {message.text && (
            <div className={`p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
            }`}>
              {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}