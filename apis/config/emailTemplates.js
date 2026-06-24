const path = require('path');
const legacyTemplates = require('./emailTemplates.json');

const emailTemplateDir = path.join(__dirname, '..', 'email_templates');

const templates = {
    verifyEmail: {
        id: '01',
        file: '01 Verify email.html',
        subject: 'Your code to step inside CARSL',
        preheader: "Confirm it's you and the doors open.",
        text: "Hello {{name}},\n\nEnter this code in the carsl app to confirm your email:\n\n{{verificationCode}}\n\nIt expires in 15 minutes. If you did not start signing up for carsl, you can ignore this email.",
    },
    welcomeArtist: {
        id: '02',
        file: '02 Welcome - Artist.html',
        subject: 'Your gallery never closes now',
        preheader: 'Hang your first work and reach the world, {{handle}}.',
        text: "Welcome in, {{firstName}}.\n\nYou are now {{handle}} on carsl: your channel, your wall, open to anyone with a screen.\n\nBuild your first carousel, upload in full frame, and set your profile so collectors know whose work they are seeing.\n\n{{actionUrl}}",
    },
    welcomeArtEnthusiast: {
        id: '03',
        file: '03 Welcome - Art Enthusiast.html',
        subject: 'Press play on a world of art',
        preheader: 'Discovery starts the moment you open the app.',
        text: "You are in, {{firstName}}.\n\ncarsl turns discovery into something you do from the couch. Browse by mood, medium, or maker, and watch art on TV, tablet, phone, or web.\n\nStart exploring: {{actionUrl}}",
    },
    finishSettingUp: {
        id: '04',
        file: '04 Finish setting up.html',
        subject: "Your wall's still empty",
        preheader: 'Two minutes now and the world can see your work.',
        text: "{{firstName}}, you are set up but not showing yet.\n\nYour channel exists, but there is nothing on the wall for anyone to find. Finish your setup and add the first piece.\n\n{{actionUrl}}",
    },
    profileLive: {
        id: '05',
        file: '05 Profile is live.html',
        subject: 'Your channel looks the part',
        preheader: '{{handle}} is ready for visitors.',
        text: "{{firstName}}, your channel is set.\n\n{{handle}} now has a face, a bio, and a profile visitors can trust. Next: fill the wall with your first carousel.\n\n{{actionUrl}}",
    },
    twoFactorEnabled: {
        id: '06',
        file: '06 Two-factor enabled.html',
        subject: 'Two-factor is on',
        preheader: 'Your account just got harder to break into.',
        text: "Done. Two-factor authentication is now protecting {{accountIdentifier}}.\n\nFrom now on, signing in takes your password plus a one-time code sent to {{method}}.\n\nManage security: {{actionUrl}}",
    },
    signInCode: {
        id: '07',
        file: '07 Sign-in code.html',
        subject: '{{loginToken}} is your carsl code',
        preheader: 'Use it before it expires.',
        text: "Your carsl sign-in code is:\n\n{{loginToken}}\n\ncarsl will never ask you for this code by phone, chat, or email reply.",
    },
    passwordReset: {
        id: '08',
        file: '08 Reset password.html',
        subject: 'Reset your carsl password',
        preheader: 'Use this code to set a new password.',
        text: "Hello {{name}},\n\nUse this password reset code to set a new password:\n\n{{resetCode}}\n\nIt expires in 15 minutes. If you did not ask for this, ignore this email.",
    },
    passwordChanged: {
        id: '09',
        file: '09 Password changed.html',
        subject: 'Your password was changed',
        preheader: "If this was you, you're all set.",
        text: "Your carsl password was just changed.\n\nIf that was you, nothing more to do. If it was not you, reset your password and review your active sessions immediately.\n\n{{actionUrl}}",
    },
    newSignInDetected: {
        id: '10',
        file: '10 New sign-in detected.html',
        subject: 'New sign-in to your account',
        preheader: 'Was this you?',
        text: "Your carsl account was just opened on a new device.\n\nDevice: {{device}}\nWhere: {{location}}\nWhen: {{loginTime}}\n\nIf this was not you, secure your account now: {{actionUrl}}",
    },
    carouselPublished: {
        id: '11',
        file: '11 Carousel published.html',
        subject: '"{{carouselName}}" is live',
        preheader: "It's discoverable across every screen now.",
        text: "{{carouselName}} is now live on your channel and showing in discovery.\n\n{{pieceCount}} pieces, framed and ready. View it live: {{actionUrl}}",
    },
    scheduledPublish: {
        id: '12',
        file: '12 Scheduled publish.html',
        subject: '"{{carouselName}}" goes live {{publishDate}}',
        preheader: "We'll publish it for you, right on time.",
        text: "{{carouselName}} premieres {{publishDate}} at {{publishTime}} {{timeZone}}. We will publish it automatically and let you know the moment it is live.\n\nEdit schedule: {{actionUrl}}",
    },
    uploadFailed: {
        id: '13',
        file: '13 Upload failed.html',
        subject: "One piece didn't make it up",
        preheader: "Here's what happened and how to fix it.",
        text: "{{fileName}} could not be added.\n\n{{reason}}\n\nNothing else was affected. Try again: {{actionUrl}}",
    },
    milestoneAlert: {
        id: '14',
        file: '14 Milestone alert.html',
        subject: '"{{itemName}}" just hit {{milestoneLabel}}',
        preheader: "Your work's finding its audience.",
        text: "People are looking, {{firstName}}.\n\n{{itemName}} just passed {{milestoneLabel}}. See the numbers: {{actionUrl}}",
    },
    winBack: {
        id: '15',
        file: '15 Win-back.html',
        subject: "Your wall's been quiet",
        preheader: "Here's what you missed while you were away.",
        text: "It has been a minute, {{firstName}}.\n\nWhile you were away, your work kept moving:\n- {{newViews}} new views\n- {{newLikes}} likes\n- {{newInquiries}} inquiries waiting\n\nSee what is waiting: {{actionUrl}}",
    },
    weeklyDigest: {
        id: '16',
        file: '16 Weekly digest.html',
        subject: 'This week, framed for you',
        preheader: "New work from artists you'd love.",
        text: "Five things worth your eyes this week.\n\n{{digestItems}}\n\nSee this week's picks: {{actionUrl}}",
    },
    newFromFollow: {
        id: '17',
        file: '17 New from follow.html',
        subject: '{{artistName}} just dropped new work',
        preheader: '"{{carouselName}}" is live.',
        text: "{{artistName}} just published {{carouselName}}. You followed them for exactly this. {{pieceCount}} new pieces, live now.\n\n{{actionUrl}}",
    },
    inquirySent: {
        id: '18',
        file: '18 Inquiry sent.html',
        subject: "Your inquiry's on its way",
        preheader: '{{artistName}} has it. Replies land here.',
        text: "Sent.\n\nYour inquiry about {{artworkTitle}} is now with {{artistName}}. They will reply through carsl, and you will get a note here the moment they do.\n\n{{actionUrl}}",
    },
};

module.exports = {
    base: legacyTemplates.base,
    templateDir: emailTemplateDir,
    aliases: {
        emailVerification: 'verifyEmail',
        resendVerificationCode: 'verifyEmail',
        welcomePublisher: 'welcomeArtist',
        welcomeViewer: 'welcomeArtEnthusiast',
        accountCreated: 'profileLive',
        adminLoginToken: 'signInCode',
    },
    templates: {
        ...legacyTemplates.templates,
        ...templates,
        adminInvitation: legacyTemplates.templates.adminInvitation,
    },
};
