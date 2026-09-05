const { MailtrapClient } = require('mailtrap');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const emailTemplates = require('../config/emailTemplates');

let client;
let smtpTransport;
let sharedEmailCss;

const APP_URL = process.env.FRONTEND_URL || 'https://joincarsl.com';
const API_URL = process.env.API_BASE_URL || process.env.BACKEND_URL || APP_URL;
const EMAIL_ASSET_BASE_URL = process.env.EMAIL_ASSET_BASE_URL || `${API_URL.replace(/\/$/, '')}/email-assets`;

const usesSmtp = () => process.env.EMAIL_TRANSPORT === 'smtp'
    || (!process.env.MAILTRAP_API_KEY && Boolean(process.env.SMTP_HOST));

const initializeEmailService = () => {
    if (usesSmtp()) {
        if (!smtpTransport) {
            if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
                throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are required to send email');
            }
            const port = Number(process.env.SMTP_PORT || 587);
            if (!Number.isInteger(port) || port < 1 || port > 65535) {
                throw new Error('SMTP_PORT must be a valid port number');
            }
            smtpTransport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port,
                secure: process.env.SMTP_SECURE === undefined
                    ? port === 465 : process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
                connectionTimeout: 15000,
                greetingTimeout: 15000,
                socketTimeout: 30000,
            });
        }
        return smtpTransport;
    }
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
    const resolvedTemplateName = emailTemplates.aliases?.[templateName] || templateName;
    const template = emailTemplates.templates[resolvedTemplateName];
    if (!template) {
        throw new Error(`Email template "${templateName}" not found`);
    }
    return {
        ...template,
        name: resolvedTemplateName,
    };
};

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const replaceAll = (content, searchValue, replacement) => {
    if (replacement === undefined || replacement === null || searchValue === undefined || searchValue === null) {
        return content;
    }

    return content.replace(new RegExp(escapeRegExp(searchValue), 'g'), String(replacement));
};

const renderString = (content = '', variables = {}) => {
    let rendered = content;

    Object.keys(variables).forEach((key) => {
        const regex = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, 'g');
        rendered = rendered.replace(regex, variables[key] === undefined || variables[key] === null ? '' : String(variables[key]));
    });

    return rendered;
};

const getSharedEmailCss = () => {
    if (sharedEmailCss === undefined) {
        const cssPath = path.join(emailTemplates.templateDir, 'carsl-emails', 'email.css');
        sharedEmailCss = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
    }

    return sharedEmailCss;
};

