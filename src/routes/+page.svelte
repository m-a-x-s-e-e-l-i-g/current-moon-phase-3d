<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import SunCalc from 'suncalc';
    import * as Sheet from "$lib/components/ui/sheet";
    import { Switch } from "$lib/components/ui/switch";
    import { Label } from "$lib/components/ui/label";
    import { GithubCorner } from '$lib/components/ui/github-corner';
    import Icon from 'svelte-awesome';
    import gear from 'svelte-awesome/icons/gear';

    const { getMoonIllumination, getMoonPosition } = SunCalc;

    const date = new Date();
    
    // currently hardcoded to Breda, Netherlands
    const latitude = 51.571915;
    const longitude = 4.768323;
    $: hemisphere = "northern";

    const moonPhases = [
        { start: 0.0, end: 0.02, phase: "New Moon", emoji: { northern: "🌑", southern: "🌑" } },
        { start: 0.02, end: 0.25, phase: "Waxing Crescent", emoji: { northern: "🌒", southern: "🌘" } },
        { start: 0.25, end: 0.27, phase: "First Quarter", emoji: { northern: "🌓", southern: "🌗" } },
        { start: 0.27, end: 0.5, phase: "Waxing Gibbous", emoji: { northern: "🌔", southern: "🌖" } },
        { start: 0.5, end: 0.52, phase: "Full Moon", emoji: { northern: "🌕", southern: "🌕" } },
        { start: 0.52, end: 0.75, phase: "Waning Gibbous", emoji: { northern: "🌖", southern: "🌔" } },
        { start: 0.75, end: 0.77, phase: "Last Quarter", emoji: { northern: "🌗", southern: "🌓" } },
        { start: 0.77, end: 1.0, phase: "Waning Crescent", emoji: { northern: "🌘", southern: "🌒" } }
    ];

    let moonPhase: { limit: number, phase: string, emoji: { northern: string, southern: string } } = { limit: 0, phase: "Unknown", emoji: { northern: "🌚", southern: "🌚" } },
        moonAgePercent: number, // Percentage of the moon's current age
        moonDistance: string, // Distance to the moon in kilometers
        moonPhasePercent: string, // How much of the moon is illuminated
        moonIlluminationAngle: number, // angle: midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk; the moon is waxing if the angle is negative, and waning if positive
        lightX: number, // X coordinate of the direct light source
        lightY: number, // Y coordinate of the direct light source
        lightZ: number, // Z coordinate of the direct light source
        hemisphereFactor: number, // 1 for northern hemisphere, -1 for southern hemisphere
        waxingFactor: number; // -1 for waxing, 1 for waning

    function updateMoonProperties() {
        moonAgePercent = Number(getMoonIllumination(date).phase.toFixed(2));
        moonPhase = moonPhases.find(phase => moonAgePercent >= phase.start && moonAgePercent < phase.end);
        moonPhasePercent = (getMoonIllumination(date).fraction*100).toFixed(2) + "%";
        moonIlluminationAngle = getMoonIllumination(date).angle;
        moonDistance = Math.round(getMoonPosition(date, latitude, longitude).distance).toLocaleString() + " kilometers";
        
        hemisphereFactor = hemisphere === "northern" ? 1 : -1;
        waxingFactor = moonIlluminationAngle < 0 ? -1 : 1;
        lightX = hemisphereFactor * Math.sin(2 * Math.PI * moonAgePercent);
        lightY = hemisphereFactor * waxingFactor * Math.cos(2 * Math.PI * moonAgePercent);
        lightZ = -Math.cos(2 * Math.PI * moonAgePercent);
    }

    // Call the function initially to set the properties
    updateMoonProperties();
    setInterval(() => updateMoonProperties(), 600);

    onMount(() => {
        var moonTextureImage = "./img/lroc_color_poles_1k.jpg";
        var moonDisplacementImageLowRes = "./img/ldem_4_uint.jpg";
        var moonDisplacementImageHighRes = "./img/ldem_hw5x3.jpg";

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );

        var renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById("moon")?.appendChild(renderer.domElement);

        var geometry = new THREE.SphereGeometry(2, 60, 60);

        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load(moonTextureImage);
        var displacementMap = textureLoader.load(moonDisplacementImageHighRes);

        var material = new THREE.MeshPhongMaterial({
            map: texture,
            displacementMap: displacementMap,
            displacementScale: 0.06,
            bumpMap: displacementMap,
            bumpScale: 8.04,
            reflectivity: 0,
            shininess: 0,
        });

        var moon = new THREE.Mesh(geometry, material);

        const light = new THREE.DirectionalLight(0xffffff, 2.4);
        light.position.set(lightX, lightY, lightZ);
        scene.add(light);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.03);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 0, 0);
        scene.add(hemiLight);

        scene.add(moon);
        camera.position.z = 5;

        moon.rotation.x = 3.1415 * 0.02;
        moon.rotation.y = 3.1415 * 1.54;

        function animate() {
            requestAnimationFrame(animate);
            light.position.set(lightX, lightY, lightZ);
            moon.rotation.y += 0.0002;
            moon.rotation.x += 0;
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
    });
</script>

<svelte:head>
    <title>{moonPhase.emoji[hemisphere]} Current Moon Phase in 3D</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
</svelte:head>

<style>
    h1 {
        font-size: 25px;
    }
    h1, p {
        font-family: "Space Grotesk", sans-serif;
        text-align: center;
        font-optical-sizing: auto;
        font-style: normal;
        color: #fff;
    }

    #moon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1
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
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        align-content: center;
    }

    #info p {
        display: inline-flex;
    }
</style>

<h1>{moonPhase.emoji[hemisphere]} Current Moon Phase in 3D</h1>

<div id="info">
    <p>{moonPhase.phase + moonPhase.emoji[hemisphere]}</p>
    <p>Phase: {moonPhasePercent}</p>
    <p>Distance: {moonDistance}</p>
</div>

<div id="moon"></div>

<GithubCorner/>

<Sheet.Root>
  <Sheet.Trigger style="position:absolute;left:10px;top:5px;">
    <Icon data={gear} label="Settings" style="fill:white"/>
  </Sheet.Trigger>
  <Sheet.Content side=left>
    <Sheet.Header>
      <Sheet.Title>Settings</Sheet.Title>
      <Sheet.Description>
        <div class="flex items-center space-x-2" style="margin-top:1em;">
            <Switch id="hemisphere" on:click={() => hemisphere = hemisphere === 'northern' ? 'southern' : 'northern'}/>
            <Label for="hemisphere"><span style="text-transform:capitalize">{hemisphere}</span> hemisphere</Label>
        </div>
      </Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>