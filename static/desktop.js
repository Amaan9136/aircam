const remoteVideo = document.getElementById('remoteVideo');
const connectBtn = document.getElementById('connectBtn');
const connStatus = document.getElementById('connStatus');
const placeholder = document.getElementById('placeholder');

let pc = null;

async function connect() {
    connStatus.textContent = 'Connecting...';
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
    await postSignal('desktop_offer', pc.localDescription);
    const answerData = await pollUntil('mobile_answer', d => d && d.sdp);
    await pc.setRemoteDescription(new RTCSessionDescription(answerData));
    connStatus.textContent = 'Connected';
}

connectBtn.addEventListener('click', connect);