const { sendEmail } = require('../utils/emailService');

const emailMiddleware = {
    sendVerificationEmail: async (email, verificationCode, name = 'User') => {
        try {
            await sendEmail(email, 'emailVerification', {
                name,
                verificationCode,
            });
        } catch (error) {
            console.error('Failed to send verification email:', error);
            throw error;
        }
    },

    sendPasswordResetEmail: async (email, resetToken, name = 'User') => {
        try {
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            await sendEmail(email, 'passwordReset', {
                name,
                resetLink,
            });
        } catch (error) {
            console.error('Failed to send password reset email:', error);
            throw error;
        }
    },

    sendWelcomeEmail: async (email, name = 'User') => {
        try {
            const setupLink = `${process.env.FRONTEND_URL}/complete-profile`;
            await sendEmail(email, 'welcomePublisher', {
                name,
                setupLink,
            });
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            throw error;
        }
    },

    sendAccountCreatedEmail: async (email, name = 'User') => {
        try {
            const loginLink = `${process.env.FRONTEND_URL}/login`;
            await sendEmail(email, 'accountCreated', {
                name,
                email,
                loginLink,
            });
        } catch (error) {
            console.error('Failed to send account created email:', error);
            throw error;
        }
    },

    sendResendVerificationEmail: async (email, verificationCode, name = 'User') => {
        try {
            await sendEmail(email, 'resendVerificationCode', {
                name,
                verificationCode,
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
