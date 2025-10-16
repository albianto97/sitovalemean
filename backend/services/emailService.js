import nodemailer from 'nodemailer';


// ✉️ Configura il trasporto email (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,      // es: smtp.gmail.com oppure sandbox.smtp.mailtrap.io
  port: process.env.EMAIL_PORT || 587,
  secure: false,                     // true solo se usi porta 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Template HTML base con dark/light mode
export const generateEmailTemplate = (subject, message) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    :root {
      color-scheme: light dark;
      --bg-light: #ffffff;
      --bg-dark: #121212;
      --text-light: #222;
      --text-dark: #ddd;
      --primary: #007bff;
    }
    body {
      background-color: cadetblue;
      color: black;
      font-family: 'Segoe UI', sans-serif;
      padding: 2rem;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: yellow;
        color: red
      }
    }
    .card {
      border-radius: 12px;
      background: rgba(255,255,255,0.05);
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    a.btn {
      display: inline-block;
      background: var(--primary);
      color: white;
      padding: 10px 16px;
      border-radius: 6px;
      text-decoration: none;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>${subject}</h2>
    <p>${message}</p>
    <p style="font-size:0.8em;color:gray;">Questo messaggio è generato automaticamente.</p>
  </div>
</body>
</html>
`;

export const sendEmail = async (to, subject, message) => {
  const html = generateEmailTemplate(subject, message);
  await transporter.sendMail({
    from: `"Lista Regali 🎁" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
