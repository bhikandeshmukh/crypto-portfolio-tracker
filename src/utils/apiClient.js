import axios from 'axios';
import { logger } from './logger.js';
import { API_BASE_URL, API_KEY } from '../../config/settings.js';

export class CoinMarketCapAPI {
    constructor() {
        this.apiKey = API_KEY;
        this.baseUrl = API_BASE_URL;
    }

    async getCurrentPrices(coinIds) {
        const url = `${this.baseUrl}/cryptocurrency/quotes/latest`;
        const params = {
            id: coinIds.join(','),
            aux: 'total_supply',
        };
        const headers = {
            'X-CMC_PRO_API_KEY': this.apiKey,
        };

        try {
            const response = await axios.get(url, { params, headers });
            return response.data.data;
        } catch (error) {
            logger.error(`Error fetching prices: ${error}`);
            return {};
        }
    }
}