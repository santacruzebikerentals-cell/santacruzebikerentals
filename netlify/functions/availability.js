import fetch from 'node-fetch';

export async function handler(event, context) {
  const { serviceId, locationId, date } = JSON.parse(event.body);

  const token = process.env.SQUARE_ACCESS_TOKEN; // server-side secret

  const startAt = new Date(date).toISOString();
  const endAt = new Date(new Date(date).getTime() + 86400000).toISOString();

  const response = await fetch(
    'https://connect.squareupsandbox.com/v2/bookings/availability/search',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
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

  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
}
