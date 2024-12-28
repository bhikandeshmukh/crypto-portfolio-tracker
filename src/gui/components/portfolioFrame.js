import { TableColumns } from '../../models/dataModels.js';
import { maskSensitiveData, showConfirmation, showError } from '../../utils/guiUtils.js';
import { privacyManager } from '../../utils/privacyManager.js';
import { EditCoinFrame } from './editCoinFrame.js';

export class PortfolioFrame {
    constructor(tag, portfolio, portfolioBriefFrame = null) {
        this.tag = tag;
        this.portfolio = portfolio;
        this.portfolioBriefFrame = portfolioBriefFrame;
        this.setupUI();
        this.updatePortfolioView();
    }

    setupUI() {
        const container = document.createElement('div');
        container.id = this.tag;

        const title = document.createElement('h3');
        title.textContent = 'Portfolio Overview';
        container.appendChild(title);

        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh';
        refreshButton.addEventListener('click', () => this.updatePortfolioView());
        container.appendChild(refreshButton);

        const table = document.createElement('table');
        table.id = `${this.tag}_table`;
        const headerRow = table.insertRow();
        for (const column of Object.values(TableColumns)) {
            const th = document.createElement('th');
            th.textContent = column.label;
            headerRow.appendChild(th);
        }
        container.appendChild(table);

        document.getElementById('app').appendChild(container);
    }

    updatePortfolioView() {
        const table = document.getElementById(`${this.tag}_table`);
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        const portfolioData = this.portfolio.getPortfolioData();
        const privacyEnabled = privacyManager.isPrivacyEnabled();

        for (const coinData of portfolioData) {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${coinData.name}</td>
                <td>${TableColumns.CURRENT_PRICE.format.replace('{}', coinData.current_price)}</td>
                <td>${TableColumns.AVG_PRICE.format.replace('{}', coinData.avg_price)}</td>
                <td>${maskSensitiveData(TableColumns.AMOUNT.format.replace('{}', coinData.amount), privacyEnabled)}</td>
                <td>${maskSensitiveData(TableColumns.INVESTMENT.format.replace('{}', coinData.investment), privacyEnabled)}</td>
                <td>${maskSensitiveData(TableColumns.CURRENT_VALUE.format.replace('{}', coinData.current_value), privacyEnabled)}</td>
                <td style="color: ${coinData.profit >= 0 ? 'green' : 'red'}">
                    ${maskSensitiveData(TableColumns.PROFIT.format.replace('{}', coinData.profit), privacyEnabled)}
                    (${formatPercentage(coinData.profit_percentage)})
                </td>
                <td>${TableColumns.PORTFOLIO_PERCENTAGE.format.replace('{}', coinData.portfolio_percentage)}</td>
                <td>
                    <div>24H: ${coinData.changes['24h']}%</div>
                    <div>7D: ${coinData.changes['7d']}%</div>
                    <div>30D: ${coinData.changes['30d']}%</div>
                </td>
                <td>${coinData.volume['24h']}</td>
                <td>
                    ${coinData.targets.map((target, index) => `
                        <div>T${index + 1}: ${target.price}</div>
                    `).join('')}
                </td>
                <td>
                    <button onclick="editCoin(${coinData.db_id})">Edit</button>
                    <button onclick="deleteCoin(${coinData.db_id}, '${coinData.name}')">Delete</button>
                </td>
            `;
        }
    }

    editCoin(dbId) {
        new EditCoinFrame(this.portfolio, dbId, () => this.updatePortfolioView());
    }

    deleteCoin(dbId, coinName) {
        showConfirmation(
            `Are you sure you want to delete ${coinName}?`,
            () => {
                this.portfolio.removeCoin(dbId);
                this.updatePortfolioView();
                if (this.portfolioBriefFrame) {
                    this.portfolioBriefFrame.updateBrief();
                }
            }
        );
    }
}
