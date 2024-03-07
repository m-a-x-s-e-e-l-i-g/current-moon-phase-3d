<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import SunCalc from 'suncalc';
    import { GithubCorner } from '$lib/components/ui/github-corner';
    import { SettingsMenu } from '$lib/components/ui/settings-menu';
    import { DogeSong } from '$lib/components/ux/doge-song';
    import { hemisphere, doge, latitude, longitude } from '$lib/stores.js';
    import { getLocation } from '$lib/location.js';

    const { getMoonIllumination, getMoonPosition } = SunCalc;

    const date = new Date();

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
        moonDistance = Math.round(getMoonPosition(date, $latitude, $longitude).distance).toLocaleString() + " kilometers";
        
        hemisphereFactor = $hemisphere === "northern" ? 1 : -1;
        waxingFactor = moonIlluminationAngle < 0 ? -1 : 1;
        lightX = hemisphereFactor * Math.sin(2 * Math.PI * moonAgePercent);
        lightY = hemisphereFactor * waxingFactor * Math.cos(2 * Math.PI * moonAgePercent);
        lightZ = -Math.cos(2 * Math.PI * moonAgePercent);
    }

    // Call the function initially to set the properties
    updateMoonProperties();
    setInterval(() => updateMoonProperties(), 600);

    onMount(() => {
        
        getLocation();

        const HemisphereLightIntensity = 0.03;
        const DogeHemisphereLightIntensity = 0.23;

        // Create a scene
        var scene = new THREE.Scene();
        
        // Create a camera
        var camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000,
        );
        camera.position.z = 5;
        
        // Create a renderer and add it to the DOM
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("moon")?.appendChild(renderer.domElement);

        // Create a sphere
        var geometry = new THREE.SphereGeometry(2, 60, 60);

        var moonDisplacementImageLowRes = "./img/ldem_4_uint.jpg";
        var moonDisplacementImageHighRes = "./img/ldem_hw5x3.jpg";
        var moonTextureImage = "./img/lroc_color_poles_1k.jpg";
        var moonTextureDogeImage = "./img/lroc_doge_wow_1k.jpg";
        // Load the moon texture and displacement map
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load(moonTextureImage);
        var textureDoge = textureLoader.load(moonTextureDogeImage);
        var displacementMap = textureLoader.load(moonDisplacementImageHighRes);

        // Create a material
        var material = new THREE.MeshPhongMaterial({
            map: texture,
            displacementMap: displacementMap,
            displacementScale: 0.06,
            bumpMap: displacementMap,
            bumpScale: 8.04,
            reflectivity: 0,
            shininess: 0,
        });

        // Create a moon mesh
        var moon = new THREE.Mesh(geometry, material);
        scene.add(moon);

        // Create a point light
        const light = new THREE.DirectionalLight(0xffffff, 2.4);
        light.position.set(lightX, lightY, lightZ);
        scene.add(light);

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
        
        // Create an array to hold the particles and their positions
        const randomNumbers = [];
        const particleCount = 1000; // Change this to the number of particles you want
        const maxDistance = 1000;
        const maxDistanceSquared = maxDistance * maxDistance;

        // Create the particles
        const dogeParticles = new THREE.InstancedMesh(dogeGeometry, dogeMaterial, particleCount);
        for (let i = 0; i < particleCount; i++) {
            const position = new THREE.Vector3(Math.random() * 1000 - 500, Math.random() * 1000 - 500, Math.random() * 1000 - 500);
            dogeParticles.setMatrixAt(i, new THREE.Matrix4().setPosition(position));
            randomNumbers.push({
                direction: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5),
                rotation: Math.random() * 0.05 - 0.01 // Random rotation speed between -0.01 and 0.01
            });
        }
        scene.add(dogeParticles);

        function animate() {
            requestAnimationFrame(animate);
            light.position.set(lightX, lightY, lightZ);
            moon.rotation.y += 0.0002;
            moon.rotation.x += 0;
            material.map = $doge ? textureDoge : texture;

            // Animate doge particles
            if ($doge) {
                hemiLight.intensity = DogeHemisphereLightIntensity;
                dogeParticles.visible = true;
                for (let i = 0; i < particleCount; i++) {
                    const matrix = new THREE.Matrix4();
                    dogeParticles.getMatrixAt(i, matrix);
                    const position = new THREE.Vector3().setFromMatrixPosition(matrix);
                    position.add(randomNumbers[i].direction);

                    // Check if the particle is too far from the origin
                    let distanceSquared = position.lengthSq();
                    if (distanceSquared > maxDistanceSquared) {
                        // Reverse the particle's direction
                        randomNumbers[i].direction.negate();
                    }

                    // Apply rotation
                    const rotation = new THREE.Euler().setFromRotationMatrix(matrix);
                    rotation.x += randomNumbers[i].rotation;
                    rotation.z += randomNumbers[i].rotation;
                    rotation.y += randomNumbers[i].rotation;
                    const quaternion = new THREE.Quaternion().setFromEuler(rotation);
                    dogeParticles.setMatrixAt(i, matrix.compose(position, quaternion, new THREE.Vector3(1, 1, 1)));
                }
                dogeParticles.instanceMatrix.needsUpdate = true;
            } else {
                hemiLight.intensity = HemisphereLightIntensity;
                dogeParticles.visible = false;
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
    });
</script>

<svelte:head>
    <title>{moonPhase.emoji[$hemisphere]} Current Moon Phase</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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

<h1>{moonPhase.emoji[$hemisphere]} Current Moon Phase</h1>

<div id="info">
    <p>{moonPhase.phase + moonPhase.emoji[$hemisphere]}</p>
    <p>Phase: {moonPhasePercent}</p>
    <p>Distance: {moonDistance}</p>
</div>

<div id="moon"></div>

<GithubCorner/>
<SettingsMenu/>
<DogeSong/>