import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Papa from "papaparse";

export async function POST(req: Request) {
  try {

    let emails: string[] = [];
    let subject = "";
    let body = "";
    let csvRows: any[] = [];
    let csvText = "";
    let file: File | null = null;   // store uploaded file

    const contentType = req.headers.get("content-type");

    // =========================
    // HANDLE CSV FILE UPLOAD
    // =========================
    if (contentType?.includes("multipart/form-data")) {

      const formData = await req.formData();

      file = formData.get("file") as File;
      subject = formData.get("subject") as string;
      body = formData.get("body") as string;

      if (!file) {
        return NextResponse.json({ error: "CSV file required." }, { status: 400 });
      }

      csvText = await file.text();

      const parsed = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });

      csvRows = parsed.data as any[];

      emails = csvRows
        .map((row) => row.email)
        .filter((email) => email);

    }

    // =========================
    // HANDLE JSON INPUT
    // =========================
    else {

      const data = await req.json();

      emails = data.emails;
      subject = data.subject;
      body = data.body;

    }

    // =========================
    // VALIDATION
    // =========================
    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid emails array." },
        { status: 400 }
      );
    }

    if (!subject || !body) {
      return NextResponse.json(
        { error: "Subject and body are required." },
        { status: 400 }
      );
    }

    // =========================
    // MAIL CONFIG
    // =========================
    const isSmtpConfigured =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS;

    const isOAuth2Configured =
      process.env.MAIL_USER &&
      process.env.MAIL_CLIENT_ID &&
      process.env.MAIL_CLIENT_SECRET &&
      process.env.MAIL_ACCESS_TOKEN &&
      process.env.MAIL_REFRESH_TOKEN;

    let transporter;

    if (isOAuth2Configured) {

      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USER,
          clientId: process.env.MAIL_CLIENT_ID,
          clientSecret: process.env.MAIL_CLIENT_SECRET,
          refreshToken: process.env.MAIL_REFRESH_TOKEN,
          accessToken: process.env.MAIL_ACCESS_TOKEN,
        },
      });

    } else if (isSmtpConfigured) {

      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    } else {

      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

    }

    // =========================
    // SEND EMAILS
    // =========================
    let successCount = 0;

    if (csvRows.length > 0) {

      for (const row of csvRows) {

        if (!row.email) continue;

        let personalizedBody = body;

        for (const key in row) {
          personalizedBody = personalizedBody.replace(
            new RegExp(`{{${key}}}`, "g"),
            row[key]
          );
        }

        await transporter.sendMail({
          from: `"Marketing Team" <${
            process.env.SMTP_FROM ||
            process.env.MAIL_USER ||
            process.env.SMTP_USER ||
            "marketing@example.com"
          }>`,
          to: row.email,
          subject: subject,
          html: personalizedBody,

          attachments: file
            ? [
                {
                  filename: file.name,   // show original file name
                  content: csvText,
                  contentType: "text/csv",
                },
              ]
            : [],

        });

        successCount++;

      }

    } 
    else {

      for (const email of emails) {

        await transporter.sendMail({
          from: `"Marketing Team" <${
            process.env.SMTP_FROM ||
            process.env.MAIL_USER ||
            process.env.SMTP_USER ||
            "marketing@example.com"
          }>`,
          to: email,
          subject: subject,
          html: body,
        });

        successCount++;

      }

    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully.",
      count: successCount,
    });

  } catch (error: any) {

    console.error("Error sending emails:", error);

    return NextResponse.json(
      { error: "Failed to send emails. " + error.message },
      { status: 500 }
    );

  }
}