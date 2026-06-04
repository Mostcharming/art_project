const { Viewer, Style, sequelize } = require('../../models');
const { hashPassword } = require('../../utils/passwordHash');

/**
 * Get viewer profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        const viewerId = req.user.id;

        const viewer = await Viewer.findByPk(viewerId, {
            include: {
                model: Style,
                as: 'styles',
                attributes: ['id', 'name', 'description'],
                through: { attributes: [] }, // Don't include join table attributes
            },
            attributes: { exclude: ['password', 'verificationToken', 'resetPasswordToken'] },
        });

        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        res.json(viewer);
    } catch (error) {
        console.error('Get profile error:', error);
        next(error);
    }
};

/**
 * Update viewer profile
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { firstName, lastName, vibePreference, appUsage } = req.body;

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        // Update allowed fields
        const updates = {};
        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (vibePreference !== undefined) {
            if (vibePreference < 0 || vibePreference > 100) {
                return res.status(400).json({ error: 'vibePreference must be between 0 and 100' });
            }
            updates.vibePreference = vibePreference;
        }
        if (appUsage !== undefined) updates.appUsage = appUsage;

        await viewer.update(updates);

        res.json({
            message: 'Profile updated successfully',
            viewer: {
                id: viewer.id,
                email: viewer.email,
                firstName: viewer.firstName,
                lastName: viewer.lastName,
                vibePreference: viewer.vibePreference,
                appUsage: viewer.appUsage,
            },
        });
    } catch (error) {
        console.error('Update profile error:', error);
        next(error);
    }
};

/**
 * Complete viewer setup
 */
exports.setup = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { styles, vibe, usage, usageLabel } = req.body;

        if (!Array.isArray(styles) || styles.length === 0) {
            return res.status(400).json({ error: 'At least one style must be selected' });
        }

        if (styles.length < 3) {
            return res.status(400).json({ error: 'Please select at least 3 styles' });
        }

        if (vibe === undefined || vibe === null) {
            return res.status(400).json({ error: 'vibe is required' });
        }

        if (typeof vibe !== 'number' || vibe < 0 || vibe > 100) {
            return res.status(400).json({ error: 'vibe must be a number between 0 and 100' });
        }

        if (!usage || typeof usage !== 'string') {
            return res.status(400).json({ error: 'usage is required' });
        }

        if (usageLabel !== undefined && usageLabel !== null && typeof usageLabel !== 'string') {
            return res.status(400).json({ error: 'usageLabel must be a string' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        const styleNames = styles.map(style => String(style).trim()).filter(Boolean);
        if (styleNames.length !== styles.length) {
            return res.status(400).json({ error: 'styles must contain valid style names' });
        }

        const styleAliases = {
            contemporary: 'contemporary',
            'contemporary art': 'contemporary',
            minimalist: 'minimalist',
            minimalism: 'minimalist',
            'street art': 'street art',
            digital: 'digital/nft',
            nft: 'digital/nft',
            'digital art': 'digital/nft',
            'digital/nft': 'digital/nft',
            'african art': 'african art',
            photographpt: 'photography',
        };
        const normalizeStyleName = styleName => {
            const normalized = styleName.toLowerCase().trim();
            return styleAliases[normalized] || normalized;
        };
        const availableStyles = await Style.findAll();
        const stylesByName = new Map();
        availableStyles.forEach(style => {
            stylesByName.set(style.name.toLowerCase(), style);
            stylesByName.set(normalizeStyleName(style.name), style);
        });

        const selectedStyles = [];
        const missingStyles = [];
        styleNames.forEach(styleName => {
            const matchedStyle = stylesByName.get(styleName.toLowerCase()) || stylesByName.get(normalizeStyleName(styleName));
            if (matchedStyle) {
                selectedStyles.push(matchedStyle);
            } else {
                missingStyles.push(styleName);
            }
        });

        if (missingStyles.length > 0) {
            return res.status(400).json({
                error: 'One or more styles do not exist',
                missingStyles,
            });
        }

        await sequelize.transaction(async transaction => {
            await viewer.update({
                vibePreference: vibe,
                appUsage: usage,
                appUsageLabel: usageLabel || null,
                setupCompleted: true,
            }, { transaction });

            await viewer.setStyles(selectedStyles, { transaction });
        });

        res.json({
            message: 'Viewer setup completed successfully',
            viewer: {
                id: viewer.id,
                email: viewer.email,
                vibePreference: viewer.vibePreference,
                appUsage: viewer.appUsage,
                appUsageLabel: viewer.appUsageLabel,
                setupCompleted: viewer.setupCompleted,
                styles: selectedStyles.map(style => ({
                    id: style.id,
                    name: style.name,
                    description: style.description,
                })),
            },
        });
    } catch (error) {
        console.error('Viewer setup error:', error);
        next(error);
    }
};

/**
 * Update viewer styles
 */
exports.updateStyles = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { styleIds } = req.body;

        if (!Array.isArray(styleIds) || styleIds.length === 0) {
            return res.status(400).json({ error: 'At least one style must be selected' });
        }

        if (styleIds.length < 3) {
            return res.status(400).json({ error: 'Please select at least 3 styles' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        // Verify all styles exist
        const styles = await Style.findAll({
            where: { id: styleIds },
        });

        if (styles.length !== styleIds.length) {
            return res.status(400).json({ error: 'One or more styles do not exist' });
        }

        // Update styles (replace existing ones)
        await viewer.setStyles(styles);

        res.json({
            message: 'Styles updated successfully',
            styles: styles.map(s => ({ id: s.id, name: s.name })),
        });
    } catch (error) {
        console.error('Update styles error:', error);
        next(error);
    }
};

/**
 * Get viewer's selected styles
 */
exports.getStyles = async (req, res, next) => {
    try {
        const viewerId = req.user.id;

        const viewer = await Viewer.findByPk(viewerId, {
            include: {
                model: Style,
                as: 'styles',
                attributes: ['id', 'name', 'description'],
                through: { attributes: [] },
            },
        });

        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        res.json(viewer.styles);
    } catch (error) {
        console.error('Get styles error:', error);
        next(error);
    }
};

/**
 * Change password
 */
exports.changePassword = async (req, res, next) => {
    try {
        const viewerId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({ error: 'Viewer not found' });
        }

        // Verify current password
        const { comparePassword } = require('../../utils/passwordHash');
        const isPasswordValid = await comparePassword(currentPassword, viewer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        await viewer.update({ password: hashedPassword });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        next(error);
    }
};
