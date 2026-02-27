const { PublisherSetting } = require('../../models');

exports.getSettings = async (req, res, next) => {
    try {
        const publisherId = req.user.id;
        let settings = await PublisherSetting.findOne({ where: { publisherId } });
        if (!settings) {
            // Create default settings if not found
            settings = await PublisherSetting.create({
                publisherId,
                carouselFrameTiming: 30, // default 30s
                pushNotifications: true
            });
        }
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const publisherId = req.user.id;
        const { carouselFrameTiming, pushNotifications } = req.body;
        let settings = await PublisherSetting.findOne({ where: { publisherId } });
        if (!settings) {
            // Always create if not found (should only happen once)
            settings = await PublisherSetting.create({
                publisherId,
                carouselFrameTiming: carouselFrameTiming !== undefined ? carouselFrameTiming : 30,
                pushNotifications: typeof pushNotifications === 'boolean' ? pushNotifications : true
            });
        } else {
            // Always update the existing settings
            if (carouselFrameTiming !== undefined) settings.carouselFrameTiming = carouselFrameTiming;
            if (pushNotifications !== undefined) settings.pushNotifications = pushNotifications;
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        next(error);
    }
};
