
// api/sendMail.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }
  const { latitude, longitude, timestamp } = req.body;

  // configure transporter using Gmail + App-Password
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.anousakra@gmail.com,           // your@gmail.com
      pass: process.env.cbia ktxb rduz bvir,   // the 16-char App Password
    },
  });

  // send the email
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to:   process.env.anousakra1@gmail.com,               // your alert address
    subject: "🚨 Kid Location Alert",
    html: `
      <p>Latitude: ${latitude}</p>
      <p>Longitude: ${longitude}</p>
      <p>Time: ${timestamp}</p>
    `,
  });

  return res.status(200).json({ ok: true });
}
