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

function sortArtworksByDisplayOrder(artworks) {
    if (!Array.isArray(artworks)) {
        return artworks;
    }

    return [...artworks].sort((a, b) => {
        const aOrder = Number.isFinite(Number(a.displayOrder)) ? Number(a.displayOrder) : 0;
        const bOrder = Number.isFinite(Number(b.displayOrder)) ? Number(b.displayOrder) : 0;

        if (aOrder !== bOrder) {
            return aOrder - bOrder;
        }

        return (a.id || 0) - (b.id || 0);
    });
}

function processCarouselImages(carousel) {
    if (!carousel) {
        return carousel;
    }

    const carouselData = carousel.toJSON ? carousel.toJSON() : carousel;

    if (carouselData.artworks && Array.isArray(carouselData.artworks)) {
        carouselData.artworks = sortArtworksByDisplayOrder(carouselData.artworks).map(artwork => ({
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
    processCarouselsImages,
    sortArtworksByDisplayOrder
};
