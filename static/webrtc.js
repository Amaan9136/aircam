const RTC_CONFIG = { iceServers: [] };

async function postSignal(role, data) {
    await fetch(`/api/signal/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function getSignal(role) {
    const res = await fetch(`/api/signal/${role}`);
    return res.json();
}

async function clearSignal() {
    await fetch('/api/signal/clear', { method: 'POST' });
}

function pollUntil(role, check, interval = 1000, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const timer = setInterval(async () => {
            const data = await getSignal(role);
            if (check(data)) {
                clearInterval(timer);
                resolve(data);
            } else if (Date.now() - start > timeout) {
                clearInterval(timer);
                reject(new Error('Signal timeout'));
            }
        }, interval);
    });
}
