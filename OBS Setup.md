# Using AirCam with OBS Virtual Camera

AirCam streams your phone camera to a browser tab over WebRTC. That tab is not
a system camera by itself, so apps like Google Meet or Zoom can't select it
directly. OBS Studio can capture that tab and re-broadcast it as a virtual
camera device that every app can see.

Flow:

Phone camera -> AirCam (WebRTC) -> Desktop page -> OBS Browser Source -> OBS Virtual Camera -> Google Meet

## Requirements

- OBS Studio installed (includes the Virtual Camera plugin by default on
  Windows/Mac; on Linux install `v4l2loopback` first)
- AirCam running: `python app.py`
- Phone and desktop on the same Wi-Fi network

## Steps

1. Start AirCam on your desktop:
   ```
   python app.py
   ```
   Note the printed local IP, e.g. `http://192.168.1.42:5000`

2. On your phone, open `http://192.168.1.42:5000/mobile` and tap **Start**.
   The status dot turns green once it's ready to stream.

3. Open **OBS Studio** on your desktop.

4. In the **Sources** panel, click **+** and choose **Browser**.
   - Name it `AirCam`
   - Check **Local file**: leave unchecked
   - URL: `http://192.168.1.42:5000/desktop`
   - Width: `1280`, Height: `720`
   - Click **OK**

5. In the source's preview, click **Connect** on the AirCam dashboard once,
   inside OBS, so the WebRTC pairing with your phone completes. The video
   should appear in the OBS preview.

6. At the bottom right of OBS, click **Start Virtual Camera**.

7. In Google Meet, open the camera dropdown and select **OBS Virtual Camera**.

## Notes

- If the OBS Browser Source shows a blank frame, right-click it and choose
  **Refresh**, then click **Connect** again.
- Keep the AirCam terminal window running; closing it stops signaling and
  the stream will drop.
- If your phone's IP changes (new Wi-Fi session), just reopen `/mobile` on
  the phone and refresh the Browser Source in OBS — no restart needed on
  desktop.
- To stop, click **Stop Virtual Camera** in OBS and **Stop** on the phone.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Mobile shows blank preview | Camera permission was likely denied; reload `/mobile` and allow camera access when prompted |
| OBS Browser Source stays blank | Click into the source preview and press Connect manually |
| Meet doesn't list OBS Virtual Camera | Make sure you clicked **Start Virtual Camera** in OBS first, then reopen Meet's camera dropdown |
| Stream freezes after switching phone camera (Flip button) | Reconnect from the desktop page; renegotiation isn't automatic on flip |