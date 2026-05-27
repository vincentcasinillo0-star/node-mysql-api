import * as SibApiV3Sdk from '@getbrevo/brevo';

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string);

export default async function sendEmail({ to, subject, html }: any) {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.to = [{ email: to }];
    sendSmtpEmail.sender = { email: 'ac9427001@smtp-brevo.com', name: 'No Reply' };
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully');
    } catch (error: any) {
        console.error('Email sending failed:', error);
    }
}