<script lang="ts">
    import Reveal from './reveal.svelte';
</script>

<section id="about" class="relative z-10 bg-gradient-to-b from-black via-slate-950 to-black">
    <div class="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
            <p class="text-xs font-semibold tracking-[0.25em] text-white/60">ABOUT THIS PROJECT</p>
            <h2 class="mt-3 text-balance text-3xl font-semibold text-white sm:text-4xl">
                A tiny astronomy tool, rendered like a photo
            </h2>
            <p class="mt-4 text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
                I built this after stumbling on a beautiful 3D Moon demo on CodePen — it looked amazing,
                but I wanted it to be <em>right</em>. So I paired that visual idea with real moon phase
                calculations, and turned it into a fast, no-nonsense page you can open and instantly trust.
            </p>
        </Reveal>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
            <Reveal className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-white">Why I made this</h3>
                    <span class="text-white/60">🌙</span>
                </div>
                <ul class="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
                    <li>Because a moon phase widget should feel like a photo, not a sticker.</li>
                    <li>Because I wanted the illuminated fraction and limb direction to be driven by math.</li>
                    <li>Because building a polished little tool is fun (and so is DOGE mode).</li>
                </ul>
            </Reveal>

            <Reveal className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-white">How it works</h3>
                    <span class="text-white/60">🛠️</span>
                </div>
                <ul class="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
                    <li><span class="font-medium text-white/80">Moon phase math</span> comes from SunCalc’s illumination + position APIs.</li>
                    <li><span class="font-medium text-white/80">3D rendering</span> is done with Three.js using a sphere, textures, and a displacement map.</li>
                    <li><span class="font-medium text-white/80">Lighting</span> is computed so the illuminated fraction and limb angle line up.</li>
                </ul>
            </Reveal>

            <Reveal className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-white">Sources & credits</h3>
                    <span class="text-white/60">📚</span>
                </div>
                <ul class="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
                    <li>
                        Moon texture: NASA Scientific Visualization Studio —
                        <a class="underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="https://svs.gsfc.nasa.gov/4720" target="_blank" rel="noreferrer">
                            CGI Moon Kit
                        </a>
                    </li>
                    <li>
                        Inspiration:
                        <a class="underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="https://codepen.io/darkfo222/pen/QWdpqyQ" target="_blank" rel="noreferrer">
                            3D Moon (CodePen)
                        </a>
                    </li>
                    <li>
                        Lighting reference:
                        <a class="underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="https://svs.gsfc.nasa.gov/5187/" target="_blank" rel="noreferrer">
                            Moon Phase and Libration, 2024
                        </a>
                    </li>
                    <li>
                        Libraries:
                        <a class="underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="https://github.com/mourner/suncalc" target="_blank" rel="noreferrer">
                            SunCalc
                        </a>
                        and
                        <a class="underline decoration-white/20 underline-offset-4 hover:decoration-white/50" href="https://threejs.org/" target="_blank" rel="noreferrer">
                            Three.js
                        </a>
                    </li>
                </ul>
            </Reveal>
        </div>

        <Reveal className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
            <div class="grid gap-6 md:grid-cols-3">
                <div>
                    <h3 class="text-sm font-semibold tracking-wide text-white">Privacy</h3>
                    <p class="mt-2 text-sm leading-relaxed text-white/70">
                        If you allow geolocation, it’s used only to orient the limb correctly for your sky.
                        The app doesn’t send your coordinates anywhere.
                    </p>
                </div>
                <div>
                    <h3 class="text-sm font-semibold tracking-wide text-white">What’s accurate?</h3>
                    <p class="mt-2 text-sm leading-relaxed text-white/70">
                        The Moon’s orientation/rotation is now accurate.
                        The illuminated fraction and limb orientation are computed from SunCalc.
                        The lighting still needs some fine tuning.
                    </p>
                </div>
                <div>
                    <h3 class="text-sm font-semibold tracking-wide text-white">Built with</h3>
                    <p class="mt-2 text-sm leading-relaxed text-white/70">
                        SvelteKit + Tailwind for UI, Three.js for rendering, and a few small UI utilities.
                    </p>
                </div>
            </div>
        </Reveal>

        <Reveal className="mt-14">
            <div class="mx-auto max-w-6xl">
                <div class="mx-auto flex max-w-3xl items-center justify-center">
                    <a
                        class="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-white/80 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                        href="https://www.maxmade.nl?utm_source=moon-phase&utm_medium=referral&utm_campaign=portfolio_footer"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img src="/img/logo-MAXmade-FFF.svg" alt="MAXmade" class="h-4 w-auto opacity-90 transition group-hover:opacity-100" />
                        <span class="text-sm">More projects on my portfolio</span>
                        <span class="text-white/50" aria-hidden="true">→</span>
                    </a>
                </div>
            </div>
        </Reveal>
    </div>
</section>
