const nodemailer = require("nodemailer");
// const nodemailer = require('nodemailer');
import * as dotenv from 'dotenv';
dotenv.config();

class MailService {
    transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            // service: 'gmail',
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to: string, link: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `Account activation at ${process.env.API_URL}`,
                text: '',
                html: 
                `
                    <div>
                        <h1>To activate your account, please visit the link below.</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
            });
            console.log('Email sent to', to);
            
        } catch (error) {
            console.error('Error sending email:', error);
          }
    }
}

export default new MailService();
