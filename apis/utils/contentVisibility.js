const { Op, literal } = require('sequelize');

const blockedPublisherIds = (viewerId) => {
    const id = Number(viewerId);
    // Only a validated integer is interpolated; no request strings reach SQL.
    return Number.isSafeInteger(id) && id > 0
        ? `SELECT "publisherId" FROM "ViewerBlocks" WHERE "viewerId" = ${id}`
        : 'SELECT NULL::integer WHERE false';
};

const visiblePublisherWhere = (viewerId) => ({
    status: 'active',
    id: { [Op.notIn]: literal(`(${blockedPublisherIds(viewerId)})`) },
});

const visibleCarouselWhere = (viewerId) => ({
    status: 'active', adminApproved: true, isDeleted: false,
    publisherId: { [Op.notIn]: literal(`(SELECT "id" FROM "Publishers" WHERE "status" != 'active' UNION ${blockedPublisherIds(viewerId)})`) },
});

const visibleFavoriteWhere = (viewerId) => {
    const publishers = `SELECT "id" FROM "Publishers" WHERE "status" = 'active' AND "id" NOT IN (${blockedPublisherIds(viewerId)})`;
    const artworks = `SELECT a."id" FROM "Artworks" a JOIN "Carousels" c ON c."id" = a."carouselId" WHERE a."isDeleted" = false AND c."isDeleted" = false AND c."status" = 'active' AND c."adminApproved" = true AND c."publisherId" IN (${publishers})`;
    return { [Op.or]: [
        { favoriteType: 'artist', artistId: { [Op.in]: literal(`(${publishers})`) } },
        { favoriteType: 'artwork', artworkId: { [Op.in]: literal(`(${artworks})`) } },
    ] };
};
module.exports = { visibleCarouselWhere, visiblePublisherWhere, visibleFavoriteWhere };
