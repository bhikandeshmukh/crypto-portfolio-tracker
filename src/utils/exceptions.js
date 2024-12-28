export class PortfolioError extends Error {
    constructor(message) {
        super(message);
        this.name = "PortfolioError";
    }
}

export class CoinNotFoundError extends PortfolioError {
    constructor(message) {
        super(message);
        this.name = "CoinNotFoundError";
    }
}

export class InvalidInputError extends PortfolioError {
    constructor(message) {
        super(message);
        this.name = "InvalidInputError";
    }
}

export class APIError extends PortfolioError {
    constructor(message) {
        super(message);
        this.name = "APIError";
    }
}