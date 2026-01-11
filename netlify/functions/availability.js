export async function handler(event, context) {
  const serviceId = event.queryStringParameters?.serviceId;
  const locationId = event.queryStringParameters?.locationId;
  const date = event.queryStringParameters?.date;

  if (!serviceId || !locationId || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing parameters" })
    };
  }

  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Square token not configured" })
    };
  }

  try {
    const startAt = new Date(date).toISOString();
    const endAt = new Date(new Date(date).getTime() + 86400000).toISOString();

    const response = await fetch(
      "https://connect.squareupsandbox.com/v2/bookings/availability/search",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            filter: {
              start_at_range: { start_at: startAt, end_at: endAt },
              location_id: locationId,
              segment_filters: [{ service_variation_id: serviceId }],
            },
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Square response:", data);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Square API error", details: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: err.message }),
    };
  }
}
