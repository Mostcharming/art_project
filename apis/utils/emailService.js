const nodemailer = require('nodemailer');
const emailTemplates = require('../config/emailTemplates.json');

let transporter;

const initializeEmailService = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error('Email service error:', error);
            } else {
                console.log('Email service ready:', success);
            }
        });
    }
    return transporter;
};

const getTemplate = (templateName) => {
    const template = emailTemplates.templates[templateName];
    if (!template) {
        throw new Error(`Email template "${templateName}" not found`);
    }
    return template;
};

const renderTemplate = (template, variables) => {
    let html = template.html;
    let text = template.text;

    Object.keys(variables).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, variables[key]);
        text = text.replace(regex, variables[key]);
    });

    return { html, text };
};

const sendEmail = async (to, templateName, variables = {}) => {
    try {
        const transporter = initializeEmailService();
        const template = getTemplate(templateName);
        const { html, text } = renderTemplate(template, variables);

        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to,
            subject: template.subject,
            html,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const sendBulkEmails = async (recipients, templateName, variables = {}) => {
    try {
        const results = [];
        for (const recipient of recipients) {
            const result = await sendEmail(recipient, templateName, variables);
            results.push({ email: recipient, ...result });
        }
        return results;
    } catch (error) {
        console.error('Error sending bulk emails:', error);
        throw error;
    }
};

module.exports = {
    initializeEmailService,
    sendEmail,
    sendBulkEmails,
    getTemplate,
    renderTemplate,
};
