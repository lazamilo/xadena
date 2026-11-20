# X-Adena redesign

Front-end redesign pitch for [x-adena.si](https://x-adena.si/): bukovi latoflexi, tapicirane postelje in tapicirane stene, Črnomelj.

## Pages

- `index.html` home: hero, vizija, izdelki, scroll anatomy of the latoflex, proces, citat, tapicirane stene with colour swatches, kontakt
- `latoflexi.html` product page
- `postelje.html` product page

## Run locally

```bash
node serve.mjs
```

Then open http://localhost:4850 (or set `PORT`). Any static server works too.

## Stack

Plain HTML/CSS/JS. GSAP + ScrollTrigger and Lenis are vendored in `assets/vendor/`. Font: General Sans (Fontshare), in `assets/fonts/`.

## Images

- Client's own: `logo.png`, `latoflex.jpg`, plus stock from their current site (`sheets.jpg`, `upholstered-wall.jpg`).
- Generated with Higgsfield (Nano Banana): `hero-morning`, `latoflex-studio`, `mattress-corner`, `beech-slats`, `workshop`, `warehouse`, `headboard-sage`, `bed-sand`, `hotel-wall`, `fabrics`.

The contact form is front-end only and not connected to a backend.
