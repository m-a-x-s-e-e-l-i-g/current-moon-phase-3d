<script lang="ts">
    import { onMount } from "svelte";
    import { Hemisphere, Moon } from "lunarphase-js";
    import * as THREE from "three";

    const date = new Date();

    let lunarPhase: string,
        lunarPhaseEmoji: string,
        lunarAge: number, // Earth days since the last new moon
        lunarAgePercent: number, // Percentage of the moon's current age
        lunarDistance: number, // Distance to the moon measured in units of Earth radii
        lunarDistanceKilometers: string, // Distance to the moon measured in kilometers
        lunarLightPercent: string, // How much of the moon is illuminated
        lunationNumber: number, // Brown Lunation Number (BLN)
        lightX: number, // X coordinate of the direct light source
        lightZ: number; // Z coordinate of the direct light source

    function updateMoonProperties(hemisphere = "northern") {
        lunarPhase = Moon.lunarPhase() + " Moon";
        lunarAge = Number(Moon.lunarAge().toFixed(1));
        lunarAgePercent = Number(Moon.lunarAgePercent().toFixed(2));
        lunarDistance = Moon.lunarDistance();
        lunarDistanceKilometers = Math.round(lunarDistance * 6378.16).toLocaleString() + " kilometers";
        lunarLightPercent =
            ((1 - Math.abs(lunarAgePercent - 0.5) * 2) * 100).toFixed() + "%";
        lunationNumber = Moon.lunationNumber();
        if (hemisphere === "northern") {
            lunarPhaseEmoji = Moon.lunarPhaseEmoji();
            lightX = Math.sin(2 * Math.PI * lunarAgePercent);
        } else {
            lunarPhaseEmoji = Moon.lunarPhaseEmoji(date, {
                hemisphere: Hemisphere.SOUTHERN,
            });
            lightX = -Math.sin(2 * Math.PI * lunarAgePercent);
        }
        lightZ = -Math.cos(2 * Math.PI * lunarAgePercent);
    }

    // Call the function initially to set the properties
    updateMoonProperties();
    setInterval(updateMoonProperties, 6000);

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
        light.position.set(lightX, 0, lightZ);
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
    <title>{lunarPhaseEmoji} Current Moon Phase in 3D</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
</svelte:head>

<style>
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
    
    /* Github Corner */
    .github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}
</style>

<h1>{lunarPhaseEmoji} Current Moon Phase in 3D</h1>

<div id="info">
    <p>{lunarPhase + lunarPhaseEmoji}</p>
    <p>Lunar Age: {lunarAge} days</p>
    <p>Light Percent: {lunarLightPercent}</p>
    <p>Distance: {lunarDistanceKilometers}</p>
    <p>Lunation Number: {lunationNumber}</p>
</div>

<div id="moon"></div>

<a href="https://github.com/m-a-x-s-e-e-l-i-g/current-moon-phase-3d" class="github-corner" aria-label="View on GitHub"><svg width="50" height="50" viewBox="0 0 250 250" style="fill:#fff; color:#000; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>