const { Viewer, Style, sequelize } = require('../../models');
const { hashPassword, comparePassword } = require('../../utils/passwordHash');
const emailMiddleware = require('../../middleware/emailMiddleware');
const { getCompleteImageUrl } = require('../../utils/imageUrlHelper');

const formatViewerProfile = (viewer) => {
    const firstName = viewer.firstName || '';
    const lastName = viewer.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return {
        id: viewer.id,
        email: viewer.email,
        firstName,
        lastName,
        fullName,
        profilePicture: getCompleteImageUrl(viewer.profilePicture),
        updatedAt: viewer.updatedAt ? viewer.updatedAt.toISOString() : null,
    };
};

const sendProfileValidationError = (res, errors) => res.status(422).json({
    success: false,
    message: 'Invalid profile details',
    errors,
});

/**
 * Get viewer profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        const viewerId = req.user.id;

        const viewer = await Viewer.findByPk(viewerId, {
            attributes: ['id', 'email', 'firstName', 'lastName', 'profilePicture', 'updatedAt'],
        });

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        res.json({
            success: true,
            viewer: formatViewerProfile(viewer),
        });
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
        const { firstName, lastName } = req.body;

        const errors = {};
        if (typeof firstName !== 'string' || firstName.trim() === '') {
            errors.firstName = 'First name is required';
        }

        if (lastName !== undefined && lastName !== null && typeof lastName !== 'string') {
            errors.lastName = 'Last name must be a string';
        }

        if (Object.keys(errors).length > 0) {
            return sendProfileValidationError(res, errors);
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        await viewer.update({
            firstName: firstName.trim(),
            lastName: lastName ? lastName.trim() : '',
        });

        res.json({
            success: true,
            message: 'Name updated successfully',
            viewer: formatViewerProfile(viewer),
        });
    } catch (error) {
        console.error('Update profile error:', error);
        next(error);
    }
};

/**
 * Upload viewer profile picture
 */
exports.uploadProfilePicture = async (req, res, next) => {
    try {
        const viewerId = req.user.id;

        if (!req.file) {
            return res.status(422).json({
                success: false,
                message: 'Please select a valid image file',
            });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        await viewer.update({ profilePicture });

        res.json({
            success: true,
            message: 'Profile picture updated successfully',
            viewer: formatViewerProfile(viewer),
        });
    } catch (error) {
        console.error('Upload profile picture error:', error);
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
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const errors = {};
        if (!currentPassword) errors.currentPassword = 'Current password is required';
        if (!newPassword) errors.newPassword = 'New password is required';
        if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({
                success: false,
                message: 'Invalid password details',
                errors,
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(422).json({
                success: false,
                message: 'New passwords do not match',
            });
        }

        if (newPassword.length < 8) {
            return res.status(422).json({
                success: false,
                message: 'New password must be at least 8 characters',
            });
        }

        const viewer = await Viewer.findByPk(viewerId);
        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const isPasswordValid = await comparePassword(currentPassword, viewer.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        const hashedPassword = await hashPassword(newPassword);

        await viewer.update({ password: hashedPassword });

        try {
            await emailMiddleware.sendPasswordChangedEmail(
                viewer.email,
                viewer.firstName || viewer.email.split('@')[0]
            );
        } catch (emailError) {
            console.warn('Password changed email sending failed:', emailError);
        }

        res.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        next(error);
    }
};
