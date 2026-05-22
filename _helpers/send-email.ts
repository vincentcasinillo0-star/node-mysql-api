import nodemailer from 'nodemailer';

// Load file config only in non-production (local dev fallback)
let fileConfig: any = {};
if (process.env.NODE_ENV !== 'production') {
    try {
        fileConfig = require('../config.json');
    } catch (e) {
        // config.json not present, rely on env vars
    }
}

function getEmailFrom(): string {
    return process.env.EMAIL_FROM || fileConfig.emailFrom || 'noreply@example.com';
}

function getSmtpOptions(): any {
    if (process.env.NODE_ENV === 'production' && !process.env.SMTP_HOST) {
        throw 'SMTP_HOST environment variable is required in production to send emails';
    }

    if (process.env.SMTP_HOST) {
        return {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            } : undefined
        };
    }

    if (!fileConfig.smtpOptions) throw 'SMTP configuration is missing';
    return fileConfig.smtpOptions;
}

async function sendWithResend({ to, subject, html, from }: any) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from: from || getEmailFrom(), to, subject, html })
    });
    if (!res.ok) {
        const err = await res.text();
        throw `Resend error: ${err}`;
    }
}

export default async function sendEmail({ to, subject, html, from = getEmailFrom() }: any) {
    const hasResend = !!process.env.RESEND_API_KEY;

    if (hasResend) {
        return await sendWithResend({ to, subject, html, from });
    }

    const transporter = nodemailer.createTransport(getSmtpOptions());
    await transporter.sendMail({ from: from || getEmailFrom(), to, subject, html });
}
