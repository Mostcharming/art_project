const { sendEmail } = require('../utils/emailService');

const getDefaultActionUrl = (path = '') => {
    const baseUrl = process.env.FRONTEND_URL || 'https://joincarsl.com';
    return `${baseUrl.replace(/\/$/, '')}${path}`;
};

const emailMiddleware = {
    sendVerificationEmail: async (email, verificationCode, name = 'User') => {
        try {
            await sendEmail(email, 'verifyEmail', {
                name,
                verificationCode,
                email,
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw error;
        }
    },

    sendPasswordResetEmail: async (email, resetCode, name = 'User') => {
        try {
            await sendEmail(email, 'passwordReset', {
                name,
                resetCode,
                email,
                actionUrl: getDefaultActionUrl('/reset-password'),
            });
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw error;
        }
    },

    sendWelcomePublisherEmail: async (email, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'welcomeArtist', {
                name,
                firstName: name,
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/complete-profile'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send publisher welcome email:', error);
            throw error;
        }
    },

    sendWelcomeEmail: async (email, name = 'User', variables = {}) => {
        return emailMiddleware.sendWelcomePublisherEmail(email, name, variables);
    },

    sendWelcomeViewerEmail: async (email, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'welcomeArtEnthusiast', {
                name,
                firstName: name,
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/explore'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send viewer welcome email:', error);
            throw error;
        }
    },

    sendFinishSettingUpEmail: async (email, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'finishSettingUp', {
                name,
                firstName: name,
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/complete-profile'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send finish setup email:', error);
            throw error;
        }
    },

    sendProfileLiveEmail: async (email, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'profileLive', {
                name,
                firstName: name,
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/publisher/carousels/new'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send profile live email:', error);
            throw error;
        }
    },

    sendTwoFactorEnabledEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'twoFactorEnabled', {
                email,
                accountIdentifier: email,
                method: 'email',
                actionUrl: getDefaultActionUrl('/settings/security'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send two-factor enabled email:', error);
            throw error;
        }
    },

    sendSignInCodeEmail: async (email, loginToken, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'signInCode', {
                name,
                email,
                loginToken,
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send sign-in code email:', error);
            throw error;
        }
    },

    sendPasswordChangedEmail: async (email, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'passwordChanged', {
                name,
                firstName: name,
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/reset-password'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send password changed email:', error);
            throw error;
        }
    },

    sendNewSignInDetectedEmail: async (email, name = 'User', variables = {}) => {
        try {
            await sendEmail(email, 'newSignInDetected', {
                name,
                firstName: name,
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/settings/security'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send new sign-in email:', error);
            throw error;
        }
    },

    sendCarouselPublishedEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'carouselPublished', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/publisher/carousels'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send carousel published email:', error);
            throw error;
        }
    },

    sendScheduledPublishEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'scheduledPublish', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/publisher/carousels/scheduled'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send scheduled publish email:', error);
            throw error;
        }
    },

    sendUploadFailedEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'uploadFailed', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/publisher/carousels/new'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send upload failed email:', error);
            throw error;
        }
    },

    sendMilestoneAlertEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'milestoneAlert', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/publisher/dashboard'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send milestone alert email:', error);
            throw error;
        }
    },

    sendWinBackEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'winBack', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/publisher/dashboard'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send win-back email:', error);
            throw error;
        }
    },

    sendWeeklyDigestEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'weeklyDigest', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/explore'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send weekly digest email:', error);
            throw error;
        }
    },

    sendNewFromFollowEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'newFromFollow', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/explore'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send new from follow email:', error);
            throw error;
        }
    },

    sendInquirySentEmail: async (email, variables = {}) => {
        try {
            await sendEmail(email, 'inquirySent', {
                email,
                actionUrl: variables.actionUrl || getDefaultActionUrl('/inquiries'),
                ...variables,
            });
        } catch (error) {
            console.error('Failed to send inquiry sent email:', error);
            throw error;
        }
    },

    sendAccountCreatedEmail: async (email, name = 'User') => {
        try {
            const loginLink = getDefaultActionUrl('/login');
            await sendEmail(email, 'profileLive', {
                name,
                firstName: name,
                email,
                actionUrl: loginLink,
            });
        } catch (error) {
            console.error('Failed to send account created email:', error);
            throw error;
        }
    },

    sendResendVerificationEmail: async (email, verificationCode, name = 'User') => {
        try {
            await sendEmail(email, 'verifyEmail', {
                name,
                verificationCode,
                email,
            });
        } catch (error) {
            console.error('Failed to send resend verification email:', error);
            throw error;
        }
    },

    sendCustomEmail: async (email, templateName, variables = {}) => {
        try {
            await sendEmail(email, templateName, variables);
        } catch (error) {
            console.error(`Failed to send ${templateName} email:`, error);
            throw error;
        }
    },
};

module.exports = emailMiddleware;
