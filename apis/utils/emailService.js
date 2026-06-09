const { MailtrapClient } = require('mailtrap');
const emailTemplates = require('../config/emailTemplates.json');

let client;

const initializeEmailService = () => {
    if (!client) {
        if (!process.env.MAILTRAP_API_KEY) {
            throw new Error('MAILTRAP_API_KEY is required to send email');
        }

        client = new MailtrapClient({
            token: process.env.MAILTRAP_API_KEY,
        });
    }
    return client;
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
        const mailtrapClient = initializeEmailService();
        const template = getTemplate(templateName);
        const { html, text } = renderTemplate(template, variables);

        const response = await mailtrapClient.send({
            from: {
                email: process.env.MAILTRAP_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || 'hello@joincarsl.com',
                name: process.env.MAILTRAP_FROM_NAME || process.env.SMTP_FROM_NAME || 'Carsl',
            },
            to: [{ email: to }],
            subject: template.subject,
            text,
            html,
        });

        console.log('Email sent:', response?.message_ids || response);
        return { success: true, messageId: response?.message_ids?.[0] };
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
