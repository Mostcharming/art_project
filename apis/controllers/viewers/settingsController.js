const { Viewer } = require('../../models');

const DEFAULT_ACCESSIBILITY_PREFERENCES = Object.freeze({
    voiceCommand: false,
    highContrast: true,
    screenReader: false,
    closedCaptions: true,
    largeText: true,
    audioDescriptions: false,
});

const DEFAULT_CONTENT_PREFERENCES = Object.freeze({
    language: 'en',
    matureContent: false,
    highResolutionImages: true,
});

const ACCESSIBILITY_PREFERENCE_KEYS = Object.keys(DEFAULT_ACCESSIBILITY_PREFERENCES);
const CONTENT_PREFERENCE_KEYS = Object.keys(DEFAULT_CONTENT_PREFERENCES);
const SUPPORTED_CONTENT_LANGUAGES = ['en', 'fr', 'es', 'pt'];

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const serializeDate = (date) => (date ? new Date(date).toISOString() : null);

const isPlainPreferenceObject = (value) => (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
);

const buildAccessibilityPreferences = (preferences) => {
    const source = isPlainPreferenceObject(preferences) ? preferences : {};
    const normalized = {};

    ACCESSIBILITY_PREFERENCE_KEYS.forEach((key) => {
        normalized[key] = typeof source[key] === 'boolean'
            ? source[key]
            : DEFAULT_ACCESSIBILITY_PREFERENCES[key];
    });

    return normalized;
};

const buildContentPreferences = (preferences) => {
    const source = isPlainPreferenceObject(preferences) ? preferences : {};
    const normalized = {};

    CONTENT_PREFERENCE_KEYS.forEach((key) => {
        const value = source[key];

        if (key === 'language') {
            normalized[key] = SUPPORTED_CONTENT_LANGUAGES.includes(value)
                ? value
                : DEFAULT_CONTENT_PREFERENCES[key];
            return;
        }

        normalized[key] = typeof value === 'boolean'
            ? value
            : DEFAULT_CONTENT_PREFERENCES[key];
    });

    return normalized;
};

