import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html }: any) {
    const transporter = nodemailer.createTransport({
        host: config.smtpOptions.host,
        port: config.smtpOptions.port,
        auth: {
            user: config.smtpOptions.auth.user,
            pass: config.smtpOptions.auth.pass
        }
    });

    try {
        await transporter.sendMail({
            from: config.emailFrom,
            to,
            subject,
            html
        });
    } catch (error: any) {
        console.error('Email sending failed:', error);
    }
}