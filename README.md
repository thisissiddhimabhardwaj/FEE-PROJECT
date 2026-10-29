# Campus Updates — new preview

Standalone React/Vite frontend. The original Campus-Updates repository is unchanged. Nothing has been pushed.

## Run

Requires Node.js 22.12+ (tested with Node 24).

```sh
npm ci
npm run dev
```

Open the address printed by Vite. Build with `npm run build`.

## Try it

- Scroll the landing page to move around the real procedural 3D campus and into its entrance.
- Use Enter campus to browse events, clubs, the feed, campus locations, and memories.
- Sign in → Try the student demo to register for events, follow clubs, edit your profile, send local messages, and create teams.
- Try the admin or club manager demo to use their local management workspaces.
- Settings → Reset demo data restores the initial state.

## Preview status

This is a first submission preview, not a completed production platform. Authentication, role restrictions, messages, registrations, and management changes are frontend simulations stored in localStorage. There is no backend. Campus and student identities are fictional. Photography is illustrative stock imagery, not verified university photography. The 3D model is an original procedural model inspired by the supplied visual direction; it does not reproduce the reference image's photorealistic detail. Some advanced reference effects are not implemented.

Production build has passed. Desktop landing and dashboard were rendered in Chromium. Full interaction and mobile validation remains in progress.

## Assets

Fonts: Google Fonts Manrope and Instrument Serif, SIL Open Font License.
Sample photography: public assets distributed with Start Bootstrap's MIT-licensed Agency, Landing Page, Business Casual, and Clean Blog templates; see their upstream projects for source/asset attribution. Replace with your campus/event photographs before final publication. No paid assets or API keys are required.
