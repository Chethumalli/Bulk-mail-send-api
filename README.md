# 📧 Bulk Mail Send API

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![Nodemailer](https://img.shields.io/badge/Nodemailer-email-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A modern **Bulk Email Sending API** built with **Next.js**, **TypeScript**, and **Nodemailer**.

This project allows sending **personalized bulk emails using CSV files**, with support for **HTML templates and CSV attachments**.

---

# 🚀 Features

- 📄 Upload CSV files to send bulk emails
- ✉️ Personalized emails using CSV fields (`{{name}}`, `{{about_me}}`)
- 🧩 Dynamic template replacement
- 📎 CSV attachment included in outgoing emails
- 📨 Supports **Gmail OAuth2** and **SMTP**
- ⚡ Fast API using **Next.js server routes**
- 🎨 Simple UI for sending campaigns

---

# 🧰 Tech Stack

- Next.js
- TypeScript
- Nodemailer
- PapaParse (CSV parsing)
- Tailwind CSS

---

---

# ⚙️ Environment Variables

Create a `.env.local` file in the root directory.

### Gmail OAuth2 Example

MAIL_USER=your-email@gmail.com
MAIL_CLIENT_ID=your-client-id
MAIL_CLIENT_SECRET=your-client-secret
MAIL_ACCESS_TOKEN=your-access-token
MAIL_REFRESH_TOKEN=your-refresh-token

---
▶️ Running the Project
Clone repository
git clone https://github.com/Chethumalli/Bulk-mail-send-api.git

Move into folder
cd Bulk-mail-send-api

Install dependencies

npm install
Run development server

npm run dev

Open in browser
http://localhost:3000