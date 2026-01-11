const createBooking = async () => {
  if (!selectedDate || !selectedTime) {
    setMessage({ type: 'error', text: 'Please select both date and time' });
    return;
  }

  setLoading(true);
  setMessage({ type: '', text: '' });

  try {
    const response = await fetch('/.netlify/functions/createBooking', {
      method: 'POST',
      body: JSON.stringify({ numBikes, rentalType, selectedDate, selectedTime }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (response.ok && data.booking) {
      setMessage({ type: 'success', text: `Booking successful! ${numBikes} bike(s) reserved for ${selectedDate}.` });
    } else {
      setMessage({ type: 'error', text: data.error || 'Booking failed' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: `Connection error: ${error.message}` });
  } finally {
    setLoading(false);
  }
};
