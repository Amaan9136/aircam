# AirCam

Turn your phone into a wireless webcam over the local network or internet, using WebRTC with a simple signaling server.

## How it works

1. Open `/desktop` on your computer, it generates a 4 character room code
2. Open `/mobile` on your phone, enter that room code, tap Start
3. The phone streams its camera to the desktop via WebRTC

## Using with OBS

Do not use `/desktop` as a Browser Source, it captures the full dashboard UI (title, connect button, room code box).

Instead, use the clean route:

```
/desktop/clean/<room>
```

Replace `<room>` with the room code shown on `/desktop`. This page shows only the video feed on a black background, connects automatically, and has no dashboard chrome, so OBS captures just the camera output.

Steps:
1. Open `/desktop`, note the room code
2. On your phone, open AirCam, enter the room code, tap Start
3. In OBS, add a Browser Source, set the URL to `https://<your-domain>/desktop/clean/<room>`
4. The stream appears in OBS with no extra UI

## Running locally

```
pip install -r requirements.txt
python app.py
```

Then open `http://localhost:5000`.