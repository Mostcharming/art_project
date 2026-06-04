'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            INSERT INTO "Styles" ("name", "description", "createdAt", "updatedAt")
            VALUES
                ('Abstract', 'Art that emphasizes form, color, and composition over realistic representation', NOW(), NOW()),
                ('Realism', 'Art that aims for accurate depiction of reality', NOW(), NOW()),
                ('African art', 'Art inspired by African visual traditions, culture, patterns, and forms', NOW(), NOW()),
                ('Street art', 'Art created in public spaces, including graffiti and murals', NOW(), NOW()),
                ('Photography', 'Art created through photography', NOW(), NOW()),
                ('Sculpture', 'Three-dimensional art form created by shaping materials', NOW(), NOW()),
                ('Digital/NFT', 'Digital art, crypto art, and NFT-native visual work', NOW(), NOW()),
                ('Impressionism', 'Art that captures light and color impressions with loose brushwork', NOW(), NOW()),
                ('Contemporary', 'Art created by artists still living or from recent times', NOW(), NOW()),
                ('Classical', 'Art inspired by classical traditions, formal composition, and historic techniques', NOW(), NOW()),
                ('Minimalist', 'Art that uses simple forms, restraint, and limited visual elements', NOW(), NOW()),
                ('Surrealism', 'Art that explores the unconscious mind and dream-like imagery', NOW(), NOW()),
                ('Minimalism', 'Art that uses simple geometric forms and limited color palettes', NOW(), NOW()),
                ('Pop Art', 'Art that incorporates popular culture, mass media, and consumerism', NOW(), NOW()),
                ('Digital Art', 'Art created using digital technology and tools', NOW(), NOW()),
                ('Conceptual Art', 'Art where the concept or idea is more important than the visual form', NOW(), NOW()),
                ('Street Art', 'Art created in public spaces, including graffiti and murals', NOW(), NOW()),
                ('Contemporary Art', 'Art created by artists still living or from recent times', NOW(), NOW())
            ON CONFLICT ("name") DO NOTHING;
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Styles', {
            name: [
                'Abstract',
                'Realism',
                'African art',
                'Street art',
                'Photography',
                'Sculpture',
                'Digital/NFT',
                'Impressionism',
                'Contemporary',
                'Classical',
                'Minimalist',
                'Surrealism',
                'Minimalism',
                'Pop Art',
                'Digital Art',
                'Conceptual Art',
                'Street Art',
                'Contemporary Art',
            ],
        });
    },
};
