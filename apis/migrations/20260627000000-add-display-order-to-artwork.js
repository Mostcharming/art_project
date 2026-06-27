'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Artworks', 'displayOrder', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Position of the artwork inside its carousel'
        });

        await queryInterface.sequelize.query(`
            WITH ordered_artworks AS (
                SELECT
                    id,
                    ROW_NUMBER() OVER (
                        PARTITION BY "carouselId"
                        ORDER BY id ASC
                    ) - 1 AS "displayOrder"
                FROM "Artworks"
            )
            UPDATE "Artworks"
            SET "displayOrder" = ordered_artworks."displayOrder"
            FROM ordered_artworks
            WHERE "Artworks".id = ordered_artworks.id;
        `);

        await queryInterface.addIndex('Artworks', ['carouselId', 'displayOrder']);
    },

    async down(queryInterface) {
        await queryInterface.removeIndex('Artworks', ['carouselId', 'displayOrder']);
        await queryInterface.removeColumn('Artworks', 'displayOrder');
    }
};
