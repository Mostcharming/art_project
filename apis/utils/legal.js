const TERMS_VERSION = '2026-09-07';
const termsAccepted = (body) => body?.acceptTerms === true && body?.termsVersion === TERMS_VERSION;

const requirePublisherTerms = async (req, res, next) => {
    if (req.account?.termsVersion !== TERMS_VERSION) {
        return res.status(428).json({ error: 'Please read and accept the current Terms of Use before uploading or publishing.', termsVersion: TERMS_VERSION });
    }
    next();
};

module.exports = { TERMS_VERSION, termsAccepted, requirePublisherTerms };
