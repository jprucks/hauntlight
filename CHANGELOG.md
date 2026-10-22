# Changelog

## 1.2.0 — 2026-10-22

- Add a single-file offline desktop app and desktop ZIP for Mac and Windows; no runtime installation or account is required.
- Add desktop download controls, generic projector guidance, and Windows URL shortcuts alongside Mac webloc shortcuts.
- Explain local-file save limits and JSON backups; preserve the iPad controls and all 24 scenes.
- Add an MIT project license and embed both project and dependency license notices in the portable app.
- Correct stale repository publication notes and add quick-start instructions.
- Use allowlisted packaging, version-derived archive names, checksums, and standalone distribution validation.


## 1.1.0 — 2026-10-21

- Add ten orientation-neutral scenes and an Any orientation filter, plus wall/ceiling presets.
- Add adaptive rendering quality, cached thumbnails/textures, and idle/offscreen/blackout animation suspension.
- Improve iPad portrait/landscape layout, touch targets, viewport handling and on-stage alignment controls.
- Preserve existing saved layouts and all original scene IDs.

Versions follow Semantic Versioning. Commit messages should follow Conventional Commits.

## [1.0.0] - 2026-10-20

### Added

- Initial Halloween projection studio with 14 procedural scenes and space presets.
- Up to six convex four-corner mapping surfaces, oval masks and fine positioning.
- Independent edge feathering, opacity, motion speed and surface visibility.
- Calibration grid, alignment and projection modes, pause and blackout.
- Browser-local layout persistence and JSON import/export.
- Home Screen metadata, app icons and downloadable Mac web shortcut.
- Vendored MIT-licensed perspective-transform core with attribution.
- Setup/research documentation and a guarded private-GitHub publishing script.

### Known limitations

- No physical iPad 5 / Epson PowerLite 980W validation; performance varies by scene and surface count.
- Screen mirroring cannot provide independent private controls on the iPad.
- Older iPad Home Screen apps require manual Auto-Lock configuration for reliable unattended projection.
- Source is versioned for hosted delivery; creation of the requested private GitHub repository remains pending.
