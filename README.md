[![Netlify Status](https://api.netlify.com/api/v1/badges/f1933f9a-8239-4061-a679-2e0ab21baaad/deploy-status)](https://app.netlify.com/sites/moon-phase/deploys)

# Current Moon Phase in 3D

Show the current moon phase in 3D — with lighting driven by real calculations.

I originally started this after coming across a beautiful 3D Moon demo on CodePen. It looked awesome,
but I wanted the illuminated fraction and bright-limb orientation to be correct, not just “close enough”.
So I combined that visual inspiration with proper Moon phase math.

<a href="https://moon-phase.netlify.app/">
<img src="https://github.com/m-a-x-s-e-e-l-i-g/current-moon-phase-3d/assets/7907436/e20a00ba-d65b-4bc7-8684-9fb6c0e1a5d4"/>
</a>

## Now with beautiful DOGE mode!
<a href="https://moon-phase.netlify.app/">
<img src="https://github.com/m-a-x-s-e-e-l-i-g/current-moon-phase-3d/assets/7907436/318a32e8-9308-49e5-bceb-63de135fda5e"/>
</a>

[TO THE MOON 🚀](https://moon-phase.netlify.app/)

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## How it works

- **Moon phase & limb orientation:** computed via [SunCalc](https://github.com/mourner/suncalc) using the Moon’s illumination and position.
- **3D render:** [Three.js](https://threejs.org/) sphere with a Moon texture + displacement map.
- **Location (optional):** if you allow geolocation, it helps orient the bright limb for your local sky. No location data is sent to a server.

## Notes on accuracy

- The Moon’s orientation/rotation is now accurate.
- The illuminated fraction and limb orientation are calculation-driven.
- The lighting still needs some fine tuning.

## Credits

- Moon texture by NASA's Scientific Visualization Studio: [CGI Moon Kit](https://svs.gsfc.nasa.gov/4720)
- Reference for checking the current lighting: [Moon Phase and Libration, 2024](https://svs.gsfc.nasa.gov/5187/)
- Inspiration for the 3D starting point: [3D Moon (CodePen)](https://codepen.io/darkfo222/pen/QWdpqyQ)

## Portfolio

More of my work: [MAXmade](https://www.maxmade.nl?utm_source=moon-phase&utm_medium=referral&utm_campaign=readme)
