

export async function handler(event, context) {
  console.log("Event received:", event);

  const serviceId = event.queryStringParameters?.serviceId;
  const locationId = event.queryStringParameters?.locationId;
  const date = event.queryStringParameters?.date;

  if (!serviceId || !locationId || !date) {
    console.log("Missing parameters", { serviceId, locationId, date });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing serviceId, locationId, or date" })
    };
  }

  console.log("Params parsed:", { serviceId, locationId, date });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Function received parameters correctly" })
  };
}