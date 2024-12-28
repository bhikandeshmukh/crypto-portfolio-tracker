import { showError } from '../../utils/guiUtils.js';

export class EditCoinFrame {
    constructor(portfolio, dbId, refreshCallback) {
        this.portfolio = portfolio;
        this.dbId = dbId;
        this.coinData = portfolio.getCoin(dbId);
        this.refreshCallback = refreshCallback;
        this.show();
    }

    show() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Edit ${this.coinData.name}</h3>
                <form id="edit_form">
                    <label for="edit_name">Name:</label>
                    <input type="text" id="edit_name" value="${this.coinData.name}" required>
                    <label for="edit_id">CoinMarketCap ID:</label>
                    <input type="text" id="edit_id" value="${this.coinData.id}" required>
                    <label for="edit_price">Average Price ($):</label>
                    <input type="number" id="edit_price" value="${this.coinData.avg_price}" step="0.00000001" required>
                    <label for="edit_amount">Amount:</label>
                    <input type="number" id="edit_amount" value="${this.coinData.amount}" step="0.00000001" required>
                    <label for="edit_targets">Target Prices ($):</label>
                    <input type="text" id="edit_targets" value="${this.coinData.targets.join(',')}">
                    <button type="submit">Save</button>
                    <button type="button" id="edit_cancel">Cancel</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const form = document.getElementById('edit_form');
        form.addEventListener('submit', (e) => this.saveChanges(e));

        const cancelButton = document.getElementById('edit_cancel');
        cancelButton.addEventListener('click', () => this.closeModal());
    }

    saveChanges(event) {
        event.preventDefault();
        try {
            const name = document.getElementById('edit_name').value;
            const coinId = document.getElementById('edit_id').value;
            const avgPrice = parseFloat(document.getElementById('edit_price').value);
            const amount = parseFloat(document.getElementById('edit_amount').value);
            const targetsText = document.getElementById('edit_targets').value;

            if (!name || !coinId || !avgPrice || !amount) {
                throw new Error("All fields except Target Prices are required");
            }

            const targets = targetsText ? targetsText.split(',').map(parseFloat) : [];

            this.portfolio.removeCoin(this.dbId);
            this.portfolio.addCoin(name, coinId, avgPrice, amount, targets);
            this.refreshCallback();
            this.closeModal();
        } catch (error) {
            showError(error.message);
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }
}
