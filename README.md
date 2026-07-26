# AirCam

Turn your phone into a wireless webcam using WebRTC. Stream your phone's camera to a desktop browser or into OBS as a Browser Source.

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

The server listens on `0.0.0.0` on port `5000` (or `$PORT`), so it's reachable from other devices on your network or via a tunnel (e.g. `ngrok http 5000`).

Camera access on mobile requires HTTPS, so use `ngrok` or another HTTPS tunnel when testing across devices instead of `http://<lan-ip>:5000`.