const RTC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] };

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

async function postCandidate(room, role, candidate) {
    await fetch(`/api/signal/${room}/${role}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidate)
    });
}

function watchCandidates(room, role, pc) {
    let since = 0;
    const timer = setInterval(async () => {
        if (pc.signalingState === 'closed') { clearInterval(timer); return; }
        const res = await fetch(`/api/signal/${room}/${role}/candidates?since=${since}`);
        const list = await res.json();
        since += list.length;
        for (const candidate of list) {
            try { await pc.addIceCandidate(candidate); } catch (err) {}
        }
    }, 1000);
    return timer;
}

function wireIceOutbound(pc, room, role) {
    pc.onicecandidate = event => {
        if (event.candidate) postCandidate(room, role, event.candidate.toJSON());
    };
}

function pollUntil(room, role, check, interval = 1000, timeout = 600000) {
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