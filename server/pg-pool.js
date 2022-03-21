// Postgres Configuration
const { Pool } = require('pg');
let pool;
let config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

module.exports = {
    getPool: () => {
        return (pool) ? pool : new Pool(config);
    }
};