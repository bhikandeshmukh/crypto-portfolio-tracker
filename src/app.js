import { Portfolio } from '../models/portfolio.js';
import { AddCoinFrame } from './components/addCoinFrame.js';
import { PortfolioBriefFrame } from './components/portfolioBriefFrame.js';
import { PortfolioFrame } from './components/portfolioFrame.js';
import { logger } from '../utils/logger.js';
import { REFRESH_INTERVAL } from '../../config/settings.js';

export class App {
    constructor() {
        this.portfolio = new Portfolio();
        this.lastRefresh = 0;
        this.initializeUI();
        this.setupEventListeners();
        this.refreshPortfolio();
    }

    initializeUI() {
        const appContainer = document.createElement('div');
        appContainer.id = 'app';
        document.body.appendChild(appContainer);

        this.addCoinFrame = new AddCoinFrame('add_coin_frame', this.portfolio, () => this.refreshPortfolio());
        appContainer.appendChild(this.addCoinFrame.getElement());

        this.portfolioBriefFrame = new PortfolioBriefFrame('portfolio_brief_frame', this.portfolio);
        appContainer.appendChild(this.portfolioBriefFrame.getElement());

        this.portfolioFrame = new PortfolioFrame('portfolio_frame', this.portfolio, this.portfolioBriefFrame);
        appContainer.appendChild(this.portfolioFrame.getElement());

        this.includeCredits(appContainer);
    }

    setupEventListeners() {
        setInterval(() => this.checkRefresh(), 1000);
    }

    refreshPortfolio() {
        this.portfolioFrame.updatePortfolioView();
        this.portfolioBriefFrame.updateBrief();
        this.lastRefresh = Date.now();
        logger.info('Portfolio refreshed');
    }

    checkRefresh() {
        const currentTime = Date.now();
        if (currentTime - this.lastRefresh >= REFRESH_INTERVAL) {
            this.refreshPortfolio();
        }
    }

    includeCredits(container) {
        const creditsContainer = document.createElement('div');
        creditsContainer.className = 'credits';
        creditsContainer.innerHTML = `
            <p>Built by: <a href="https://github.com/007SKRN" target="_blank">007SKRN</a></p>
            <p>Repository: <a href="https://github.com/007SKRN/crypto-portfolio-tracker" target="_blank">crypto-portfolio-tracker</a></p>
            <p>Version: 1.0.2</p>
        `;
        container.appendChild(creditsContainer);
    }

    run() {
        logger.info('Application is running');
    }
}
