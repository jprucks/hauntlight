# Hauntlight 1.1.0

Touch-friendly Halloween projection mapping for Safari on an iPad (5th generation), with an Epson PowerLite 980W connected by screen mirroring.

**Open:** https://hauntlight-jprucks.jprucks.chatgpt.site

The hosted app is private and may request ChatGPT sign-in. This release targets Safari/iPadOS **16.4 or later** within the iPad 5's supported 16.x line. Hardware compatibility and performance have **not been verified on a physical iPad or projector**.

## What it does

- 24 animated scenes, including 10 with no preferred up/down direction, with wall, ceiling, garden and window layout presets.
- Up to six independent surfaces with draggable convex quadrilaterals, fine corner adjustment and oval masks.
- Per-surface opacity, edge softness, motion speed and visibility; duplicate/delete controls.
- Calibration grid, full-screen alignment, clean projection mode, pause and blackout.
- Browser-local layout saving and JSON import/export for backups or transfers.
- iPad Home Screen icon and downloadable Mac `.webloc` desktop shortcut.

Start with one to three surfaces on the iPad 5. Auto quality starts touch devices at 384 pixels per surface and a 20 fps target, reduces resolution for more than three visible surfaces, and steps down further when measured rendering work is high. Frame-rate targets and the six-surface limit are design choices, not measured hardware guarantees. Default visuals are procedural and do not require video downloads.

## iPad improvements in 1.1.0

- Stage-first tablet layout in landscape and portrait, 44-pixel touch controls, 56-pixel corner hit areas, and 16-pixel input text to avoid Safari focus zoom.
- Auto quality recommended for iPad 5; saved per browser. Low/Balanced/High overrides remain available.
- Static thumbnails are drawn once and reused. Paused, calibration-grid, blacked-out, background, and off-screen editor views stop animation work. Unchanged surface textures and edge masks are reused.
- Align mode keeps surface selection, corner selection, fine/coarse nudge buttons, and Project available on screen. Projection controls appear with one tap and hide after a short delay.
- Safari viewport and orientation changes recalculate the stage without changing saved normalized corners.
- Choose **Any orientation** in the scene library for Foxfire Spores, Moonlit Water, Velvet Nebula, Midnight Mandala, Cosmic Whirlpool, Potion Cells, Enchanted Honeycomb, Echoes in the Dark, Secret Mycelium, and Ember Constellation. These have no horizon, text, or upright characters.

Verified with automated tests and desktop-browser checks at 1024×768 and 768×1024 iframe viewports. This tests responsive layout, not iPad GPU speed, touch hardware, Safari, or HDMI/AirPlay mirroring.

## Connect and project

1. Connect an **Apple TV to the Epson by HDMI**, then use iPad Control Center → Screen Mirroring. Keep the devices on the same Wi-Fi network. Alternatively use an **Apple Lightning Digital AV Adapter and HDMI cable**.
2. Open the app in Safari. For a Home Screen shortcut, use Share → Add to Home Screen, then launch the icon. Keep the iPad in landscape orientation and on power.
3. Set Settings → Display & Brightness → Auto-Lock → Never for the show. Restore your preferred setting afterward. Wake lock is unreliable in Home Screen web apps on iPadOS 16.
4. Choose a layout and scenes. Enable **Grid** if useful, then press **Align** and move each corner to the actual object. Adjust opacity and edge softness. Calibrate with the same orientation and fullscreen state that you will use for projection.
5. Press **Project**. Tap to reveal controls, use **Blackout** to blank the image, or return to the editor. Screen mirroring shows the same image on the iPad and projector; it does not provide a separate private control display.

The projector's native format is **1280 × 800, 16:10**. The iPad's mirrored image can introduce black bars. Preserve aspect ratio in the projector settings and calibrate after connecting. Digital edge softness cannot remove the projector's residual light on black pixels. Outdoors, use after dark and keep the projector dry.

The 980W does not advertise native AirPlay reception. Epson iProjection offers an alternative network-mirroring route on supported configurations, but animation quality and this exact setup require testing; see [research](docs/RESEARCH.md).

## Shortcuts and saved layouts

The app's **Desktop shortcut** button downloads a Mac `.webloc` link. Move it to the Mac Desktop and double-click to open the hosted app. It is a web shortcut, not a locally installed server. On iPad, use Add to Home Screen instead.

Layouts are stored in the current browser. Export JSON before switching presets, clearing browser data or moving devices. Imported layouts contain configuration, not a video recording. The app makes no cloud backup of layouts.

## Run from source

This is a buildless HTML/CSS/JavaScript app. Serve `dist/` using a static web server, for example:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080` on that computer. For an iPad on the same trusted LAN, use the computer's LAN IP and port instead. Keep the server running; do not expose this development server to the internet. HTTPS hosting is recommended for the full browser feature set. Opening `index.html` directly is not the supported setup.

The existing MIT-licensed `perspective-transform` library is vendored under `dist/vendor/`; attribution and license accompany the source. See [research](docs/RESEARCH.md) for selection rationale and primary sources.

## GitHub and versions

Version: **1.1.0**. Source is backed up in the private [jprucks/hauntlight](https://github.com/jprucks/hauntlight) repository. Use semantic versioning and Conventional Commit messages; record changes in [CHANGELOG.md](CHANGELOG.md).

Clone the repository to work locally. Run `npm test` and `npm run check` before committing changes. Keep credentials and personal layout exports out of Git. The hosted app and GitHub are separate destinations; publishing a GitHub commit does not automatically redeploy the hosted app.

The `scripts/publish-github.sh` helper is only for creating a new repository from a source ZIP; it intentionally refuses to overwrite an existing repository. Do not run it against the now-existing `jprucks/hauntlight` repository.

## Verification boundary

Source-level checks do not replace an on-device trial. Before an unattended show, verify touch calibration, all chosen scenes, fullscreen transitions, aspect ratio, sleep behavior and connection stability on your iPad and projector. This release does not claim physical hardware validation.