const validateAccessibilityPreferences = (preferences, { requireAll }) => {
    const errors = {};

    if (!isPlainPreferenceObject(preferences)) {
        return {
            errors: {
                preferences: 'Expected object',
            },
        };
    }

    const providedKeys = Object.keys(preferences);
    if (providedKeys.length === 0) {
        errors.preferences = 'At least one preference is required';
    }

    providedKeys.forEach((key) => {
        if (!ACCESSIBILITY_PREFERENCE_KEYS.includes(key)) {
            errors[key] = 'Unknown preference key';
            return;
        }

        if (typeof preferences[key] !== 'boolean') {
            errors[key] = 'Expected boolean';
        }
    });

    if (requireAll) {
        ACCESSIBILITY_PREFERENCE_KEYS.forEach((key) => {
            if (!hasOwn(preferences, key)) {
                errors[key] = 'Required';
            }
        });
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    const normalized = {};
    ACCESSIBILITY_PREFERENCE_KEYS.forEach((key) => {
        if (hasOwn(preferences, key)) {
            normalized[key] = preferences[key];
        }
    });

    return { preferences: normalized };
};

const validateContentPreferences = (preferences, { requireAll }) => {
    const errors = {};

    if (!isPlainPreferenceObject(preferences)) {
        return {
            errors: {
                preferences: 'Expected object',
            },
        };
    }

    const providedKeys = Object.keys(preferences);
    if (providedKeys.length === 0) {
        errors.preferences = 'At least one preference is required';
    }

    providedKeys.forEach((key) => {
        if (!CONTENT_PREFERENCE_KEYS.includes(key)) {
            errors[key] = 'Unknown preference key';
            return;
        }

        if (key === 'language') {
            if (!SUPPORTED_CONTENT_LANGUAGES.includes(preferences[key])) {
                errors[key] = `Expected one of: ${SUPPORTED_CONTENT_LANGUAGES.join(', ')}`;
            }
            return;
        }

        if (typeof preferences[key] !== 'boolean') {
            errors[key] = 'Expected boolean';
        }
    });

    if (requireAll) {
        CONTENT_PREFERENCE_KEYS.forEach((key) => {
            if (!hasOwn(preferences, key)) {
                errors[key] = 'Required';
            }
        });
    }

    if (Object.keys(errors).length > 0) {
        return { errors };
    }

    const normalized = {};
    CONTENT_PREFERENCE_KEYS.forEach((key) => {
        if (hasOwn(preferences, key)) {
            normalized[key] = preferences[key];
        }
    });

    return { preferences: normalized };
};

const sendValidationError = (res, errors) => res.status(422).json({
    success: false,
    message: 'Invalid accessibility settings',
    errors,
});

const sendContentValidationError = (res, errors) => res.status(422).json({
    success: false,
    message: 'Invalid content preferences',
    errors,
});

const findViewer = async (viewerId) => Viewer.findByPk(viewerId, {
    attributes: [
        'id',
        'accessibilityPreferences',
        'accessibilityPreferencesUpdatedAt',
        'contentPreferences',
        'contentPreferencesUpdatedAt',
    ],
});

exports.getAccessibilitySettings = async (req, res, next) => {
    try {
        const viewer = await findViewer(req.user.id);

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const hasSavedPreferences = isPlainPreferenceObject(viewer.accessibilityPreferences);

        res.json({
            success: true,
            preferences: buildAccessibilityPreferences(viewer.accessibilityPreferences),
            updatedAt: hasSavedPreferences
                ? serializeDate(viewer.accessibilityPreferencesUpdatedAt)
                : null,
        });
    } catch (error) {
        console.error('Get accessibility settings error:', error);
        next(error);
    }
};

exports.replaceAccessibilitySettings = async (req, res, next) => {
    try {
        const validation = validateAccessibilityPreferences(req.body?.preferences, {
            requireAll: true,
        });

        if (validation.errors) {
            return sendValidationError(res, validation.errors);
        }

        const viewer = await findViewer(req.user.id);

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const preferences = buildAccessibilityPreferences(validation.preferences);
        const updatedAt = new Date();

        await viewer.update({
            accessibilityPreferences: preferences,
            accessibilityPreferencesUpdatedAt: updatedAt,
        });

        res.json({
            success: true,
            message: 'Accessibility settings updated',
            preferences,
            updatedAt: serializeDate(updatedAt),
        });
    } catch (error) {
        console.error('Replace accessibility settings error:', error);
        next(error);
    }
};

exports.updateAccessibilitySettings = async (req, res, next) => {
    try {
        const validation = validateAccessibilityPreferences(req.body?.preferences, {
            requireAll: false,
        });

        if (validation.errors) {
            return sendValidationError(res, validation.errors);
        }

        const viewer = await findViewer(req.user.id);

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const preferences = {
            ...buildAccessibilityPreferences(viewer.accessibilityPreferences),
            ...validation.preferences,
        };
        const updatedAt = new Date();

        await viewer.update({
            accessibilityPreferences: preferences,
            accessibilityPreferencesUpdatedAt: updatedAt,
        });

        res.json({
            success: true,
            message: 'Accessibility settings updated',
            preferences,
            updatedAt: serializeDate(updatedAt),
        });
    } catch (error) {
        console.error('Update accessibility settings error:', error);
        next(error);
    }
};

exports.getContentPreferences = async (req, res, next) => {
    try {
        const viewer = await findViewer(req.user.id);

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const hasSavedPreferences = isPlainPreferenceObject(viewer.contentPreferences);

        res.json({
            success: true,
            preferences: buildContentPreferences(viewer.contentPreferences),
            updatedAt: hasSavedPreferences
                ? serializeDate(viewer.contentPreferencesUpdatedAt)
                : null,
        });
    } catch (error) {
        console.error('Get content preferences error:', error);
        next(error);
    }
};

exports.replaceContentPreferences = async (req, res, next) => {
    try {
        const validation = validateContentPreferences(req.body?.preferences, {
            requireAll: true,
        });

        if (validation.errors) {
            return sendContentValidationError(res, validation.errors);
        }

        const viewer = await findViewer(req.user.id);

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const preferences = buildContentPreferences(validation.preferences);
        const updatedAt = new Date();

        await viewer.update({
            contentPreferences: preferences,
            contentPreferencesUpdatedAt: updatedAt,
        });

        res.json({
            success: true,
            message: 'Content preferences updated',
            preferences,
            updatedAt: serializeDate(updatedAt),
        });
    } catch (error) {
        console.error('Replace content preferences error:', error);
        next(error);
    }
};

exports.updateContentPreferences = async (req, res, next) => {
    try {
        const validation = validateContentPreferences(req.body?.preferences, {
            requireAll: false,
        });

        if (validation.errors) {
            return sendContentValidationError(res, validation.errors);
        }

        const viewer = await findViewer(req.user.id);

        if (!viewer) {
            return res.status(404).json({
                success: false,
                message: 'Viewer not found',
            });
        }

        const preferences = {
            ...buildContentPreferences(viewer.contentPreferences),
            ...validation.preferences,
        };
        const updatedAt = new Date();

        await viewer.update({
            contentPreferences: preferences,
            contentPreferencesUpdatedAt: updatedAt,
        });

        res.json({
            success: true,
            message: 'Content preferences updated',
            preferences,
            updatedAt: serializeDate(updatedAt),
        });
    } catch (error) {
        console.error('Update content preferences error:', error);
        next(error);
    }
};

exports.DEFAULT_ACCESSIBILITY_PREFERENCES = DEFAULT_ACCESSIBILITY_PREFERENCES;
exports.DEFAULT_CONTENT_PREFERENCES = DEFAULT_CONTENT_PREFERENCES;
