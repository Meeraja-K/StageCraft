import * as THREE from 'three';
import { LoadGLTFByPath } from './ModelHelper.js';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';

export function init3DScene() {
  // Renderer setup
  let renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#background'),
    antialias: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadows = true;
  renderer.shadowType = 1;
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = 0;
  renderer.toneMappingExposure = 1;
  renderer.useLegacyLights = false;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  let cameraList = [];
  let camera;
  let controls; // OrbitControls reference

  // Load the GLTF model
  LoadGLTFByPath(scene)
    .then(() => {
      retrieveListOfCameras(scene);
    })
    .catch((error) => {
      console.error('Error loading JSON scene:', error);
    });

  // Retrieve list of all cameras
  function retrieveListOfCameras(scene) {
    scene.traverse(function (object) {
      if (object.isCamera) {
        cameraList.push(object);
      }
    });

    camera = cameraList[0];
    updateCameraAspect(camera);

    // Set up OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;

    // Start the animation loop after the model and cameras are loaded
    animate();
  }

  // Set the camera aspect ratio to match the browser window dimensions
  function updateCameraAspect(camera) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // A method to be run each time a frame is generated
  function animate() {
    requestAnimationFrame(animate);

    // Update the camera position based on keyboard input
    updateCameraPosition();

    renderer.render(scene, camera);
  }

  // Function to handle camera vertical movement and update controls target
  function updateCameraPosition() {
    const speed = 0.5; // Move by 0.5 units

    // Define a flag to prevent multiple event listeners
    if (!updateCameraPosition.isInitialized) {
      window.addEventListener('keydown', (event) => {
        switch (event.key) {
          case 'ArrowUp':
            camera.position.y += speed; // Move camera up
            controls.target.y += speed; // Update the controls target
            break;
          case 'ArrowDown':
            camera.position.y -= speed; // Move camera down
            controls.target.y -= speed; // Update the controls target
          case 'ArrowLeft':
          camera.position.x -= speed; // Move camera left
          controls.target.x -= speed; // Update the controls target
          break;
        case 'ArrowRight':
          camera.position.x += speed; // Move camera right
          controls.target.x += speed; // Update the controls target
            break;
          default:
            break;
        }
      });
      updateCameraPosition.isInitialized = true; // Mark as initialized
    }

    controls.update(); // Update the controls every frame
  }
}
