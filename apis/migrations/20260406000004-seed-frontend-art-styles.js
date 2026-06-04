'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            INSERT INTO "Styles" ("name", "description", "createdAt", "updatedAt")
            VALUES
                ('African art', 'Art inspired by African visual traditions, culture, patterns, and forms', NOW(), NOW()),
                ('Street art', 'Art created in public spaces, including graffiti and murals', NOW(), NOW()),
                ('Digital/NFT', 'Digital art, crypto art, and NFT-native visual work', NOW(), NOW()),
                ('Contemporary', 'Art created by artists still living or from recent times', NOW(), NOW()),
                ('Classical', 'Art inspired by classical traditions, formal composition, and historic techniques', NOW(), NOW()),
                ('Minimalist', 'Art that uses simple forms, restraint, and limited visual elements', NOW(), NOW())
            ON CONFLICT ("name") DO NOTHING;
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Styles', {
            name: [
                'African art',
                'Street art',
                'Digital/NFT',
                'Contemporary',
                'Classical',
                'Minimalist',
            ],
        });
    },
};
