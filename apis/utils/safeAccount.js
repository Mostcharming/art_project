// Never serialize password hashes, one-time codes, or recovery credentials.
const SECRET_FIELDS = ['password', 'verificationToken', 'verificationTokenExpires', 'resetPasswordToken', 'resetPasswordTokenExpires', 'loginToken', 'loginTokenExpires'];
const safeAccount = (value) => {
    const result = value?.get ? value.get({ plain: true }) : { ...value };
    for (const field of SECRET_FIELDS) delete result[field];
    return result;
};
module.exports = { SECRET_FIELDS, safeAccount };
