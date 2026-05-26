import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function sendEmail({ to, subject, html }: any) {
    try {
        await sgMail.send({ 
            to, 
            from: 'richardcasinilloph@gmail.com', // hardcoded to test
            subject, 
            html 
        });
    } catch (error: any) {
        console.error('Email sending failed:', error);
        if (error.response) {
            console.error('SendGrid error body:', JSON.stringify(error.response.body));
        }
    }
}
