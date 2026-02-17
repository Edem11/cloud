import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  try {
    const { latitude, longitude, accuracy, timestamp, note } = req.body || {};

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

    await transporter.sendMail({
      from: user,
      to,
      subject: "Location Share",
      text:
        `Latitude: ${latitude}\n` +
        `Longitude: ${longitude}\n` +
        `Accuracy: ${accuracy} meters\n` +
        `Time: ${timestamp}\n` +
        `Note: ${note || ""}\n\n` +
        `Map: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}\n` +
        `Directions: https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}\n`
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error("sendMail error:", err);
    return res.status(500).send(err?.message || "Server error");
  }
}
