function getCompleteImageUrl(imageUrl, baseUrl) {
    if (!imageUrl) {
        return null;
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    const { backendUrl } = require('../config/urls');
    const finalBaseUrl = backendUrl;

    return `${finalBaseUrl}${imageUrl}`;
}

function processCarouselImages(carousel) {
    if (!carousel) {
        return carousel;
    }

    const carouselData = carousel.toJSON ? carousel.toJSON() : carousel;

    if (carouselData.artworks && Array.isArray(carouselData.artworks)) {
        carouselData.artworks = carouselData.artworks.map(artwork => ({
            ...artwork,
            imageUrl: getCompleteImageUrl(artwork.imageUrl)
        }));
    }

    return carouselData;
}


function processCarouselsImages(carousels) {
    if (!Array.isArray(carousels)) {
        return carousels;
    }

    return carousels.map(carousel => processCarouselImages(carousel));
}

module.exports = {
    getCompleteImageUrl,
    processCarouselImages,
    processCarouselsImages
};
