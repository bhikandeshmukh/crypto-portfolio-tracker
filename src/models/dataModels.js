// CoinData: Represents the data for a single coin
export const CoinData = {
    name: "",
    current_price: 0,
    avg_price: 0,
    amount: 0,
    investment: 0,
    current_value: 0,
    profit: 0,
    profit_percentage: 0,
    portfolio_percentage: 0,
    targets: [],
    changes: {},
    volume: {},
};

// ColumnConfig: Represents the configuration for a table column
export class ColumnConfig {
    constructor(label, format = "{:.2f}", width = 0) {
        this.label = label;
        this.format = format;
        this.width = width;
    }
}

// TableColumns: Defines the columns for the portfolio table
export const TableColumns = {
    NAME: new ColumnConfig("Coin", "{}", 50),
    CURRENT_PRICE: new ColumnConfig("Current Price", "${:.8g}", 75),
    AVG_PRICE: new ColumnConfig("Avg Price", "${:.8g}", 75),
    AMOUNT: new ColumnConfig("Amount", "{:.8g}", 75),
    INVESTMENT: new ColumnConfig("Investment", "${:.2f}", 75),
    CURRENT_VALUE: new ColumnConfig("Current Value", "${:.2f}", 75),
    PROFIT: new ColumnConfig("Profit/Loss", "{}", 75),
    PORTFOLIO_PERCENTAGE: new ColumnConfig("Portfolio %", "{:.2f}%", 50),
    CHANGES: new ColumnConfig("Changes", "{}", 100),
    VOLUME: new ColumnConfig("24H Volume", "{}", 100),
    TARGETS: new ColumnConfig("Targets", "{}", 100),
    ACTIONS: new ColumnConfig("Actions", "{}", 100),
};