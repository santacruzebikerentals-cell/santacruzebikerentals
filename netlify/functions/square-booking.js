const { SquareClient, SquareEnvironment } = require("square");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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
    const {
      tourId,
      tourName,
      duration,
      bikeCount,
      startAt,
      teamMemberId,
      serviceVariationVersion,
      riders,
      totalPrice,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!tourId || !tourName || !duration || !bikeCount || !startAt || !riders?.length) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required booking fields" }),
      };
    }

    const client = getClient();
    const locationId = process.env.SQUARE_LOCATION_ID;
    const primaryRider = riders[0];

    // 1. Create customer in Square
    const customerResponse = await client.customers.create({
      idempotencyKey: crypto.randomUUID(),
      givenName: primaryRider.firstName,
      familyName: primaryRider.lastName,
      emailAddress: primaryRider.email,
      phoneNumber: primaryRider.phone,
    });

    if (customerResponse.errors?.length) {
      throw new Error(customerResponse.errors[0].detail || "Failed to create customer");
    }

    const customerId = customerResponse.customer.id;

    // 2. Build customer note with rider details
    const riderDetails = riders
      .map((r, i) => `Rider ${i + 1}: ${r.firstName} ${r.lastName} — Height: ${r.height}`)
      .join("\n");

    const customerNote = [
      `Tour: ${tourName}`,
      `Duration: ${duration.label} (${duration.hours} hours)`,
      `Number of Bikes: ${bikeCount}`,
      `Total Price: $${totalPrice}`,
      "",
      "Rider Details:",
      riderDetails,
    ].join("\n");

    // 3. Create booking in Square
    const appointmentSegment = {
      teamMemberId,
      serviceVariationId: tourId,
      durationMinutes: duration.hours * 60,
    };

    // Include version if available (required by some Square configurations)
    if (serviceVariationVersion) {
      appointmentSegment.serviceVariationVersion = BigInt(serviceVariationVersion);
    }

    const bookingResponse = await client.bookings.create({
      idempotencyKey: crypto.randomUUID(),
      booking: {
        startAt,
        locationId,
        customerId,
        customerNote,
        appointmentSegments: [appointmentSegment],
      },
    });

    if (bookingResponse.errors?.length) {
      throw new Error(bookingResponse.errors[0].detail || "Failed to create booking");
    }

    const booking = bookingResponse.booking;

    // 4. Send confirmation emails (non-blocking — don't fail the booking if email fails)
    try {
      await sendConfirmationEmails({
        bookingId: booking.id,
        tourName,
        duration,
        bikeCount,
        startAt: booking.startAt,
        totalPrice,
        riders,
        primaryRider,
      });
    } catch (emailErr) {
      console.error("Email sending failed (booking still created):", emailErr.message);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        bookingId: booking.id,
        startAt: booking.startAt,
        status: booking.status,
      }),
    };
  } catch (err) {
    console.error("Booking error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message || "Failed to create booking",
      }),
    };
  }
};

async function sendConfirmationEmails({
  bookingId,
  tourName,
  duration,
  bikeCount,
  startAt,
  totalPrice,
  riders,
  primaryRider,
}) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.warn("SMTP not configured — skipping confirmation emails");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort) || 587,
    secure: parseInt(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const dateObj = new Date(startAt);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });

  const riderRows = riders
    .map(
      (r, i) =>
        `<tr>
          <td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${i + 1}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(r.firstName)} ${escapeHtml(r.lastName)}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #e2e8f0;">${escapeHtml(r.height)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
      <div style="background:#0ea5e9;padding:24px 32px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;color:white;font-size:22px;">🚲 Booking Confirmed!</h1>
        <p style="margin:8px 0 0;color:#e0f2fe;font-size:14px;">Santa Cruz Bike Adventures</p>
      </div>
      <div style="background:white;padding:24px 32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
        <p style="margin:0 0 16px;">Thank you for your reservation, <strong>${escapeHtml(primaryRider.firstName)}</strong>!</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:8px 0;color:#64748b;width:140px;">Booking ID</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(bookingId)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Tour</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(tourName)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Date</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(dateStr)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Time</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(timeStr)}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Duration</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(duration.label)} (${duration.hours} hours)</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Bikes</td><td style="padding:8px 0;font-weight:600;">${bikeCount}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b;">Total</td><td style="padding:8px 0;font-weight:700;color:#0ea5e9;font-size:18px;">$${totalPrice}</td></tr>
        </table>
        <h3 style="margin:20px 0 8px;font-size:15px;">Rider Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr style="background:#f1f5f9;">
            <th style="padding:8px 12px;text-align:left;font-size:13px;">#</th>
            <th style="padding:8px 12px;text-align:left;font-size:13px;">Name</th>
            <th style="padding:8px 12px;text-align:left;font-size:13px;">Height</th>
          </tr>
          ${riderRows}
        </table>
        <div style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:8px;font-size:14px;">
          <strong>What's next?</strong><br>
          We'll deliver bikes to your location before your ride. If you have questions, email us at
          <a href="mailto:santacruzebikerentals@gmail.com">santacruzebikerentals@gmail.com</a>.
        </div>
      </div>
    </div>
  `;

  const subject = `Booking Confirmed — ${tourName} on ${dateStr}`;

  // Send to customer
  await transporter.sendMail({
    from: `"Santa Cruz Bike Adventures" <${smtpUser}>`,
    to: primaryRider.email,
    subject,
    html,
  });

  // Send to business
  const businessEmail =
    process.env.BUSINESS_EMAIL || "santacruzebikerentals@gmail.com";
  await transporter.sendMail({
    from: `"Santa Cruz Bike Adventures" <${smtpUser}>`,
    to: businessEmail,
    subject: `[New Booking] ${primaryRider.firstName} ${primaryRider.lastName} — ${tourName}`,
    html,
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
