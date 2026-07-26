const remoteVideo = document.getElementById('remoteVideo');
const placeholder = document.getElementById('placeholder');
const roomCode = document.getElementById('roomCode').textContent.trim();

let pc = null;

async function connect() {
    await clearSignal(roomCode);
    pc = new RTCPeerConnection(RTC_CONFIG);
    pc.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
        placeholder.style.display = 'none';
    };
    pc.addTransceiver('video', { direction: 'recvonly' });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await postSignal(roomCode, 'desktop_offer', pc.localDescription);
    try {
        const answerData = await pollUntil(roomCode, 'mobile_answer', d => d && d.sdp);
        await pc.setRemoteDescription(new RTCSessionDescription(answerData));
    } catch (err) {
        placeholder.textContent = 'Connection timed out, retrying...';
        connect();
    }
}

connect();
watchOrientation(roomCode, remoteVideo);