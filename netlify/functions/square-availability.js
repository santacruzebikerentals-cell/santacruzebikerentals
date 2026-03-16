const { SquareClient, SquareEnvironment } = require("square");

function getClient() {
  return new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment:
      process.env.SQUARE_ENVIRONMENT === "production"
        ? SquareEnvironment.Production
        : SquareEnvironment.Sandbox,
  });
}

exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { serviceId, date } = JSON.parse(event.body);

    if (!serviceId || !date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "serviceId and date are required" }),
      };
    }

    const client = getClient();
    const locationId = process.env.SQUARE_LOCATION_ID;

    // Build time range for the selected date (full day in Pacific time)
    const startAt = `${date}T00:00:00-07:00`;
    const endAt = `${date}T23:59:59-07:00`;

    const response = await client.bookings.searchAvailability({
      query: {
        filter: {
          startAtRange: { startAt, endAt },
          locationId,
          segmentFilters: [{ serviceVariationId: serviceId }],
        },
      },
    });

    const availabilities = (response.availabilities || []).map((a) => ({
      startAt: a.startAt,
      locationId: a.locationId,
      teamMemberId: a.appointmentSegments?.[0]?.teamMemberId || null,
      serviceVariationId: a.appointmentSegments?.[0]?.serviceVariationId || null,
      serviceVariationVersion: a.appointmentSegments?.[0]?.serviceVariationVersion
        ? a.appointmentSegments[0].serviceVariationVersion.toString()
        : null,
      durationMinutes: a.appointmentSegments?.[0]?.durationMinutes || null,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ availabilities }),
    };
  } catch (err) {
    console.error("Availability search error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to fetch availability",
        detail: err.message,
      }),
    };
  }
};