const loadTemplateHtml = (template) => {
    if (!template.file) {
        return template.html || '';
    }

    const filePath = path.join(emailTemplates.templateDir, template.file);
    let html = fs.readFileSync(filePath, 'utf8');
    const css = getSharedEmailCss();

    if (css) {
        html = html.replace(
            /<link\s+rel="stylesheet"\s+href="carsl-emails\/email\.css"\s*>\s*/i,
            `<style>${css}</style>\n`
        );
    }

    html = html.replace(/<script\s+src="carsl-emails\/image-slot\.js"><\/script>\s*/i, '');
    html = html.replace(/src="carsl-emails\/assets\//g, `src="${EMAIL_ASSET_BASE_URL}/assets/`);
    html = html.replace(/url\('assets\//g, `url('${EMAIL_ASSET_BASE_URL}/assets/`);

    return html;
};

const normalizeHandle = (variables) => {
    if (variables.handle) {
        return String(variables.handle).startsWith('@') ? variables.handle : `@${variables.handle}`;
    }

    const nameSource = variables.name || variables.firstName || variables.email || 'carsl';
    const handle = String(nameSource)
        .split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '.')
        .replace(/^\.+|\.+$/g, '');

    return `@${handle || 'carsl'}`;
};

const buildDefaultVariables = (variables = {}) => {
    const firstName = variables.firstName || variables.name || (variables.email ? String(variables.email).split('@')[0] : 'there');
    const actionUrl = variables.actionUrl || variables.setupLink || variables.loginLink || variables.resetLink || APP_URL;
    const code = variables.verificationCode || variables.resetCode || variables.loginToken || variables.code || '';
    const now = new Date();

    return {
        appUrl: APP_URL,
        actionUrl,
        managePreferencesUrl: variables.managePreferencesUrl || `${APP_URL}/settings/notifications`,
        unsubscribeUrl: variables.unsubscribeUrl || `${APP_URL}/settings/notifications`,
        helpUrl: variables.helpUrl || `${APP_URL}/help`,
        name: variables.name || firstName,
        firstName,
        handle: normalizeHandle({ ...variables, firstName }),
        verificationCode: variables.verificationCode || code,
        resetCode: variables.resetCode || code,
        loginToken: variables.loginToken || code,
        accountIdentifier: variables.accountIdentifier || variables.email || 'your account',
        method: variables.method || 'your email',
        device: variables.device || 'Unknown device',
        location: variables.location || 'Unknown location',
        loginTime: variables.loginTime || now.toLocaleString('en-US', { timeZone: 'Africa/Lagos', timeZoneName: 'short' }),
        carouselName: variables.carouselName || 'your carousel',
        itemName: variables.itemName || variables.carouselName || 'your work',
        artistName: variables.artistName || variables.publisherName || 'the artist',
        artworkTitle: variables.artworkTitle || 'this artwork',
        fileName: variables.fileName || variables.filename || 'The file',
        reason: variables.reason || 'The upload could not be completed.',
        pieceCount: variables.pieceCount || variables.artworkCount || 1,
        milestoneLabel: variables.milestoneLabel || `${variables.views || 100} views`,
        newViews: variables.newViews || 0,
        newLikes: variables.newLikes || 0,
        newInquiries: variables.newInquiries || 0,
        digestItems: variables.digestItems || 'New work is waiting for you in carsl.',
        publishDate: variables.publishDate || variables.scheduledDate || '',
        publishTime: variables.publishTime || variables.scheduledTime || '',
        timeZone: variables.timeZone || 'WAT',
        ...variables,
    };
};

const setFirstTagContent = (html, tag, className, content) => {
    if (content === undefined || content === null) return html;
    const regex = new RegExp(`(<${tag}[^>]*class="${className}"[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, 'i');
    return html.replace(regex, `$1${content}$2`);
};

const setPreheader = (html, preheader) => (
    preheader
        ? html.replace(/(<span class="ph-text">)[\s\S]*?(<\/span>)/i, `$1${preheader}$2`)
        : html
);

const replaceButtonHrefs = (html, urls = []) => {
    let index = 0;
    return html.replace(/href="#"/g, () => {
        const url = urls[index] || urls[0] || APP_URL;
        index += 1;
        return `href="${url}"`;
    });
};

const replaceCodeBox = (html, code, expiry = 'Expires in 15 minutes') => {
    if (!code) return html;

    return html.replace(
        /(<div class="codebox">\s*<div class="digits">)[\s\S]*?(<\/div>\s*<div class="expiry">)[\s\S]*?(<\/div>\s*<\/div>)/i,
        `$1${code}$2${expiry}$3`
    );
};

const applyDesignedTemplateVariables = (html, template, variables) => {
    if (!template.file) {
        return html;
    }

    let rendered = setPreheader(html, renderString(template.preheader, variables));
    rendered = replaceButtonHrefs(rendered, [variables.actionUrl, variables.shareUrl, variables.managePreferencesUrl, variables.unsubscribeUrl, variables.helpUrl]);

    rendered = replaceAll(rendered, 'Amara', variables.firstName);
    rendered = replaceAll(rendered, '@amara.adeyemi', variables.handle);
    rendered = replaceAll(rendered, 'amara.adeyemi', String(variables.handle).replace(/^@/, ''));
    rendered = replaceAll(rendered, 'Tunde Owolabi', variables.artistName);
    rendered = replaceAll(rendered, 'Ndidi Emeka', variables.artistName);
    rendered = replaceAll(rendered, 'Harmattan Light', variables.carouselName || variables.itemName);
    rendered = replaceAll(rendered, 'Market Day, Oshodi', variables.carouselName);
    rendered = replaceAll(rendered, 'Blue Hour, Yaba', variables.artworkTitle);
    rendered = replaceAll(rendered, '10,000 views', variables.milestoneLabel);
    rendered = replaceAll(rendered, '8 new pieces', `${variables.pieceCount} new pieces`);
    rendered = replaceAll(rendered, '6 pieces', `${variables.pieceCount} pieces`);
    rendered = replaceAll(rendered, '"FILENAME"', variables.fileName);

    switch (template.id) {
        case '01':
            rendered = replaceCodeBox(rendered, variables.verificationCode);
            break;
        case '02':
            rendered = setFirstTagContent(rendered, 'p', 'lead', `Welcome in, ${variables.firstName}.`);
            break;
        case '03':
            rendered = setFirstTagContent(rendered, 'p', 'lead', `You are in, ${variables.firstName}.`);
            break;
        case '04':
            rendered = setFirstTagContent(rendered, 'p', 'lead', `${variables.firstName}, you are set up but you are not showing yet.`);
            break;
        case '06':
            rendered = replaceAll(rendered, '[EMAIL/PHONE]', variables.accountIdentifier);
            rendered = replaceAll(rendered, '[METHOD]', variables.method);
            break;
        case '07':
            rendered = replaceCodeBox(rendered, variables.loginToken, 'Expires in 15 minutes');
            break;
        case '08':
            rendered = rendered.replace(
                /<p class="body">[\s\S]*?expires in 1 hour\.<\/p>/i,
                '<p class="body">Enter this code in the app to set a new password. It expires in 15 minutes.</p>'
            );
            rendered = rendered.replace(
                /<div class="btn-row"><a class="btn btn-primary"[^>]*>Set a new password<\/a><\/div>/i,
                `<div class="codebox"><div class="digits">${variables.resetCode}</div><div class="expiry">Expires in 15 minutes</div></div>`
            );
            break;
        case '10':
            rendered = replaceAll(rendered, 'Chrome on macOS', variables.device);
            rendered = rendered.replace(/Lagos,\s*Nigeria\s*&mdash;\s*approx\./i, variables.location);
            rendered = replaceAll(rendered, 'Today, 14:32 WAT', variables.loginTime);
            break;
        case '12':
            rendered = rendered.replace(
                /<p class="body">[\s\S]*?the moment it[\s\S]*?live\.<\/p>/i,
                `<p class="body">${variables.carouselName} premieres ${variables.publishDate} at ${variables.publishTime} ${variables.timeZone}. We will publish it automatically and let you know the moment it is live.</p>`
            );
            break;
        case '13':
            rendered = rendered.replace(
                /<p class="body"><strong>[\s\S]*?<\/strong>[\s\S]*?couldn[\s\S]*?be added\.<\/p>/i,
                `<p class="body"><strong>${variables.fileName}</strong> could not be added.</p>`
            );
            rendered = rendered.replace(
                /<div class="notice">[\s\S]*?<\/div>/i,
                `<div class="notice"><strong>${variables.reason}</strong></div>`
            );
            break;
        case '14':
            rendered = setFirstTagContent(rendered, 'h1', 'title', `People are looking, ${variables.firstName}.`);
            break;
        case '15':
            rendered = setFirstTagContent(rendered, 'h1', 'title', `It has been a minute, ${variables.firstName}.`);
            break;
        case '16':
            if (Array.isArray(variables.digestItems)) {
                let digestIndex = 0;
                rendered = rendered.replace(/(<div class="media">[\s\S]*?<div class="m-title">)[\s\S]*?(<\/div><div class="m-sub">)[\s\S]*?(<\/div><\/div><\/div>)/gi, (match, beforeTitle, beforeArtist, afterArtist) => {
                    const item = variables.digestItems[digestIndex];
                    digestIndex += 1;

                    if (!item) return match;

                    return `${beforeTitle}${item.artworkTitle || item.title || 'New work'}${beforeArtist}${item.artistName || item.artist || 'carsl'}${afterArtist}`;
                });
            }
            break;
        case '17':
            rendered = setFirstTagContent(rendered, 'h1', 'title', `${variables.artistName} just dropped new work.`);
            break;
        default:
            break;
    }

    return rendered;
};

const renderTemplate = (template, variables) => {
    const allVariables = buildDefaultVariables(variables);
    let html = loadTemplateHtml(template);
    let text = typeof template.text === 'function' ? template.text(allVariables) : template.text;

    html = applyDesignedTemplateVariables(html, template, allVariables);
    html = renderString(html, allVariables);
    text = renderString(text, allVariables);

    return { html, text };
};

const sendEmail = async (to, templateName, variables = {}) => {
    try {
        const emailClient = initializeEmailService();
        const template = getTemplate(templateName);
        const { html, text } = renderTemplate(template, variables);
        const subject = renderString(template.subject, buildDefaultVariables(variables));

        if (usesSmtp()) {
            const response = await emailClient.sendMail({
                from: {
                    address: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
                    name: process.env.SMTP_FROM_NAME || 'Carsl',
                },
                to,
                subject,
                text,
                html,
            });
            console.log('Email sent:', response.messageId);
            return { success: true, messageId: response.messageId };
        }

        const response = await emailClient.send({
            from: {
                email: process.env.MAILTRAP_FROM_EMAIL || process.env.SMTP_FROM_EMAIL || 'hello@joincarsl.com',
                name: process.env.MAILTRAP_FROM_NAME || process.env.SMTP_FROM_NAME || 'Carsl',
            },
            to: [{ email: to }],
            subject,
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
