# 📧 Bulk Mail Send API

A scalable bulk email sending API built with **Next.js**, **TypeScript**, **Nodemailer**, and **CSV processing**. This application enables users to send personalized emails to multiple recipients efficiently using SMTP services.

---

## 🚀 Features

- 📩 Send emails to multiple recipients in a single request
- 📄 CSV file upload support for bulk recipient management
- 👤 Personalized email content
- 📎 Attachment support
- 🔒 Secure SMTP authentication
- ⚡ Built with Next.js API Routes
- 📝 TypeScript for type safety
- 📊 Error handling and delivery status tracking
- 🌐 RESTful API architecture

---

## 🛠️ Tech Stack

- **Frontend:** Next.js
- **Backend:** Next.js API Routes
- **Language:** TypeScript
- **Email Service:** Nodemailer
- **CSV Processing:** PapaParse
- **Environment Management:** dotenv

---

## 📂 Project Structure

```bash
Bulk-mail-send-api/
│
├── app/
│   ├── api/
│   │   └── send-mail/
│   │       └── route.ts
│
├── components/
│
├── public/
│
├── utils/
│   ├── mailer.ts
│   └── csvParser.ts
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Chethumalli/Bulk-mail-send-api.git
cd Bulk-mail-send-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

> For Gmail, use an App Password instead of your normal password.

---

## ▶️ Run Locally

```bash
npm run dev
```

Application will start on:

```bash
http://localhost:3000
```

---

## 📤 API Endpoint

### Send Bulk Emails

```http
POST /api/send-mail
```

### Request Body

```json
{
  "subject": "Welcome Email",
  "message": "Hello User, Welcome to our platform!",
  "recipients": [
    "user1@example.com",
    "user2@example.com"
  ]
}
```

### Success Response

```json
{
  "success": true,
  "message": "Emails sent successfully"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Failed to send emails"
}
```

---

## 📄 CSV Upload Format

```csv
name,email
John,john@example.com
Alice,alice@example.com
Bob,bob@example.com
```

The system parses uploaded CSV files and automatically extracts recipient email addresses.

---

## 🔐 Security Considerations

- Store credentials in environment variables.
- Never commit `.env.local` files.
- Use App Passwords for Gmail SMTP.
- Implement rate limiting for production deployments.

---

## 🌟 Future Enhancements

- Email templates
- Rich HTML email support
- Scheduled email campaigns
- Email analytics dashboard
- Open and click tracking
- Queue-based email processing
- Multi-provider support (SendGrid, Mailgun, AWS SES)

---

## 👨‍💻 Author

**Chethan C Malli**

- GitHub: https://github.com/Chethumalli
- LinkedIn: https://linkedin.com/in/chethumalli

---

## 📜 License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star on GitHub!
