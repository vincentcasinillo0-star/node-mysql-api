import { Brevo } from '@getbrevo/brevo';

const client = new Brevo({
    apiKey: process.env.BREVO_API_KEY as string
});

export default async function sendEmail({ to, subject, html }: any) {
    try {
        await client.transactionalEmails.sendTransacEmail({
            to: [{ email: to }],
            sender: { email: 'ac9427001@smtp-brevo.com', name: 'No Reply' },
            subject,
            htmlContent: html
        });
        console.log('Email sent successfully');
    } catch (error: any) {
        console.error('Email sending failed:', error);
    }
}