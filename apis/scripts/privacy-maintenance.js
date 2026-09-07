require('dotenv').config();
const fs = require('fs/promises');
const db = require('../models');
const { privacyMaintenance, eraseAccounts, processDeletionFiles } = require('../utils/accountDeletion');

async function main() {
    await db.sequelize.authenticate();
    const [command, ledgerPath, confirmation] = process.argv.slice(2);
    if (command === 'export-ledger') {
        if (!ledgerPath) throw new Error('Provide a protected destination file outside your database backups.');
        const requests = await db.AccountDeletionRequest.findAll({ where: { status: { [db.Sequelize.Op.ne]: 'pending' } }, attributes: ['id', 'accountType', 'targets', 'createdAt'] });
        await fs.writeFile(ledgerPath, JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), requests }, null, 2), { mode: 0o600 });
        console.log(`Exported ${requests.length} deletion references. Protect this file and retain it for 90 days.`);
    } else if (command === 'replay-ledger') {
        if (!ledgerPath || confirmation !== '--confirm-restored-database') throw new Error('Replay requires a ledger file and --confirm-restored-database. Keep the restored service offline.');
        const ledger = JSON.parse(await fs.readFile(ledgerPath, 'utf8'));
        if (ledger.version !== 1 || !Array.isArray(ledger.requests)) throw new Error('Unsupported ledger format.');
        // Validate the entire input before performing any deletion.
        for (const item of ledger.requests) {
            if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(item.id) || !['publisher', 'viewer', 'both'].includes(item.accountType) || !Array.isArray(item.targets) || item.targets.some(target => !['publisher', 'viewer'].includes(target.type) || !Number.isSafeInteger(target.id) || target.id < 1)) throw new Error('Invalid deletion ledger entry.');
        }
        for (const item of ledger.requests) {
            await db.sequelize.transaction(async transaction => {
                const [request] = await db.AccountDeletionRequest.findOrCreate({ where: { id: item.id }, defaults: { accountType: item.accountType, targets: item.targets, expiresAt: new Date(), status: 'files_pending' }, transaction });
                await request.update({ targets: item.targets, status: 'files_pending' }, { transaction });
                await eraseAccounts(request, transaction);
            });
            await processDeletionFiles(item.id);
        }
        console.log(`Reapplied ${ledger.requests.length} verified deletions. Review pending file cleanup before enabling traffic.`);
    } else if (!command || command === 'run') {
        await privacyMaintenance();
        console.log('Privacy maintenance completed.');
    } else throw new Error('Use run, export-ledger, or replay-ledger.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.sequelize.close());
