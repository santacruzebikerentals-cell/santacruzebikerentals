// netlify/functions/availability.js
import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const { serviceId, locationId, date } = event.queryStringParameters;

    if (!serviceId || !locationId || !date) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing query parameters" }),
      };
    }

    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Square token not set" }),
      };
    }

    const startAt = new Date(date).toISOString();
    const endAt = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString();

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

    if (!response.ok) {
      const text = await response.text();
      console.error("Square API error:", text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Square API error" }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ availabilities: data.availabilities || [] }),
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
}
