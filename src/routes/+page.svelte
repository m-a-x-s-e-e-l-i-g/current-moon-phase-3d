<script lang="ts">
    import { onMount } from "svelte";
    import { Hemisphere, Moon } from "lunarphase-js";
    import * as THREE from "three";
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const date = new Date();

    let lunarPhase: string,
        lunarPhaseEmoji: string,
        lunarAge: number,
        lunarAgePercent: number,
        lunarDistance: number,
        lunarLightPercent: string,
        lunationNumber: number,
        lightX: number,
        lightZ: number;

    function updateMoonProperties(hemisphere = "northern") {
        lunarPhase = Moon.lunarPhase();
        lunarAge = Moon.lunarAge(); // Earth days since the last new moon
        lunarAgePercent = Moon.lunarAgePercent(); // Percentage of the moon's current age
        lunarDistance = Moon.lunarDistance(); // Distance to the moon measured in units of Earth radii
        lunarLightPercent = ((1 - Math.abs(lunarAgePercent - 0.5) * 2) * 100).toFixed() + "%";
        lunationNumber = Moon.lunationNumber(); // Brown Lunation Number (BLN)
        if(hemisphere === "northern") {
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
    setInterval(updateMoonProperties, 33);

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

        var renderer = new THREE.WebGLRenderer({ antialias: true});

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.enableZoom = true;

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
</svelte:head>

<h1>{lunarPhaseEmoji} Current Moon Phase in 3D</h1>
<!-- print current moon phase -->
<p>{lunarPhase + lunarPhaseEmoji}</p>
<p>Lunar Age: {lunarAge} days</p>
<p>Lunar Age Percent: {lunarAgePercent}</p>
<p>Lunar Light Percent: {lunarLightPercent}</p>
<p>Lunar Distance: {lunarDistance}</p>
<p>Lunation Number: {lunationNumber}</p>

<div id="moon"></div>
