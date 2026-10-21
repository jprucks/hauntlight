# Research and implementation decisions

Reviewed 2026-10-20. Hardware facts below come from manufacturer documentation; performance targets and architecture choices are engineering judgments, not results of a physical test.

## Target hardware and output

Apple's [iPad (5th generation) specifications](https://support.apple.com/en-us/111960) identify the A9 processor, 2048 × 1536 screen, AirPlay mirroring to Apple TV and video mirroring up to 1080p through a Lightning adapter. This is the 2017 standard iPad, not iPad Air 5 or iPad mini 5. Apple's [iPadOS 17 availability announcement](https://www.apple.com/newsroom/2023/09/ipados-17-is-now-available/) starts standard iPad support at generation 6; this application therefore targets Safari/iPadOS 16.4+ features available on the iPad 5's 16.x software line.

The [Epson 980W specifications](https://epson.com/For-Work/Projectors/Classroom/PowerLite-980W-WXGA-3LCD-Projector/p/V11H866020) list native 1280 × 800 (16:10), 3,800 lumens, two HDMI inputs, Ethernet and optional wireless LAN. Its listed network features do not establish native AirPlay support. The reliable documented connection building blocks are iPad AirPlay mirroring to an Apple TV connected by HDMI, or wired Lightning video output into HDMI. Apple describes the [Screen Mirroring workflow](https://support.apple.com/en-us/102661).

The iPad screen and projector have different aspect ratios. Expect possible letterboxing and perform calibration after selecting a stable projector aspect mode. App geometry cannot force iPadOS to fill an independently sized external display. Mirroring duplicates the editor too; switching to clean projection mode hides it on both screens.

### Epson iProjection nuance

Epson's [2022 iProjection compatibility fact sheet](https://files.support.epson.com/docid/cpd5/cpd56359.pdf) lists iOS 3.3 screen mirroring and network configuration through Ethernet or optional Wi-Fi. Older documents differ. Do not assume iProjection has no iOS mirroring, but do not promise this route's latency or frame rate for animated mapping without testing the actual software and projector configuration. The app does not integrate or control iProjection itself.

## Safari and Home Screen behavior

[WebKit's Safari 16.4 release article](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/) documents the unprefixed Fullscreen API on iPadOS and the Screen Wake Lock API. Feature detection and a usable in-page projection mode remain important when fullscreen requests are rejected or unavailable.

[WebKit issue 254545](https://bugs.webkit.org/show_bug.cgi?id=254545) records that Wake Lock did not work in Home Screen web apps; comment 65 by Jen Simmons says the fix shipped in iOS/iPadOS 18.4. That OS is unavailable on this iPad. Manual Auto-Lock → Never, external power and a physical sleep test are therefore part of the operating instructions. A Home Screen icon is not evidence of reliable background execution or offline availability.

## Existing projects reviewed

| Project | License and approach | Decision |
| --- | --- | --- |
| [jlouthan/perspective-transform](https://github.com/jlouthan/perspective-transform) | MIT; dependency-free quadrilateral homographies and inverses | Reuse the small mapping core, vendor it and retain attribution/license. |
| [jdeboi/p5.mapper](https://github.com/jdeboi/p5.mapper) | MIT; p5.js projection mapping; current 2.x release requires p5.js 2.x | Useful mapping reference; avoid adding the larger drawing stack solely for warping. |
| [osresearch/p5.projection](https://github.com/osresearch/p5.projection) | MIT; p5 WebGL and math.js; multiple surfaces and Halloween examples | Useful prior art for surface workflow; lighter core chosen for the older iPad. |

The selected library exposes homography coefficients for CSS 3D transforms. Procedural Canvas 2D scenes provide animated source textures, mapped independently to convex quadrilateral surfaces. Opacity and perimeter masks soften each surface. This reuse does not imply endorsement or that the upstream authors tested Hauntlight.

## Practical limits

- The 24 fps target, reduced scene canvas sizes and one-to-three-surface starting recommendation are conservative design choices. Six is a UI maximum, not a guaranteed smooth workload.
- Reject degenerate or crossing quadrilaterals; a four-corner homography describes a planar surface, not arbitrary 3D geometry.
- A black pixel is the projector's minimum light output, not an optical shutter. Edge feathering cannot remove that black-level glow.
- Best results outdoors require darkness and suitable surfaces. This indoor projector must remain dry.
- Browser-local saved layouts need JSON exports for backup; clearing storage can remove them.
- Hardware verification remains outstanding: touch mapping, full-screen sizing, mirroring aspect ratio, sleep behavior, animation smoothness and connection stability.

## Delivery state

The Site's own source workflow versions hosted delivery. A separate new private GitHub repository was requested, but the available GitHub connector lacks a repository-create operation and the build environment lacks an authenticated `gh` CLI. The source includes `scripts/publish-github.sh` for the owner to complete that step using their authenticated account. No GitHub repository creation or GitHub push is claimed.
