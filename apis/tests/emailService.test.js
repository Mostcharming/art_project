const test = require('node:test');
const assert = require('node:assert/strict');
const nodemailer = require('nodemailer');
const { MailtrapClient } = require('mailtrap');

const keys = ['EMAIL_TRANSPORT', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE',
    'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM_EMAIL', 'SMTP_FROM_NAME',
    'MAILTRAP_API_KEY', 'MAILTRAP_FROM_EMAIL', 'MAILTRAP_FROM_NAME'];

function loadService(t, settings) {
    const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
    for (const key of keys) delete process.env[key];
    Object.assign(process.env, settings);
    const modulePath = require.resolve('../utils/emailService');
    delete require.cache[modulePath];
    t.after(() => {
        for (const key of keys) {
            if (original[key] === undefined) delete process.env[key];
            else process.env[key] = original[key];
        }
        delete require.cache[modulePath];
    });
    return require(modulePath);
}

test('SMTP override renders the template and sends through Nodemailer', async t => {
    let options;
    let payload;
    t.mock.method(nodemailer, 'createTransport', config => {
        options = config;
        return { sendMail: async message => { payload = message; return { messageId: 'smtp-id' }; } };
    });
    t.mock.method(MailtrapClient.prototype, 'send', () => { throw new Error('Unexpected Mailtrap call'); });
    const service = loadService(t, {
        EMAIL_TRANSPORT: 'smtp', SMTP_HOST: 'smtp.example.test', SMTP_PORT: '465',
        SMTP_USER: 'smtp-user', SMTP_PASSWORD: 'test-password',
        SMTP_FROM_EMAIL: 'sender@example.test', SMTP_FROM_NAME: 'Carsl',
        MAILTRAP_API_KEY: 'unused-test-key',
    });
    const result = await service.sendEmail('recipient@example.test', 'adminLoginToken', { name: 'Alex', loginToken: '1234' });
    assert.deepEqual(result, { success: true, messageId: 'smtp-id' });
    assert.equal(options.port, 465);
    assert.equal(options.secure, true);
    assert.deepEqual(options.auth, { user: 'smtp-user', pass: 'test-password' });
    assert.deepEqual(payload.from, { address: 'sender@example.test', name: 'Carsl' });
    assert.equal(payload.to, 'recipient@example.test');
    assert.match(payload.html, /1234/);
    assert.match(payload.text, /1234/);
    assert.ok(payload.subject);
});

test('Mailtrap configuration keeps the existing API behavior', async t => {
    let payload;
    t.mock.method(nodemailer, 'createTransport', () => { throw new Error('Unexpected SMTP call'); });
    t.mock.method(MailtrapClient.prototype, 'send', async message => {
        payload = message;
        return { message_ids: ['mailtrap-id'] };
    });
    const service = loadService(t, {
        MAILTRAP_API_KEY: 'test-key', MAILTRAP_FROM_EMAIL: 'sender@example.test',
        SMTP_HOST: 'unused.example.test',
    });
    const result = await service.sendEmail('recipient@example.test', 'adminLoginToken', { loginToken: '1234' });
    assert.deepEqual(result, { success: true, messageId: 'mailtrap-id' });
    assert.deepEqual(payload.to, [{ email: 'recipient@example.test' }]);
    assert.equal(payload.from.email, 'sender@example.test');
    assert.match(payload.html, /1234/);
});

test('invalid SMTP configuration fails before opening a connection', t => {
    t.mock.method(nodemailer, 'createTransport', () => { throw new Error('Unexpected connection'); });
    const service = loadService(t, {
        EMAIL_TRANSPORT: 'smtp', SMTP_HOST: 'smtp.example.test',
        SMTP_USER: 'smtp-user', SMTP_PASSWORD: 'test-password', SMTP_PORT: 'invalid',
    });
    assert.throws(() => service.initializeEmailService(), /SMTP_PORT/);
});
