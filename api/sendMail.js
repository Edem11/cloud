import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  try {
    const { latitude, longitude, timestamp } = req.body || {};

    const user = process.env.anousakra@gmail.com;           // set in Vercel env vars
    const pass = process.env.cbiaktxbrduzbvir;   // set in Vercel env vars
    const to   = process.env.anousakra1@gmail.com;             // set in Vercel env vars

    if (!user || !pass || !to) {
      return res.status(500).send("Missing env vars: GMAIL_USER / GMAIL_APP_PASSWORD / TO_EMAIL");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: user,
      to,
      subject: "🚨 Kid Location Alert",
      text:
        `Latitude: ${latitude}\n` +
        `Longitude: ${longitude}\n` +
        `Time: ${timestamp}\n` +
        `Map: https://maps.google.com/?q=${latitude},${longitude}`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message || "Server error");
  }
}
