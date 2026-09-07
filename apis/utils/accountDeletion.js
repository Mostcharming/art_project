const crypto = require('crypto');
const path = require('path');
const fs = require('fs/promises');
const db = require('../models');
const { Op } = db.Sequelize;

const UPLOAD_ROOT = path.resolve(__dirname, '../uploads');
const hashCode = (id, code) => crypto.createHash('sha256').update(`${id}:${code}`).digest('hex');
const safeFile = (value) => {
    if (typeof value !== 'string') return null;
    let pathname = value;
    if (/^https?:\/\//i.test(value)) {
        try { pathname = new URL(value).pathname; } catch { return null; }
    }
    const match = pathname.replace(/\\/g, '/').match(/(?:^|\/)uploads\/(artworks|profile-pictures)\/([a-zA-Z0-9._-]+)$/);
    if (!match || match[2] === '.' || match[2] === '..') return null;
    return `${match[1]}/${match[2]}`;
};

async function eraseViewer(id, transaction) {
    const viewer = await db.Viewer.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!viewer) return [];
    for (const name of ['Favorite', 'Subscriber', 'ViewerStyle', 'ViewerCarouselWatch', 'ViewerCarouselFavorite', 'ViewerCarouselFeedback', 'ViewerSearchHistory', 'ViewerBlock', 'ContentReport']) {
        await db[name].destroy({ where: { viewerId: id }, transaction });
    }
    await db.AdminActivityLog.destroy({ where: { entityType: 'Viewer', entityId: id }, transaction });
    await viewer.destroy({ transaction });
    return [viewer.profilePicture];
}

async function erasePublisher(id, transaction) {
    const publisher = await db.Publisher.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!publisher) return [];
    const carousels = await db.Carousel.findAll({ where: { publisherId: id }, attributes: ['id'], transaction });
    const ids = carousels.map(item => item.id);
    const artworks = ids.length ? await db.Artwork.findAll({ where: { carouselId: ids }, attributes: ['id', 'imageUrl'], transaction }) : [];
    const artworkIds = artworks.map(item => item.id);
    if (artworkIds.length) {
        await db.Favorite.destroy({ where: { artworkId: artworkIds }, transaction });
        await db.AdminActivityLog.destroy({ where: { entityType: 'Artwork', entityId: artworkIds }, transaction });
    }
    await db.ContentReport.destroy({ where: { publisherId: id }, transaction });
    if (ids.length) {
        for (const name of ['ViewerCarouselWatch', 'ViewerCarouselFavorite', 'ViewerCarouselFeedback', 'Artwork']) {
            await db[name].destroy({ where: { carouselId: ids }, transaction });
        }
        await db.AdminActivityLog.destroy({ where: { entityType: 'Carousel', entityId: ids }, transaction });
        await db.Carousel.destroy({ where: { id: ids }, transaction });
    }
    await db.Favorite.destroy({ where: { artistId: id, favoriteType: 'artist' }, transaction });
    for (const name of ['PublisherSetting', 'Subscriber', 'ViewerBlock']) {
        await db[name].destroy({ where: { publisherId: id }, transaction });
    }
    await db.AdminActivityLog.destroy({ where: { entityType: 'Publisher', entityId: id }, transaction });
    await publisher.destroy({ transaction });
    return [publisher.profilePicture, ...artworks.map(item => item.imageUrl)];
}

// Called only after email ownership verification, inside the locked request transaction.
async function eraseAccounts(request, transaction) {
    const files = [];
    for (const target of request.targets) {
        files.push(...await (target.type === 'publisher' ? erasePublisher : eraseViewer)(target.id, transaction));
    }
    await db.AccountDeletionRequest.destroy({
        where: { email: request.email, id: { [Op.ne]: request.id }, status: 'pending' }, transaction,
    });
    const pendingFiles = [...new Set([...(request.pendingFiles || []), ...files.filter(Boolean)])];
    await request.update({ email: null, codeHash: null, pendingFiles, status: 'files_pending' }, { transaction });
}

async function deleteOwnedFile(url, transaction) {
    const relative = safeFile(url);
    if (!relative) return false; // External storage must be handled by its operator, never fetched or guessed.
    for (const [model, field] of [[db.Artwork, 'imageUrl'], [db.Publisher, 'profilePicture'], [db.Viewer, 'profilePicture']]) {
        const normalizedPath = db.Sequelize.fn('regexp_replace', db.Sequelize.col(field), '^(https?://[^/]+)?(/api)?/?', '');
        const referenced = await model.count({ where: db.Sequelize.where(normalizedPath, `uploads/${relative}`), transaction });
        if (referenced) return true; // Another account still owns a reference to the shared asset.
    }
    const target = path.resolve(UPLOAD_ROOT, relative);
    if (!target.startsWith(UPLOAD_ROOT + path.sep)) return false;
    try {
        const realRoot = await fs.realpath(UPLOAD_ROOT);
        const realTarget = await fs.realpath(target);
        if (!realTarget.startsWith(realRoot + path.sep)) return false;
        await fs.unlink(target); // Single file only; no recursive removal or shell commands.
    } catch (error) {
        if (error.code !== 'ENOENT') return false;
    }
    return true;
}

async function processDeletionFiles(id) {
    return db.sequelize.transaction(async transaction => {
        const request = await db.AccountDeletionRequest.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
        if (!request || request.status !== 'files_pending') return request?.status;
        const remaining = [];
        for (const url of request.pendingFiles) {
            if (!await deleteOwnedFile(url, transaction)) remaining.push(url);
        }
        await request.update({ pendingFiles: remaining, status: remaining.length ? 'files_pending' : 'complete', completedAt: remaining.length ? null : new Date() }, { transaction });
        return request.status;
    });
}

async function privacyMaintenance() {
    const pending = await db.AccountDeletionRequest.findAll({ where: { status: 'files_pending' }, attributes: ['id'], limit: 100, order: [['updatedAt', 'ASC']] });
    for (const request of pending) await processDeletionFiles(request.id);
    // Unverified addresses/codes expire quickly. The deletion ledger survives the backup window.
    await db.AccountDeletionRequest.destroy({ where: { status: 'pending', expiresAt: { [Op.lt]: new Date() } } });
    await db.AccountDeletionRequest.destroy({ where: { status: 'complete', completedAt: { [Op.lt]: new Date(Date.now() - 90 * 86400000) } } });
    await db.AdminActivityLog.destroy({ where: { createdAt: { [Op.lt]: new Date(Date.now() - 30 * 86400000) } } });
    await db.ContentReport.destroy({ where: { status: { [Op.ne]: 'open' }, reviewedAt: { [Op.lt]: new Date(Date.now() - 90 * 86400000) } } });
}

module.exports = { hashCode, safeFile, eraseAccounts, processDeletionFiles, privacyMaintenance };
