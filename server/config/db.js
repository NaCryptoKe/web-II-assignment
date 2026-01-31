const { Pool } = require('pg');

const pool = new Pool({
    user: 'nahom',
    host: 'localhost', // or your server IP
    database: 'axumarcade',
    password: 'maximus',
    port: 5432, // default PostgreSQL port
});

module.exports = pool;