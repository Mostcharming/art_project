'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Styles', [
            {
                name: 'Abstract',
                description: 'Art that emphasizes form, color, and composition over realistic representation',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Realism',
                description: 'Art that aims for accurate depiction of reality',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Impressionism',
                description: 'Art that captures light and color impressions with loose brushwork',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Surrealism',
                description: 'Art that explores the unconscious mind and dream-like imagery',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Minimalism',
                description: 'Art that uses simple geometric forms and limited color palettes',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Pop Art',
                description: 'Art that incorporates popular culture, mass media, and consumerism',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Digital Art',
                description: 'Art created using digital technology and tools',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Conceptual Art',
                description: 'Art where the concept or idea is more important than the visual form',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Street Art',
                description: 'Art created in public spaces, including graffiti and murals',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Photography',
                description: 'Art created through photography',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Sculpture',
                description: 'Three-dimensional art form created by shaping materials',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Contemporary Art',
                description: 'Art created by artists still living or from recent times',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Styles', null, {});
    },
};
