import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { emails, subject, body } = await req.json();

        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: "Missing or invalid emails array." }, { status: 400 });
        }

        if (!subject || !body) {
            return NextResponse.json({ error: "Subject and body are required." }, { status: 400 });
        }

        // Check if real SMTP credentials are provided in environment variables
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
            // Use real SMTP server
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            // Auto-fallback to testing with Ethereal if no SMTP credentials are provided
            console.log("No SMTP credentials found in .env. Creating Ethereal testing account...");
            const testAccount = await nodemailer.createTestAccount();

            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            console.log(`Ethereal Test Account created! User: ${testAccount.user}`);
        }

        // Send emails
        let successCount = 0;
        const infoRecords = [];

        // Send individually or BCC? For bulk marketing, usually individual to avoid showing other recipients.
        // NodeMailer also supports list of emails in `to`, but doing it mapped is safer to bypass limits or BCC.
        // For this example, we'll send it individually or BCC. Let's send in a loop or Promise.all (with limit).
        // To keep it simple, we'll send a single email with BCC.

        const info = await transporter.sendMail({
            from: `"Marketing Team" <${process.env.SMTP_FROM || process.env.MAIL_USER || process.env.SMTP_USER || "marketing@example.com"}>`,
            bcc: emails.join(", "), // Send as BCC so recipients don't see each other
            subject: subject,
            html: body,
            // text plugin can also be added here by stripping HTML
        });

        infoRecords.push(info);
        successCount = emails.length;

        const configured = isSmtpConfigured || isOAuth2Configured;

        if (!configured) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return NextResponse.json({
            success: true,
            message: "Emails sent successfully.",
            count: successCount,
            previewUrl: configured ? null : nodemailer.getTestMessageUrl(info)
        });

    } catch (error: any) {
        console.error("Error sending emails:", error);
        return NextResponse.json(
            { error: "Failed to send emails. " + error.message },
            { status: 500 }
        );
    }
}
