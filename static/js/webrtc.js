const RTC_CONFIG = { iceServers: [] };

async function postSignal(room, role, data) {
    await fetch(`/api/signal/${room}/${role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function getSignal(room, role) {
    const res = await fetch(`/api/signal/${room}/${role}`);
    return res.json();
}

async function clearSignal(room) {
    await fetch(`/api/signal/${room}/clear`, { method: 'POST' });
}

function pollUntil(room, role, check, interval = 1000, timeout = 60000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const timer = setInterval(async () => {
            const data = await getSignal(room, role);
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

function applyOrientation(el, angle) {
    const swap = angle === 90 || angle === 270;
    el.style.transform = angle === 180 ? 'rotate(180deg)' : swap ? `rotate(${angle}deg)` : '';
    el.classList.toggle('swapped', swap);
}

function watchOrientation(room, el) {
    setInterval(async () => {
        const data = await getSignal(room, 'orientation');
        if (data && typeof data.angle === 'number') applyOrientation(el, data.angle);
    }, 1000);
}