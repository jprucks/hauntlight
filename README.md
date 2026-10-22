# Hauntlight 1.2.0

Portable projection mapping for Mac, Windows, and iPad. Pick an animated scene, fit its four corners to a wall, ceiling or object, and project it.

## Start on Mac or Windows

1. Download **Hauntlight-Desktop-v1.2.0.zip** from [Releases](https://github.com/jprucks/hauntlight/releases), then extract it. Alternatively download **Hauntlight.html** from the app's **Download desktop app** button.
2. Double-click **Hauntlight.html**. If it opens in a text editor, use **Open With** and select your browser.
3. Choose a scene, click **Align**, fit the corners, then click **Project**.

The desktop app is a single HTML file with its scripts, styles, icons, and all 24 scenes embedded. It needs **no installation, account, Python, Node, server, or internet connection** to run. Use a modern browser with JavaScript enabled. Keep the file on your Desktop or create a Mac alias / Windows shortcut to it. Close the browser tab to stop the app.

The repository and [owner's hosted app](https://hauntlight-jprucks.jprucks.chatgpt.site) currently require access. A downloaded desktop file or ZIP can be shared directly with someone else; they do not need GitHub or ChatGPT access to run it. Making the repository public is a separate owner decision.

## Connect a projector

On Mac or Windows, connect your projector by HDMI or an available screen-mirroring method. You can mirror the computer, or extend the desktop and move the Hauntlight browser window onto the projector display. Maximize the window or enter fullscreen **before** calibration; keep the same display arrangement for the show.

Hauntlight uses one browser window for editing and projection. It does not provide a separate private controller on the laptop. The canvas is 16:10: preserve aspect ratio in projector settings. If fullscreen is unavailable, maximize the browser. Keep the device powered and prevent screen sleep. A black pixel cannot eliminate the projector's residual light. Indoor projectors must remain dry.

## iPad

Use a hosted copy in Safari, then **Share → Add to Home Screen**. The iPad Files preview is not a supported runtime for the downloaded HTML. On iPad 5, the target remains Safari/iPadOS 16.4+, Auto quality, and one to three surfaces to start. Use Apple TV mirroring or a suitable Lightning-to-HDMI adapter. For the Epson PowerLite 980W, connect Apple TV to HDMI for AirPlay; the projector is not a native AirPlay receiver. See [hardware research](docs/RESEARCH.md).

## Scenes and controls

- 24 animated scenes; the **Any orientation** collection has 10 options without a preferred up/down direction, for walls, ceilings and angled surfaces.
- Up to six surfaces with four-corner mapping, oval masks, opacity, edge softness, motion speed and visibility.
- Mouse, touch, and fine/coarse corner adjustment. Select a corner handle and use arrow keys for adjustment.
- Calibration grid, pause, fullscreen alignment, projection and blackout.
- Click or tap projection to reveal controls. **Escape** returns to the editor; **B** toggles blackout in projection mode.
- Auto rendering quality lowers work on touch devices and adapts to expensive frames. Low/Balanced/High overrides remain available.

## Save and transfer your setup

**Export layout** downloads a small JSON file. **Import layout** restores it. Export before switching presets, updating, moving or renaming the HTML file, clearing browser data, or changing browsers/devices.

Automatic saving is browser-local and best effort. Local-file storage behavior varies between browsers and file paths. Exported JSON is the reliable backup. Downloading the desktop app does **not** include your current layout; export and transfer that separately. Hauntlight has no cloud layout storage, telemetry, device-control backend, or embedded account credentials.

## Developers and hosting

The source is buildless HTML/CSS/JavaScript under `dist/`. A generated portable copy is also included at the root of the source ZIP. For development, serve `dist/` on localhost; for example:

```sh
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Python is only needed for this development server or packaging, not for running the portable app. To host a copy, deploy `dist/` to a static HTTPS host. No authentication is implemented by the app itself; any access restriction comes from the hosting service. The `.openai` folder is specific to the owner's hosted deployment and is omitted from distributions.

Run checks using Node 20+ and build distributions using Python 3.9+:

```sh
npm test
npm run check
python3 scripts/package-source.py
```

Packaging creates `dist/downloads/Hauntlight.html`, a desktop ZIP, a source ZIP and `SHA256SUMS.txt`. The single-file app includes upstream license notices. Packaging uses an allowlist of source directories and excludes Git, host identity, environments, caches, downloads and personal layouts. Never place credentials in app assets.

Use semantic versions and Conventional Commits; record changes in [CHANGELOG.md](CHANGELOG.md). GitHub publication and the owner's hosted deployment are separate operations. The legacy `scripts/publish-github.sh` helper is only for bootstrapping a **new private** repository; it refuses an existing destination.

## Validation and limits

Automated geometry, layout, scene, rendering-policy and distribution checks are included. Browser smoke checks cover editor and standalone bundle operation. Previous tablet checks covered 1024×768 and 768×1024 responsive layouts. Native Mac Safari, Windows Edge, actual iPad hardware, GPU performance and projector HDMI/AirPlay behavior have not all been physically tested. Verify your own setup before a show; six surfaces and frame-rate targets are not hardware guarantees.

## License

MIT — see [LICENSE](LICENSE). The vendored `perspective-transform` library retains its [MIT notice](dist/vendor/LICENSE-perspective-transform.txt). The desktop HTML embeds both notices so they travel with a shared copy.
