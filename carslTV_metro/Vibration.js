/**
 * Vibration module polyfill for Android TV
 * Android TV devices don't support vibration, so we provide a stub implementation
 */

const Vibration = {
  vibrate: function (duration) {
    // No-op for Android TV devices
    console.warn('Vibration is not supported on this device');
  },
  cancel: function () {
    // No-op for Android TV devices
  },
};

module.exports = Vibration;
