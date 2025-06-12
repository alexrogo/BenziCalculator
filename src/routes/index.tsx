import {
  component$,
  useStylesScoped$,
  useVisibleTask$,
} from "@builder.io/qwik";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default component$(() => {
  useStylesScoped$(`
    body { margin: 0; overflow: hidden; background: black; font-family: Arial, sans-serif; }
    canvas { display: block; position: absolute; top: 0; left: 0; z-index: 1; }
    #startButton { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      padding: 20px 40px; font-size: 2em; background: linear-gradient(135deg, #ff0077, #9900ff);
      color: white; border: none; border-radius: 15px; box-shadow: 0 0 20px rgba(255, 0, 150, 0.7);
      cursor: pointer; z-index: 10; }
    #overlay { position: absolute; top: 30px; left: 50%; transform: translateX(-50%);
      color: white; font-size: 2.5em; z-index: 10; text-shadow: 0 0 10px rgba(255,255,255,0.8); display: none; }
    #success { position: absolute; top: 70%; left: 50%; transform: translate(-50%, -50%);
      font-size: 3em; text-align: center; color: #00ff88; z-index: 10;
      text-shadow: 0 0 20px rgba(0,255,136,0.9); display: none; }
  `);

  useVisibleTask$(() => {
    const startButton = document.getElementById("startButton")!;
    const overlay = document.getElementById("overlay")!;
    const success = document.getElementById("success")!;
    const scoreSpan = document.getElementById("score")!;
    const music = document.getElementById("bgMusic")! as HTMLAudioElement;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 1000;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
    }
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 2,
      opacity: 0.7,
      transparent: true,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffaaff,
      size: 1.8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    const clock = new THREE.Clock();
    let angle = 0;
    let hue = 0;
    let morphing = false;
    let morphProgress = 0;

    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      angle += delta * 0.3;
      particles.rotation.y = angle * 0.3;
      particles.rotation.x = angle * 0.15;
      stars.rotation.y = angle * 0.02;

      hue += delta * 0.02;
      if (hue > 1) hue -= 1;
      particleMaterial.color.setHSL(hue, 1.0, 0.6);
      controls.update();

      if (morphing) {
        morphProgress = Math.min(morphProgress + delta / 4, 1);
        for (let i = 0; i < positions.length; i++) {
          positions[i] =
            positions[i] * (1 - morphProgress) +
            targetPositions[i] * morphProgress;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    function createPenisShape(): void {
      for (let i = 0; i < particleCount; i++) {
        let x, y, z;
        if (i < particleCount * 0.65) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 4 + Math.random() * 0.5;
          const height = Math.random() * 50 - 25;
          x = Math.cos(angle) * radius;
          y = height;
          z = Math.sin(angle) * radius;
        } else if (i < particleCount * 0.85) {
          const phi = Math.random() * Math.PI;
          const theta = Math.random() * 2 * Math.PI;
          const r = 5;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = 30 + r * Math.cos(phi);
          z = r * Math.sin(phi) * Math.sin(theta);
        } else {
          const left = i % 2 === 0;
          const phi = Math.random() * Math.PI;
          const theta = Math.random() * 2 * Math.PI;
          const r = 6;
          const offsetX = left ? -8 : 8;
          x = offsetX + r * Math.sin(phi) * Math.cos(theta);
          y = -30 + r * Math.cos(phi);
          z = r * Math.sin(phi) * Math.sin(theta);
        }
        targetPositions[i * 3] = x;
        targetPositions[i * 3 + 1] = y;
        targetPositions[i * 3 + 2] = z;
      }
    }

    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      overlay.style.display = "block";
      music.play().catch(() => {});

      let countdown = 10;
      overlay.textContent = `Calculating Benzi: ${countdown}`;

      const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown >= 0) {
          overlay.textContent = `Calculating Benzi: ${countdown}`;
        }
        if (countdown === 0) {
          clearInterval(countdownInterval);
          createPenisShape();
          morphing = true;
          morphProgress = 0;
          setTimeout(() => {
            overlay.style.display = "none";
            const score = Math.floor(Math.random() * 101);
            scoreSpan.textContent = `Your Benzi-Score is: ${score}`;
            success.style.display = "block";
          }, 4500);
        }
      }, 1000);
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  });

  return (
    <>
      <button id="startButton">Start Calculation</button>
      <div id="overlay">Calculating Benzi: 10</div>
      <div id="success">
        Successfully loaded.
        <br />
        Ready to Benzi 😈
        <br />
        <br />
        <span id="score"></span>
      </div>
      <audio id="bgMusic" loop>
        <source src="/audio/epic.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
});
