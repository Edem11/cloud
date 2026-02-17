import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  try {
    const { timestamp, osVersion } = req.body || {};

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
      subject: "Time & Device Info",
      text:
        `Time: ${timestamp}\n` +
        `Device: ${osVersion}\n`
    });

    return res.status(200).send("OK");
  } catch (err) {
    console.error("sendMail error:", err);
    return res.status(500).send(err?.message || "Server error");
  }
}
