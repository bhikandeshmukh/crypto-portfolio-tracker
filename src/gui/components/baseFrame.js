export class BaseFrame {
    constructor(tag, portfolio, refreshCallback = null) {
        this.tag = tag;
        this.portfolio = portfolio;
        this.refreshCallback = refreshCallback;
        this.setupUI();
    }

    setupUI() {
        throw new Error("setupUI() must be implemented in child classes");
    }

    getItemTag(itemName) {
        return `${this.tag}_${itemName}`;
    }

    refresh() {
        if (this.refreshCallback) {
            this.refreshCallback();
        }
    }
}