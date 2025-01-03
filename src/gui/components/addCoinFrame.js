import { validateCoinInput, parseTargets } from '../../utils/guiUtils.js';
import { showError } from '../../utils/guiUtils.js';

export class AddCoinFrame {
    constructor(tag, portfolio, refreshCallback) {
        this.tag = tag;
        this.portfolio = portfolio;
        this.refreshCallback = refreshCallback;
        this.setupUI();
    }

    setupUI() {
        const container = document.createElement('div');
        container.id = this.tag;

        const header = document.createElement('h3');
        header.textContent = 'Add New Coin';
        container.appendChild(header);

        const form = document.createElement('form');
        form.innerHTML = `
            <label for="${this.tag}_name">Coin Name:</label>
            <input type="text" id="${this.tag}_name" required>
            <label for="${this.tag}_id">CoinMarketCap ID:</label>
            <input type="text" id="${this.tag}_id" required>
            <label for="${this.tag}_price">Average Buy Price ($):</label>
            <input type="number" id="${this.tag}_price" step="0.00000001" required>
            <label for="${this.tag}_amount">Amount:</label>
            <input type="number" id="${this.tag}_amount" step="0.00000001" required>
            <label for="${this.tag}_targets">Target Prices ($):</label>
            <input type="text" id="${this.tag}_targets">
            <button type="submit">Add Coin</button>
            <button type="button" id="${this.tag}_clear_button">Clear Fields</button>
        `;
        form.addEventListener('submit', (e) => this.addCoin(e));
        container.appendChild(form);

        document.getElementById('app').appendChild(container);

        // Setup tooltips
        this.setupTooltips();
    }

    setupTooltips() {
        const tooltips = {
            [`${this.tag}_name`]: "Enter the name of your cryptocurrency",
            [`${this.tag}_id`]: "Enter the CoinMarketCap ID (found in the URL of the coin's page)",
            [`${this.tag}_price`]: "Enter your average purchase price in USD",
            [`${this.tag}_amount`]: "Enter the amount of coins you own",
            [`${this.tag}_targets`]: "Enter target prices separated by commas (e.g., 45000,50000,55000)",
        };

        for (const [id, text] of Object.entries(tooltips)) {
            const input = document.getElementById(id);
            input.title = text;
        }
    }

    addCoin(event) {
        event.preventDefault();
        try {
            const name = document.getElementById(`${this.tag}_name`).value;
            const coinId = document.getElementById(`${this.tag}_id`).value;
            const avgPrice = parseFloat(document.getElementById(`${this.tag}_price`).value);
            const amount = parseFloat(document.getElementById(`${this.tag}_amount`).value);
            const targetsText = document.getElementById(`${this.tag}_targets`).value;

            validateCoinInput(name, coinId, avgPrice, amount);
            const targets = parseTargets(targetsText);

            this.portfolio.addCoin(name, coinId, avgPrice, amount, targets);
            this.refreshCallback();
            this.clearFields();
        } catch (error) {
            showError(error.message);
        }
    }

    clearFields() {
        document.getElementById(`${this.tag}_name`).value = '';
        document.getElementById(`${this.tag}_id`).value = '';
        document.getElementById(`${this.tag}_price`).value = '';
        document.getElementById(`${this.tag}_amount`).value = '';
        document.getElementById(`${this.tag}_targets`).value = '';
    }
}
