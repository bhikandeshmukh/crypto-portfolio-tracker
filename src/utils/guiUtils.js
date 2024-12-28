export const validateCoinInput = (name, coinId, avgPrice, amount) => {
    if (!name || !coinId || !avgPrice || !amount) {
        throw new Error("All fields except Target Prices are required");
    }
    if (avgPrice <= 0) {
        throw new Error("Average price must be greater than 0");
    }
    if (amount <= 0) {
        throw new Error("Amount must be greater than 0");
    }
};

export const parseTargets = (targetsText) => {
    if (!targetsText) return [];
    try {
        const targets = targetsText.split(",").map((t) => parseFloat(t.trim()));
        if (targets.some((t) => t <= 0)) {
            throw new Error("Target prices must be greater than 0");
        }
        return targets;
    } catch (error) {
        throw new Error("Invalid target price format. Use comma-separated numbers");
    }
};

export const formatCurrency = (value) => {
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
};

export const getProfitColor = (value) => {
    return value >= 0 ? "green" : "red";
};

export const maskSensitiveData = (value, privacyEnabled) => {
    return privacyEnabled ? "****" : value;
};

export const verifyPassword = (inputPassword) => {
    const { PRIVACY_MODE_PASSWORD } = require("../../config/settings.js");
    return inputPassword === PRIVACY_MODE_PASSWORD;
};

export const showError = (message) => {
    alert(`Error: ${message}`);
};

export const showConfirmation = (message, onConfirm) => {
    if (confirm(message)) {
        onConfirm();
    }
};