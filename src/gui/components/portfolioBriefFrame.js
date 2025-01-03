import { formatCurrency, formatPercentage, getProfitColor, maskSensitiveData } from '../../utils/guiUtils.js';
import { privacyManager } from '../../utils/privacyManager.js';

export class PortfolioBriefFrame {
    constructor(tag, portfolio, portfolioFrame = null) {
        this.tag = tag;
        this.portfolio = portfolio;
        this.portfolioFrame = portfolioFrame;
        this.setupUI();
        this.updateBrief();
    }

    setupUI() {
        const container = document.createElement('div');
        container.id = this.tag;

        const privacyToggle = document.createElement('button');
        privacyToggle.textContent = 'Toggle Privacy';
        privacyToggle.addEventListener('click', () => this.togglePrivacy());
        container.appendChild(privacyToggle);

        const briefContainer = document.createElement('div');
        briefContainer.innerHTML = `
            <div>
                <p>Total Investment: <span id="${this.tag}_total_investment">$0.00</span></p>
                <p>Current Value: <span id="${this.tag}_current_value">$0.00</span></p>
                <p>Total Profit/Loss: <span id="${this.tag}_total_profit">$0.00 (0.00%)</span></p>
            </div>
        `;
        container.appendChild(briefContainer);

        document.getElementById('app').appendChild(container);
    }

    togglePrivacy() {
        if (privacyManager.isPrivacyEnabled()) {
            this.showPasswordModal();
        } else {
            privacyManager.togglePrivacy();
            this.updateBrief();
            if (this.portfolioFrame) {
                this.portfolioFrame.updatePortfolioView();
            }
        }
    }

    showPasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Enter Password</h3>
                <p>Enter password to disable privacy mode:</p>
                <input type="password" id="password_input">
                <p id="password_error" style="color: red; display: none;">Incorrect password!</p>
                <button id="password_submit">Submit</button>
                <button id="password_cancel">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);

        const submitButton = document.getElementById('password_submit');
        submitButton.addEventListener('click', () => this.verifyPassword());

        const cancelButton = document.getElementById('password_cancel');
        cancelButton.addEventListener('click', () => this.closeModal());
    }

    verifyPassword() {
        const password = document.getElementById('password_input').value;
        if (privacyManager.togglePrivacy(password)) {
            this.closeModal();
            this.updateBrief();
            if (this.portfolioFrame) {
                this.portfolioFrame.updatePortfolioView();
            }
        } else {
            document.getElementById('password_error').style.display = 'block';
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    updateBrief() {
        const portfolioData = this.portfolio.getPortfolioData();
        const privacyEnabled = privacyManager.isPrivacyEnabled();

        const totalInvestment = portfolioData.reduce((sum, coin) => sum + coin.investment, 0);
        const currentValue = portfolioData.reduce((sum, coin) => sum + coin.current_value, 0);
        const totalProfit = currentValue - totalInvestment;
        const profitPercentage = (totalProfit / totalInvestment) * 100;

        document.getElementById(`${this.tag}_total_investment`).textContent =
            maskSensitiveData(formatCurrency(totalInvestment), privacyEnabled);
        document.getElementById(`${this.tag}_current_value`).textContent =
            maskSensitiveData(formatCurrency(currentValue), privacyEnabled);
        document.getElementById(`${this.tag}_total_profit`).textContent =
            `${maskSensitiveData(formatCurrency(totalProfit), privacyEnabled)} (${formatPercentage(profitPercentage)})`;
        document.getElementById(`${this.tag}_total_profit`).style.color =
            getProfitColor(totalProfit);
    }
}
