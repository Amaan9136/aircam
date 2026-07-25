const preview = document.getElementById('preview');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const switchBtn = document.getElementById('switchBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

let localStream = null;
let pc = null;
let facingMode = 'environment';

async function getCameraStream() {
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
    await clearSignal();
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
    const offerData = await pollUntil('desktop_offer', d => d && d.sdp);
    await pc.setRemoteDescription(new RTCSessionDescription(offerData));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await postSignal('mobile_answer', pc.localDescription);
    startBtn.disabled = true;
    stopBtn.disabled = false;
}

function stopStreaming() {
    if (pc) { pc.close(); pc = null; }
    statusDot.classList.remove('live');
    statusText.textContent = 'Idle';
    startBtn.disabled = false;
    stopBtn.disabled = true;
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