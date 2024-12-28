import { PRIVACY_MODE, PRIVACY_MODE_PASSWORD } from '../../config/settings.js';

class PrivacyManager {
    constructor() {
        if (PrivacyManager._instance) {
            return PrivacyManager._instance;
        }
        this.privacyEnabled = PRIVACY_MODE;
        PrivacyManager._instance = this;
    }

    togglePrivacy(password = null) {
        if (this.privacyEnabled && password !== null) {
            if (password === PRIVACY_MODE_PASSWORD) {
                this.privacyEnabled = false;
                return true;
            }
            return false;
        } else {
            this.privacyEnabled = true;
            return true;
        }
    }

    isPrivacyEnabled() {
        return this.privacyEnabled;
    }
}

export const privacyManager = new PrivacyManager();