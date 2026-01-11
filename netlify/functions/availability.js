export async function handler(event, context) {
  // Extract parameters from query string
  const serviceId = event.queryStringParameters?.serviceId;
  const locationId = event.queryStringParameters?.locationId;
  const date = event.queryStringParameters?.date;

  if (!serviceId || !locationId || !date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing parameters" }),
    };
  }

  // Get Square token from environment
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    console.error("Square token not set in environment variables");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Square token not configured" }),
    };
  }

  try {
    // Calculate start and end times for the requested date
    const startAt = new Date(date).toISOString();
    const endAt = new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000).toISOString(); // +1 day

    // Call Square API
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

    if (!response.ok) {
      console.error("Square API error:", response.status, data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Square API error", details: data }),
      };
    }

    console.log("Square availability response:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function execution error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: err.message }),
    };
  }
}
