class Logger {
    static levels = {
        ERROR: 'error',
        WARN: 'warn',
        INFO: 'info'
    };

    static log(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data
        };

        console[level](JSON.stringify(logEntry));
        
        // Store in extension's local storage for debugging
        chrome.storage.local.get(['logs'], ({logs = []}) => {
            logs.push(logEntry);
            // Keep only last 100 logs
            if (logs.length > 100) logs.shift();
            chrome.storage.local.set({logs});
        });
    }
}

export default Logger;