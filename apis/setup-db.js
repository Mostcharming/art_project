require('dotenv').config();
const { Client } = require('pg');

async function setupDatabases() {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres' // Connect to default postgres DB first
    });

    try {
        await client.connect();
        const databases = ['art_development', 'art_test', 'art_production'];

        for (const db of databases) {
            try {
                await client.query(`CREATE DATABASE "${db}";`);
                console.log(`✓ Created database: ${db}`);
            } catch (err) {
                if (err.message.includes('already exists')) {
                    console.log(`✓ Database already exists: ${db}`);
                } else {
                    throw err;
                }
            }
        }

        console.log('\n✓ All databases ready!');
        await client.end();
        process.exit(0);
    } catch (error) {
        console.error('Error setting up databases:', error.message);
        process.exit(1);
    }
}

setupDatabases();
