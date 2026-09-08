'use strict';

// Passwords are supplied privately for Play Console App access; never store them here.
// Keep this migration self-contained so future model/Terms changes do not alter its data.
const accounts = {
    publisher: {
        email: 'play-review-publisher@joincarsl.com',
        password: '$2b$10$NUlPznYqqU1j.jzP8GYNSeopj88C8BZ9YVhRQX8V0h3l7lqPcLf8y',
    },
    viewer: {
        email: 'play-review-viewer@joincarsl.com',
        password: '$2b$10$XUFA6FOwRIi0RBDFpBc6g.QUXWRzMn264o59n9td7bwO1jEnrdsUS',
    },
};

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction(async transaction => {
            const select = (sql, replacements = {}) => queryInterface.sequelize.query(sql, {
                replacements,
                transaction,
                type: Sequelize.QueryTypes.SELECT,
            });
            const ensureAccount = async (table, values) => {
                const sql = `SELECT id, password FROM "${table}" WHERE email = :email FOR UPDATE`;
                const [existing] = await select(sql, { email: values.email });
                if (existing) {
                    if (existing.password !== values.password) {
                        throw new Error(`Review email ${values.email} already exists with different credentials; refusing to overwrite it.`);
                    }
                    // Preserve reviewer changes, account status and existing passwords on reruns.
                    return existing.id;
                }
                await queryInterface.bulkInsert(table, [values], { transaction });
                const [created] = await select(sql, { email: values.email });
                return created.id;
            };

            const styles = await select('SELECT id FROM "Styles" ORDER BY id LIMIT 3');
            if (!styles.length) {
                throw new Error('Seed art styles before creating the Google Play viewer account.');
            }

            const now = new Date();
            const common = {
                status: 'active',
                verificationToken: null,
                verificationTokenExpires: null,
                resetPasswordToken: null,
                resetPasswordTokenExpires: null,
                termsVersion: '2026-09-07',
                termsAcceptedAt: now,
                createdAt: now,
                updatedAt: now,
            };
            const publisherId = await ensureAccount('Publishers', {
                ...common,
                ...accounts.publisher,
                isEmailVerified: true,
                accountSetupComplete: true,
                personaType: 'individual',
                name: 'Carsl Play Review Publisher',
                country: 'Nigeria',
                bio: 'Dedicated demonstration account for Google Play app review.',
            });
            const viewerId = await ensureAccount('Viewers', {
                ...common,
                ...accounts.viewer,
                isVerified: true,
                emailVerifiedAt: now,
                setupCompleted: true,
                firstName: 'Carsl Play',
                lastName: 'Reviewer',
                vibePreference: 50,
                appUsage: 'discovery',
                appUsageLabel: 'Discover art',
            });

            const settings = await select('SELECT id FROM "PublisherSettings" WHERE "publisherId" = :publisherId', { publisherId });
            if (!settings.length) {
                await queryInterface.bulkInsert('PublisherSettings', [{
                    publisherId,
                    carouselFrameTiming: 30,
                    pushNotifications: true,
                    createdAt: now,
                    updatedAt: now,
                }], { transaction });
            }
            const preferences = await select('SELECT id FROM "ViewerStyles" WHERE "viewerId" = :viewerId', { viewerId });
            if (!preferences.length) {
                await queryInterface.bulkInsert('ViewerStyles', styles.map(style => ({
                    viewerId,
                    styleId: style.id,
                    createdAt: now,
                    updatedAt: now,
                })), { transaction });
            }
        });
    },

    async down() {
        // Data-only migration: retain accounts and any review content on rollback.
        // Remove them deliberately through the normal account-deletion flow after review.
    },
};
