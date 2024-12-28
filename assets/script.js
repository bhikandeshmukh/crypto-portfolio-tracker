import { App } from '../src/gui/app.js';

// Initialize and run the app
const app = new App();
app.run();

// Global functions for portfolio frame
window.editCoin = (dbId) => {
    app.portfolioFrame.editCoin(dbId);
};

window.deleteCoin = (dbId, coinName) => {
    app.portfolioFrame.deleteCoin(dbId, coinName);
};
