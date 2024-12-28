import { Sequelize, DataTypes } from 'sequelize';

// Initialize SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'crypto_portfolio.db',
});

// Define CoinModel
const CoinModel = sequelize.define('Coin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    coin_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avg_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    targets: {
        type: DataTypes.JSON,
    },
});

// Create tables if they don't exist
sequelize.sync();

// Export Session and CoinModel
export const Session = sequelize;
export { CoinModel };