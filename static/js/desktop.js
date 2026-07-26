const remoteVideo = document.getElementById('remoteVideo');
const connectBtn = document.getElementById('connectBtn');
const connStatus = document.getElementById('connStatus');
const placeholder = document.getElementById('placeholder');
const roomCode = document.getElementById('roomCode').textContent.trim();

let pc = null;

async function connect() {
    connStatus.textContent = 'Connecting...';
    await clearSignal(roomCode);
    pc = new RTCPeerConnection(RTC_CONFIG);
    pc.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
        placeholder.style.display = 'none';
    };
    pc.onconnectionstatechange = () => {
        connStatus.textContent = `Status: ${pc.connectionState}`;
    };
    pc.addTransceiver('video', { direction: 'recvonly' });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await postSignal(roomCode, 'desktop_offer', pc.localDescription);
    try {
        const answerData = await pollUntil(roomCode, 'mobile_answer', d => d && d.sdp);
        await pc.setRemoteDescription(new RTCSessionDescription(answerData));
        connStatus.textContent = 'Connected';
    } catch (err) {
        connStatus.textContent = 'Connection timed out';
    }
}

connectBtn.addEventListener('click', connect);
watchOrientation(roomCode, remoteVideo);