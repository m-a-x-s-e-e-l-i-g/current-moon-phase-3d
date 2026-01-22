<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import SunCalc from 'suncalc';
    import { GithubCorner } from '$lib/components/ui/github-corner';
    import { SettingsMenu } from '$lib/components/ui/settings-menu';
    import { DogeSong } from '$lib/components/ux/doge-song';
    import { ProjectStory } from '$lib/components/ux/project-story';
    import { hemisphere, doge, latitude, longitude } from '$lib/stores.js';
    import { getLocation } from '$lib/location.js';
    import { Toaster } from "$lib/components/ui/sonner";

    const { getMoonIllumination, getMoonPosition } = SunCalc;

    type Hemisphere = 'northern' | 'southern';
    type MoonPhase = { start: number; end: number; phase: string; emoji: { northern: string; southern: string } };

    type PhaseEvent = {
        label: string;
        emoji: string;
        targetPhase: number;
        date: Date;
    };

    const MS_PER_HOUR = 60 * 60 * 1000;
    const MS_PER_DAY = 24 * MS_PER_HOUR;

    const PHASE_EVENTS: Array<Omit<PhaseEvent, 'date'>> = [
        { label: 'New Moon', emoji: '🌑', targetPhase: 0.0 },
        { label: 'First Quarter', emoji: '🌓', targetPhase: 0.25 },
        { label: 'Full Moon', emoji: '🌕', targetPhase: 0.5 },
        { label: 'Last Quarter', emoji: '🌗', targetPhase: 0.75 }
    ];

    function phaseDistance(a: number, b: number) {
        const d = Math.abs(a - b);
        return Math.min(d, 1 - d);
    }

    function findNearestPhaseTime(center: Date, targetPhase: number, windowDays = 16) {
        const startMs = center.getTime() - windowDays * MS_PER_DAY;
        const endMs = center.getTime() + windowDays * MS_PER_DAY;
        const stepMs = MS_PER_HOUR; // coarse scan

        let bestTimeMs = startMs;
        let bestDist = Number.POSITIVE_INFINITY;

        for (let t = startMs; t <= endMs; t += stepMs) {
            const p = getMoonIllumination(new Date(t)).phase;
            const dist = phaseDistance(p, targetPhase);
            if (dist < bestDist) {
                bestDist = dist;
                bestTimeMs = t;
            }
        }

        // Refine around the best hit with a simple step-halving search.
        let refineStep = stepMs / 2;
        for (let i = 0; i < 14; i++) {
            const left = bestTimeMs - refineStep;
            const right = bestTimeMs + refineStep;
            const pLeft = getMoonIllumination(new Date(left)).phase;
            const pRight = getMoonIllumination(new Date(right)).phase;
            const dLeft = phaseDistance(pLeft, targetPhase);
            const dRight = phaseDistance(pRight, targetPhase);

            if (dLeft < bestDist) {
                bestDist = dLeft;
                bestTimeMs = left;
            }
            if (dRight < bestDist) {
                bestDist = dRight;
                bestTimeMs = right;
            }
            refineStep /= 2;
        }

        return new Date(bestTimeMs);
    }

    function computePhaseEvents(center: Date): PhaseEvent[] {
        const events = PHASE_EVENTS.map((def) => ({
            ...def,
            date: findNearestPhaseTime(center, def.targetPhase)
        }));
        events.sort((a, b) => a.date.getTime() - b.date.getTime());
        return events;
    }

    function formatDateTime(d: Date) {
        return new Intl.DateTimeFormat(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(d);
    }

    function toDateTimeLocalValue(d: Date) {
        const pad2 = (n: number) => String(n).padStart(2, '0');
        const year = d.getFullYear();
        const month = pad2(d.getMonth() + 1);
        const day = pad2(d.getDate());
        const hour = pad2(d.getHours());
        const minute = pad2(d.getMinutes());
        return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    function fromDateTimeLocalValue(value: string): Date | null {
        // datetime-local has no timezone; interpret as local time.
        if (!value) return null;
        const [datePart, timePart] = value.split('T');
        if (!datePart || !timePart) return null;
        const [y, m, d] = datePart.split('-').map(Number);
        const [hh, mm] = timePart.split(':').map(Number);
        if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
        return new Date(y, m - 1, d, hh, mm, 0, 0);
    }

    function onDateTimeLocalChange(event: Event) {
        const input = event.currentTarget as HTMLInputElement | null;
        const next = fromDateTimeLocalValue(input?.value ?? '');
        if (!next) return;
        useLiveNow = false;
        anchorTimeMs = next.getTime();
        timeOffsetHours = 0;
    }

    // Time selector state
    let selectedDate: Date = new Date();
    let phaseEvents: PhaseEvent[] = [];
    let useLiveNow = true;
    let anchorTimeMs = Date.now();
    let timeOffsetHours = 0; // relative to anchorTimeMs (when not live)
    let nowMs = Date.now();

    // selectedDate must be driven by a reactive value; Date.now() alone won't re-run.
    $: selectedDate = new Date((useLiveNow ? nowMs : anchorTimeMs) + timeOffsetHours * MS_PER_HOUR);
    $: phaseEvents = computePhaseEvents(selectedDate);

    // Fixed orientation + lens (baked settings)
    const DEFAULT_ROT_X_DEG = -72.4;
    const DEFAULT_ROT_Y_DEG = 154;
    const DEFAULT_ROT_Z_DEG = -71.3;

    // Baked material settings (MeshStandardMaterial)
    const DEFAULT_DISPLACEMENT_SCALE = 0.03;
    const DEFAULT_DISPLACEMENT_BIAS = 0;
    const MOON_BUMP_SCALE = 3;
    const MOON_BLACK_POINT = 0.06;
    const MOON_WHITE_POINT = 1.0;
    const MOON_SATURATION = 1.0;
    const MOON_VIBRANCE = -0.44;

    // Camera tuning
    const CAMERA_FOV_DEG = 0.5;
    const CAMERA_DISTANCE = 695;

    // Baked light settings
    const LIGHT_INTENSITY = 3.2;

    // Doge mode (baked)
    const DOGE_SPIN_SPEED = 0.005;
    const DOGE_HEMI_INTENSITY = 0.23;
    const DOGE_PARTY_LIGHT_INTENSITY = 50;
    const DOGE_PARTY_LIGHT_DISTANCE = 30;

    // Doge particles (baked)
    const DOGE_PARTICLE_COUNT = 1000;
    const DOGE_PARTICLE_MAX_DISTANCE = 1000;
    const DOGE_PARTICLE_SPAWN_RANGE = 1000;
    const DOGE_PARTICLE_SPEED = 1.0;
    const DOGE_PARTICLE_ROTATION_SPEED = 0.02;
    const DOGE_PARTICLE_SCALE = 1.0;

    const degToRad = (deg: number) => (deg * Math.PI) / 180;


    const moonPhases: MoonPhase[] = [
        { start: 0.0, end: 0.02, phase: "New Moon", emoji: { northern: "🌑", southern: "🌑" } },
        { start: 0.02, end: 0.25, phase: "Waxing Crescent", emoji: { northern: "🌒", southern: "🌘" } },
        { start: 0.25, end: 0.27, phase: "First Quarter", emoji: { northern: "🌓", southern: "🌗" } },
        { start: 0.27, end: 0.5, phase: "Waxing Gibbous", emoji: { northern: "🌔", southern: "🌖" } },
        { start: 0.5, end: 0.52, phase: "Full Moon", emoji: { northern: "🌕", southern: "🌕" } },
        { start: 0.52, end: 0.75, phase: "Waning Gibbous", emoji: { northern: "🌖", southern: "🌔" } },
        { start: 0.75, end: 0.77, phase: "Last Quarter", emoji: { northern: "🌗", southern: "🌓" } },
        { start: 0.77, end: 1.0, phase: "Waning Crescent", emoji: { northern: "🌘", southern: "🌒" } }
    ];

    let hemiKey: Hemisphere = 'northern';
    $: hemiKey = $hemisphere === 'southern' ? 'southern' : 'northern';

    let moonPhase: MoonPhase = moonPhases[0],
        moonAgePercent: number, // Percentage of the moon's current age
        moonDistance: string, // Distance to the moon in kilometers
        moonPhasePercent: string, // How much of the moon is illuminated
        moonIlluminationAngle: number, // angle: midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk; the moon is waxing if the angle is negative, and waning if positive
        earthshineIntensity: number, // faint earth-lit glow on the dark side
        lightX: number, // X coordinate of the direct light source
        lightY: number, // Y coordinate of the direct light source
        lightZ: number, // Z coordinate of the direct light source
        hemisphereFactor: number, // 1 for northern hemisphere, -1 for southern hemisphere
        waxingFactor: number; // -1 for waxing, 1 for waning

    function updateMoonProperties() {
        const illumination = getMoonIllumination(selectedDate);
        const moonPos = getMoonPosition(selectedDate, $latitude, $longitude);

        moonAgePercent = Number(illumination.phase.toFixed(2));
        moonPhase = moonPhases.find(phase => moonAgePercent >= phase.start && moonAgePercent < phase.end) ?? moonPhases[0];
        moonPhasePercent = (illumination.fraction * 100).toFixed(2) + "%";
        moonIlluminationAngle = illumination.angle;
        moonDistance = Math.round(moonPos.distance).toLocaleString() + " kilometers";

        hemisphereFactor = $hemisphere === "northern" ? 1 : -1;
        waxingFactor = moonIlluminationAngle < 0 ? -1 : 1;

        // Accurate lighting: compute a sun-direction in camera/view space that matches
        // (1) the illuminated fraction and (2) the bright-limb orientation.
        //
        // For a unit sphere observed from +Z (camera in front), the illuminated fraction is:
        //   f = (1 + cos(i)) / 2
        // where i is the phase angle between the sun direction and the observer direction.
        // So i = acos(2f - 1). Then we rotate the projected sun direction by the
        // bright-limb position angle (corrected for parallactic angle).
        const fraction = Math.min(1, Math.max(0, illumination.fraction));
        const phaseAngle = Math.acos(2 * fraction - 1);

        // Approximate Earthshine: strongest near new moon, fades quickly toward full.
        earthshineIntensity = 0.12 * Math.pow(1 - fraction, 2.3);

        // SunCalc's illumination.angle is measured eastward from the north point.
        // On the sky, east is to the *left* when north is up, so we flip X.
        // Adjust by the parallactic angle so the limb matches the user's local "up".
        let limbAngle = illumination.angle - moonPos.parallacticAngle;

        // Southern hemisphere: the Moon appears flipped (roughly a 180° rotation).
        if ($hemisphere === "southern") limbAngle += Math.PI;

        const inPlane = Math.sin(phaseAngle);
        const sunDirX = -Math.sin(limbAngle) * inPlane;
        const sunDirY = Math.cos(limbAngle) * inPlane;
        const sunDirZ = Math.cos(phaseAngle);

        const lightDistance = 10;
        lightX = sunDirX * lightDistance;
        lightY = sunDirY * lightDistance;
        lightZ = sunDirZ * lightDistance;
    }

    // Keep properties in sync with time/location/hemisphere.
    $: {
        selectedDate;
        $latitude;
        $longitude;
        $hemisphere;
        updateMoonProperties();
    }

    onMount(() => {
        getLocation();

        const HemisphereLightIntensity = 0.03;

        // Create a scene
        var scene = new THREE.Scene();
        
        // Create a camera
        var camera = new THREE.PerspectiveCamera(
            CAMERA_FOV_DEG,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        // Start farther back; use lens zoom (FOV) for a telephoto look.
        camera.position.z = CAMERA_DISTANCE;
        
        // Create a renderer and add it to the DOM
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("moon")?.appendChild(renderer.domElement);

        var geometry = new THREE.SphereGeometry(2, 60, 60);
        
        var moonDisplacementImageHighRes = "./img/ldem_16_uint.webp";
        var moonTextureImage = "./img/lroc_color_16bit_srgb_8k.webp";
        var moonTextureDogeImage = "./img/lroc_doge_wow_1k.webp";

        // Load the moon texture and displacement map
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load(moonTextureImage);
        var textureDoge = textureLoader.load(moonTextureDogeImage);
        var displacementMap = textureLoader.load(moonDisplacementImageHighRes);

        texture.colorSpace = THREE.SRGBColorSpace;
        textureDoge.colorSpace = THREE.SRGBColorSpace;
        displacementMap.colorSpace = THREE.NoColorSpace;

        const maxAniso = renderer.capabilities.getMaxAnisotropy?.() ?? 1;
        texture.anisotropy = maxAniso;
        textureDoge.anisotropy = maxAniso;

        // Create a material (NASA-like: matte, high roughness, low specular)
        var material = new THREE.MeshStandardMaterial({
            map: texture,
            displacementMap: displacementMap,
            displacementScale: DEFAULT_DISPLACEMENT_SCALE,
            displacementBias: DEFAULT_DISPLACEMENT_BIAS,
            bumpMap: displacementMap,
            bumpScale: MOON_BUMP_SCALE,
            roughness: 1.0,
            metalness: 0.0,
        });

        // Black/white levels control via shader hook.
        material.onBeforeCompile = (shader) => {
            shader.uniforms.uMoonBlackPoint = { value: MOON_BLACK_POINT };
            shader.uniforms.uMoonWhitePoint = { value: MOON_WHITE_POINT };
            shader.uniforms.uMoonSaturation = { value: MOON_SATURATION };
            shader.uniforms.uMoonVibrance = { value: MOON_VIBRANCE };

            shader.fragmentShader = shader.fragmentShader.replace(
                'void main() {',
                'uniform float uMoonBlackPoint;\nuniform float uMoonWhitePoint;\nuniform float uMoonSaturation;\nuniform float uMoonVibrance;\nvoid main() {'
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <map_fragment>',
                [
                    '#include <map_fragment>',
                    'float denom = max(0.0001, (uMoonWhitePoint - uMoonBlackPoint));',
                    'diffuseColor.rgb = clamp((diffuseColor.rgb - uMoonBlackPoint) / denom, 0.0, 1.0);',
                    '',
                    '// Saturation + vibrance (approx)',
                    'vec3 c = diffuseColor.rgb;',
                    'float maxc = max(c.r, max(c.g, c.b));',
                    'float minc = min(c.r, min(c.g, c.b));',
                    'float satAmount = maxc - minc;',
                    'float vibFactor = clamp(1.0 + uMoonVibrance * (1.0 - satAmount), 0.0, 3.0);',
                    'float satFinal = clamp(uMoonSaturation * vibFactor, 0.0, 3.0);',
                    'float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));',
                    'diffuseColor.rgb = mix(vec3(luma), c, satFinal);'
                ].join('\n')
            );
            (material as unknown as { userData: Record<string, unknown> }).userData.shader = shader;
        };

        // Create a moon mesh
        var moon = new THREE.Mesh(geometry, material);
        scene.add(moon);

        // In normal mode, keep the Moon tidally locked (same face toward the camera/Earth).
        // This value is a texture-to-geometry alignment offset for the LROC texture.
        const MOON_BASE_ROTATION_Y = Math.PI / 2;

        // Create a point light
        const light = new THREE.DirectionalLight(0xffffff, LIGHT_INTENSITY);
        light.position.set(lightX, lightY, lightZ);
        scene.add(light.target);
        scene.add(light);

        // Party lighting (doge mode only)
        const partyLights: THREE.PointLight[] = [];
        const partyLightPositions = [
            new THREE.Vector3(6, 2, 6),
            new THREE.Vector3(-6, -2, 6),
            new THREE.Vector3(0, 6, -4),
        ];

        for (let i = 0; i < partyLightPositions.length; i++) {
            const partyLight = new THREE.PointLight(0xff00ff, DOGE_PARTY_LIGHT_INTENSITY, DOGE_PARTY_LIGHT_DISTANCE);
            partyLight.position.copy(partyLightPositions[i]);
            partyLight.visible = false;
            scene.add(partyLight);
            partyLights.push(partyLight);
        }

        // Create a hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, HemisphereLightIntensity);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 0, 0);
        scene.add(hemiLight);

        // Doge mode
        const dogeGeometry = new THREE.CylinderGeometry(5, 5, 1, 60);
        const dogeTexture = new THREE.TextureLoader().load('./img/dogecoin.png');
        const dogeMaterial = new THREE.MeshPhongMaterial({ map: dogeTexture, shininess: 100, reflectivity: 0.8, specular: 0xDBBC57});
        
        type DogeParticleState = {
            mesh: THREE.InstancedMesh;
            random: Array<{ direction: THREE.Vector3; rotation: number }>;
            maxDistanceSquared: number;
            config: {
                count: number;
                maxDistance: number;
                spawnRange: number;
                speed: number;
                rotationSpeed: number;
                scale: number;
            };
        };

        function createDogeParticlesState(): DogeParticleState {
            const count = DOGE_PARTICLE_COUNT;
            const spawnRange = DOGE_PARTICLE_SPAWN_RANGE;
            const maxDistance = DOGE_PARTICLE_MAX_DISTANCE;
            const speed = DOGE_PARTICLE_SPEED;
            const rotationSpeed = DOGE_PARTICLE_ROTATION_SPEED;
            const scale = DOGE_PARTICLE_SCALE;

            const maxDistanceSquared = maxDistance * maxDistance;
            const mesh = new THREE.InstancedMesh(dogeGeometry, dogeMaterial, count);
            const random: Array<{ direction: THREE.Vector3; rotation: number }> = [];
            const tmpMatrix = new THREE.Matrix4();
            const tmpQuat = new THREE.Quaternion();
            const tmpScale = new THREE.Vector3(scale, scale, scale);

            for (let i = 0; i < count; i++) {
                const half = spawnRange / 2;
                const position = new THREE.Vector3(
                    Math.random() * spawnRange - half,
                    Math.random() * spawnRange - half,
                    Math.random() * spawnRange - half
                );
                tmpMatrix.compose(position, tmpQuat, tmpScale);
                mesh.setMatrixAt(i, tmpMatrix);

                const direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
                // Avoid near-zero directions.
                if (direction.lengthSq() < 1e-6) direction.set(1, 0, 0);
                direction.normalize();

                const rot = (Math.random() * 2 - 1) * rotationSpeed;
                random.push({ direction, rotation: rot });
            }

            mesh.instanceMatrix.needsUpdate = true;
            mesh.visible = false;
            scene.add(mesh);

            return {
                mesh,
                random,
                maxDistanceSquared,
                config: { count, maxDistance, spawnRange, speed, rotationSpeed, scale }
            };
        }

        let dogeParticlesState: DogeParticleState = createDogeParticlesState();

        function animate() {
            requestAnimationFrame(animate);

            light.intensity = LIGHT_INTENSITY;
            light.position.set(lightX, lightY, lightZ);
            // Keep the dark side barely visible like real photos (earthshine).
            material.emissiveIntensity = $doge ? 0 : earthshineIntensity;

            if ($doge) {
                // Doge mode can spin around for fun.
                moon.rotation.y += DOGE_SPIN_SPEED;
            } else {
                // Normal mode: show the correct Earth-facing side (no random rotation).
                moon.rotation.set(
                    degToRad(DEFAULT_ROT_X_DEG),
                    MOON_BASE_ROTATION_Y + degToRad(DEFAULT_ROT_Y_DEG),
                    degToRad(DEFAULT_ROT_Z_DEG)
                );
            }
            material.map = $doge ? textureDoge : texture;

            // Animate party lights in doge mode
            if ($doge) {
                const t = performance.now() * 0.001;
                for (let i = 0; i < partyLights.length; i++) {
                    const partyLight = partyLights[i];
                    partyLight.visible = true;
                    partyLight.intensity = DOGE_PARTY_LIGHT_INTENSITY;
                    partyLight.distance = DOGE_PARTY_LIGHT_DISTANCE;

                    const hue = (t * 0.25 + i / partyLights.length) % 1;
                    partyLight.color.setHSL(hue, 1, 0.6);

                    // Subtle orbit so it feels like a party/strobe setup
                    const base = partyLightPositions[i];
                    partyLight.position.set(
                        base.x + Math.sin(t * 1.2 + i) * 1.2,
                        base.y + Math.cos(t * 1.1 + i) * 1.2,
                        base.z + Math.sin(t * 0.9 + i) * 1.2
                    );
                }
            } else {
                for (let i = 0; i < partyLights.length; i++) {
                    partyLights[i].visible = false;
                }
            }

            // Animate doge particles
            if ($doge) {
                hemiLight.intensity = DOGE_HEMI_INTENSITY;

                dogeParticlesState.mesh.visible = true;
                for (let i = 0; i < dogeParticlesState.config.count; i++) {
                    const matrix = new THREE.Matrix4();
                    dogeParticlesState.mesh.getMatrixAt(i, matrix);
                    const position = new THREE.Vector3().setFromMatrixPosition(matrix);
                    position.addScaledVector(dogeParticlesState.random[i].direction, dogeParticlesState.config.speed);

                    // Check if the particle is too far from the origin
                    let distanceSquared = position.lengthSq();
                    if (distanceSquared > dogeParticlesState.maxDistanceSquared) {
                        // Reverse the particle's direction
                        dogeParticlesState.random[i].direction.negate();
                    }

                    // Apply rotation
                    const rotation = new THREE.Euler().setFromRotationMatrix(matrix);
                    rotation.x += dogeParticlesState.random[i].rotation;
                    rotation.z += dogeParticlesState.random[i].rotation;
                    rotation.y += dogeParticlesState.random[i].rotation;
                    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
                    dogeParticlesState.mesh.setMatrixAt(
                        i,
                        matrix.compose(position, quaternion, new THREE.Vector3(dogeParticlesState.config.scale, dogeParticlesState.config.scale, dogeParticlesState.config.scale))
                    );
                }
                dogeParticlesState.mesh.instanceMatrix.needsUpdate = true;
            } else {
                hemiLight.intensity = 0.008;
                dogeParticlesState.mesh.visible = false;
            }

            renderer.render(scene, camera);
        }
        animate();

        // Keep moon in the middle of the window
        function onResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener("resize", onResize, false);

        // Drive Live mode updates.
        const liveTimer = window.setInterval(() => {
            if (useLiveNow) nowMs = Date.now();
        }, 1000);

        return () => {
            window.removeEventListener("resize", onResize, false);
            window.clearInterval(liveTimer);
        };
    });
</script>

<svelte:head>
    <title>{moonPhase.emoji[hemiKey]} Current Moon Phase</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
</svelte:head>

<style>
    h1 {
        font-size: 25px;
        text-shadow: 0 0 10px #000, -0 -0 10px #000, 0 -0 10px #000, -0 0 10px #000;
    }
    h1, p {
        font-family: "Space Grotesk", sans-serif;
        text-align: center;
        font-optical-sizing: auto;
        font-style: normal;
        color: #fff;
    }

    #moon {
        position: fixed;
        inset: 0;
        z-index: -1;
    }

    .hero {
        position: relative;
        min-height: 100vh;
        padding-top: 1.25rem;
        padding-bottom: 1.25rem;
    }

    #info {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 2rem;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        align-content: center;
    }

    #info p {
        display: inline-flex;
    }

    .time {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.4rem;
    }

    .time-top {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
        align-items: center;
        justify-content: space-between;
    }

    .time-meta {
        opacity: 0.9;
        font-size: 0.95rem;
        display: flex;
        gap: 0.6rem;
        align-items: center;
        flex-wrap: wrap;
    }

    .datetime {
        background: rgba(0, 0, 0, 0.25);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 0.4rem;
        padding: 0.25rem 0.5rem;
        font-family: "Space Grotesk", sans-serif;
    }

    .slider {
        width: 100%;
    }

    .timeline {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1.25rem;
        opacity: 0.95;
    }

    .event {
        font-family: "Space Grotesk", sans-serif;
        color: #fff;
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .event.past {
        opacity: 0.65;
    }

</style>

<section class="hero">
    <h1>{moonPhase.emoji[hemiKey]} Current Moon Phase</h1>

    <div id="info">
        <p>{moonPhase.phase + moonPhase.emoji[hemiKey]}</p>
        <p>Phase: {moonPhasePercent}</p>
        <p>Distance: {moonDistance}</p>

        <div class="time">
            <div class="time-top">
                <div class="time-meta">
                    <span>Time:</span>
                    <input
                        class="datetime"
                        type="datetime-local"
                        step="60"
                        value={toDateTimeLocalValue(selectedDate)}
                        on:change={onDateTimeLocalChange}
                    />
                    {#if useLiveNow}
                        <span>(Live)</span>
                    {/if}
                </div>
                <div>
                    <label style="color:#fff;font-family:Space Grotesk, sans-serif; margin-right: 0.75rem;">
                        <input
                            type="checkbox"
                            bind:checked={useLiveNow}
                            on:change={() => {
                                if (useLiveNow) {
                                    nowMs = Date.now();
                                    timeOffsetHours = 0;
                                } else {
                                    anchorTimeMs = Date.now();
                                    timeOffsetHours = 0;
                                }
                            }}
                        />
                        Live
                    </label>
                    <button
                        style="color:#fff;border:1px solid rgba(255,255,255,0.25);padding:0.25rem 0.6rem;border-radius:0.4rem;"
                        on:click={() => {
                            useLiveNow = true;
                            nowMs = Date.now();
                            timeOffsetHours = 0;
                        }}
                    >Now</button>
                </div>
            </div>

            <input
                class="slider"
                type="range"
                min="-720"
                max="720"
                step="1"
                bind:value={timeOffsetHours}
                on:input={() => {
                    if (useLiveNow) {
                        useLiveNow = false;
                        anchorTimeMs = Date.now();
                    }
                }}
            />

            <div class="timeline">
                {#each phaseEvents as ev (ev.label)}
                    <span class={`event ${ev.date.getTime() < selectedDate.getTime() ? 'past' : ''}`}>
                        {ev.emoji} {ev.label}: {formatDateTime(ev.date)}
                    </span>
                {/each}
            </div>

        </div>
    </div>

</section>

<div id="moon"></div>

<ProjectStory/>

<GithubCorner/>
<SettingsMenu/>
<DogeSong/>
<Toaster expand={true}/>