import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import accountModel from '../accounts/account.model';
import refreshTokenModel from '../accounts/refresh-token.model';

// Load file config only in non-production
let fileConfig: any = {};
if (process.env.NODE_ENV !== 'production') {
    try {
        fileConfig = require('../config.json');
    } catch (e) {
        // config.json not present, rely on env vars
    }
}

function getDatabaseConfig() {
    const databaseConfig = fileConfig.database || {};
    const host = process.env.DB_HOST || databaseConfig.host || 'localhost';
    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : (databaseConfig.port || 3306);
    const user = process.env.DB_USER || databaseConfig.user || 'root';
    const password = process.env.DB_PASSWORD || databaseConfig.password || '';
    const database = process.env.DB_NAME || databaseConfig.database || 'node_mysql_api';
    const ssl = process.env.DB_SSL === 'true';
    return { host, port, user, password, database, ssl };
}

const db: any = {};
export default db;

async function initialize() {
    const { host, port, user, password, database, ssl } = getDatabaseConfig();

    // Create DB if not in production and host is localhost
    if (process.env.NODE_ENV !== 'production' && host === 'localhost') {
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();
    }

    // Connect to DB with Sequelize
    const sequelize = new Sequelize(database, user, password, {
        host,
        port,
        dialect: 'mysql',
        dialectOptions: ssl ? { ssl: { rejectUnauthorized: false } } : undefined,
        logging: false
    });

    // Init models
    db.Account = accountModel(sequelize);
    db.RefreshToken = refreshTokenModel(sequelize);

    // Define relationships
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Sync models with database
    await sequelize.sync();
}

initialize();
