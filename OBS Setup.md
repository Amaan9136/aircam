# Using AirCam with OBS Virtual Camera

AirCam streams your phone camera to a browser tab. That tab isn't a system
camera by itself, so apps like Google Meet or Zoom can't select it directly.
OBS Studio can capture that tab and re-broadcast it as a virtual camera
device that every app can see.

Flow:

Phone camera -> AirCam -> Desktop dashboard -> OBS Browser Source -> OBS Virtual Camera -> Google Meet / Zoom / etc.

## Requirements

- OBS Studio installed (Virtual Camera is built in on Windows/Mac; on
  Linux install `v4l2loopback` first)
- AirCam open and streaming — see [RUN.md](RUN.md) if you haven't set that
  up yet

## Steps

1. Follow the setup steps in [RUN.md](RUN.md) so your phone is streaming
   and the desktop dashboard shows the live feed in a browser tab.

2. Open **OBS Studio**.

3. In the **Sources** panel, click **+** and choose **Browser**.
   - Name it `AirCam`
   - URL: `https://aircam.onrender.com/desktop`
   - Width: `1280`, Height: `720`
   - Click **OK**

4. In the source's preview inside OBS, enter the room code and click
   **Connect** so the phone pairs with this OBS-hosted tab instead of your
   regular browser tab. The video should appear in the OBS preview.

5. At the bottom right of OBS, click **Start Virtual Camera**.

6. In Google Meet (or Zoom, etc.), open the camera dropdown and select
   **OBS Virtual Camera**.

## Notes

- If the OBS Browser Source shows a blank frame, right-click it, choose
  **Refresh**, then enter the room code and click **Connect** again.
- Room codes expire after 5 minutes of inactivity — if OBS shows a stale
  feed, refresh the source and reconnect with a fresh code from your phone.
- To stop, click **Stop Virtual Camera** in OBS and **Stop** on the phone.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Mobile shows blank preview | Camera permission was likely denied; reload the mobile page and allow camera access when prompted |
| OBS Browser Source stays blank | Click into the source preview, enter the room code, and press Connect manually |
| Meet doesn't list OBS Virtual Camera | Make sure you clicked **Start Virtual Camera** in OBS first, then reopen Meet's camera dropdown |
| Stream freezes after switching phone camera (Flip button) | Reconnect from the OBS Browser Source; renegotiation isn't automatic on flip |