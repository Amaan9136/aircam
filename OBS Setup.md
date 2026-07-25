# Using AirCam with OBS Virtual Camera

AirCam streams your phone camera to a browser tab. That tab isn't a system
camera by itself, so apps like Google Meet or Zoom can't select it directly.
OBS Studio can capture that tab and re-broadcast it as a virtual camera
device that every app can see.

Flow:

Phone camera -> AirCam -> OBS Browser Source (clean view) -> OBS Virtual Camera -> Google Meet / Zoom / etc.

## Requirements

- OBS Studio installed (Virtual Camera is built in on Windows/Mac; on
  Linux install `v4l2loopback` first)
- AirCam open and streaming — see [RUN.md](RUN.md) if you haven't set that
  up yet

## Steps

1. Follow the setup steps in [RUN.md](RUN.md) so your phone is streaming
   and the desktop dashboard shows the live feed in a browser tab. Note
   the room code shown on `/desktop`.

2. Open **OBS Studio**.

3. In the **Sources** panel, click **+** and choose **Browser**.
   - Name it `AirCam`
   - URL: `https://aircam.onrender.com/desktop/clean/<room>` — replace
     `<room>` with the room code from step 1
   - Width: `1280`, Height: `720`
   - Click **OK**

   Do not point this at `/desktop` — that page includes the dashboard UI
   (title, Connect button, room code box), not just the video. The
   `/desktop/clean/<room>` route shows only the camera feed on a black
   background and connects automatically, so nothing extra is captured.

4. The video should appear in the OBS preview within a few seconds, no
   manual Connect click needed.

5. At the bottom right of OBS, click **Start Virtual Camera**.

6. In Google Meet (or Zoom, etc.), open the camera dropdown and select
   **OBS Virtual Camera**.

## Notes

- If the OBS Browser Source shows a blank frame, right-click it and choose
  **Refresh**. Make sure the phone is still streaming to that same room
  code.
- Room codes expire after 5 minutes of inactivity — if OBS shows a stale
  feed, get a fresh room code from `/desktop`, update the Browser Source
  URL with the new code, and restart streaming on the phone.
- To stop, click **Stop Virtual Camera** in OBS and **Stop** on the phone.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Mobile shows blank preview | Camera permission was likely denied; reload the mobile page and allow camera access when prompted |
| OBS Browser Source stays blank | Right-click the source and choose Refresh, and confirm the URL has the correct, still-active room code |
| Meet doesn't list OBS Virtual Camera | Make sure you clicked **Start Virtual Camera** in OBS first, then reopen Meet's camera dropdown |
| Stream freezes after switching phone camera (Flip button) | Right-click the OBS Browser Source and choose Refresh; renegotiation isn't automatic on flip |