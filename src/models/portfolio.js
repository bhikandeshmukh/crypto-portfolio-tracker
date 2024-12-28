import { CoinMarketCapAPI } from '../utils/apiClient.js';
import { CoinNotFoundError, InvalidInputError } from '../utils/exceptions.js';
import { logger } from '../utils/logger.js';
import { Session, CoinModel } from './database.js';

export class Portfolio {
    constructor() {
        this.apiClient = new CoinMarketCapAPI();
        this.session = Session;
        this.coins = {};
        this._loadCoinsFromDb();
    }

    _loadCoinsFromDb() {
        CoinModel.findAll().then((coins) => {
            coins.forEach((coin) => {
                this.coins[coin.id] = {
                    name: coin.name,
                    id: coin.coin_id,
                    avg_price: coin.avg_price,
                    amount: coin.amount,
                    targets: coin.targets || [],
                };
            });
        });
    }

    addCoin(name, coinId, avgPrice, amount, targets = []) {
        if (avgPrice <= 0) {
            throw new InvalidInputError("Average price must be greater than 0");
        }
        if (amount <= 0) {
            throw new InvalidInputError("Amount must be greater than 0");
        }

        const coin = CoinModel.create({
            name,
            coin_id: coinId,
            avg_price: avgPrice,
            amount,
            targets,
        });

        this.coins[coin.id] = {
            name,
            id: coinId,
            avg_price: avgPrice,
            amount,
            targets,
        };

        logger.info(`Coin added: ${name} with ID ${coinId}, average price ${avgPrice}, amount ${amount}, targets ${targets}`);
        return coin.id;
    }

    removeCoin(dbId) {
        CoinModel.destroy({ where: { id: dbId } });
        delete this.coins[dbId];
        logger.info(`Coin removed: ${dbId}`);
    }

    getCoin(dbId) {
        if (!this.coins[dbId]) {
            throw new CoinNotFoundError(`Coin with ID ${dbId} not found in portfolio`);
        }
        return this.coins[dbId];
    }

    async getPortfolioData() {
        if (Object.keys(this.coins).length === 0) {
            return [];
        }

        try {
            const currentPrices = await this.apiClient.getCurrentPrices(
                Object.values(this.coins).map((coin) => coin.id)
            );
            const coins = [];
            for (const [dbId, data] of Object.entries(this.coins)) {
                if (currentPrices[data.id]) {
                    const currentPrice = currentPrices[data.id].quote.USD.price;
                    const coinQuote = currentPrices[data.id].quote.USD;
                    coins.push(this._analyzeCoin(dbId, data, currentPrice, coinQuote));
                }
            }
            return coins;
        } catch (error) {
            logger.error(`Error fetching portfolio data: ${error}`);
            return [];
        }
    }

    _analyzeCoin(dbId, coinData, currentPrice, coinQuote) {
        const avgPrice = coinData.avg_price;
        const amount = coinData.amount;
        const targets = coinData.targets;
        const name = coinData.name;

        const investment = avgPrice * amount;
        const currentValue = currentPrice * amount;
        const profit = currentValue - investment;
        const profitPercentage = (profit / investment) * 100;

        const totalInvestment = Object.values(this.coins).reduce(
            (sum, coin) => sum + coin.avg_price * coin.amount,
            0
        );
        const portfolioPercentage = totalInvestment > 0 ? (investment / totalInvestment) * 100 : 0;

        const changes = {
            "1h": coinQuote.percent_change_1h || 0,
            "24h": coinQuote.percent_change_24h || 0,
            "7d": coinQuote.percent_change_7d || 0,
            "30d": coinQuote.percent_change_30d || 0,
            "60d": coinQuote.percent_change_60d || 0,
            "90d": coinQuote.percent_change_90d || 0,
        };

        const volume = {
            "24h": coinQuote.volume_24h || 0,
            change_24h: coinQuote.volume_change_24h || 0,
        };

        const targetAnalysis = targets.map((target) => ({
            price: target,
            profit: (target - avgPrice) * amount,
            percentage: ((target - avgPrice) / avgPrice) * 100,
        }));

        return {
            db_id: dbId,
            name: name.toUpperCase(),
            current_price: currentPrice,
            avg_price: avgPrice,
            amount,
            investment,
            current_value: currentValue,
            profit,
            profit_percentage: profitPercentage,
            portfolio_percentage: portfolioPercentage,
            targets: targetAnalysis,
            changes,
            volume,
        };
    }
}