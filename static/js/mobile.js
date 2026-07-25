const preview = document.getElementById('preview');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const switchBtn = document.getElementById('switchBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const roomInput = document.getElementById('roomInput');

let localStream = null;
let pc = null;
let facingMode = 'environment';

async function getCameraStream() {
    if (!navigator.mediaDevices) {
        throw new Error('Camera unavailable, open this page over HTTPS/ngrok http <port>');
    }
    return navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
    });
}

async function startCamera() {
    try {
        localStream = await getCameraStream();
        preview.srcObject = localStream;
    } catch (err) {
        statusText.textContent = `Camera error: ${err.message}`;
    }
}

async function startStreaming() {
    const room = roomInput.value.trim().toUpperCase();
    if (!room) {
        statusText.textContent = 'Enter the room code from desktop';
        return;
    }
    await clearSignal(room);
    if (!localStream) await startCamera();
    if (!localStream) return;
    pc = new RTCPeerConnection(RTC_CONFIG);
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
            statusDot.classList.add('live');
            statusText.textContent = 'Live';
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            statusDot.classList.remove('live');
            statusText.textContent = 'Disconnected';
        }
    };
    statusText.textContent = 'Waiting for viewer...';
    const offerData = await pollUntil(room, 'desktop_offer', d => d && d.sdp);
    await pc.setRemoteDescription(new RTCSessionDescription(offerData));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await postSignal(room, 'mobile_answer', pc.localDescription);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    roomInput.disabled = true;
}

function stopStreaming() {
    if (pc) { pc.close(); pc = null; }
    statusDot.classList.remove('live');
    statusText.textContent = 'Idle';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    roomInput.disabled = false;
}

startBtn.addEventListener('click', startStreaming);
stopBtn.addEventListener('click', stopStreaming);

switchBtn.addEventListener('click', async () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    if (localStream) localStream.getTracks().forEach(t => t.stop());
    localStream = await getCameraStream();
    preview.srcObject = localStream;
    if (pc) {
        const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
        if (sender) sender.replaceTrack(localStream.getVideoTracks()[0]);
    }
});

startCamera();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js').catch(() => {});
    });
}