import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export function loadEarth(scene) {
  loader.load('./models/earth.glb', (gltf) => {
    const earth = gltf.scene;

    const box = new THREE.Box3().setFromObject(earth);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();

    earth.position.sub(center);
    earth.scale.multiplyScalar(4.5 / size);

    earth.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = child.receiveShadow = true;
        if (child.material?.emissiveMap) {
          child.material.emissiveIntensity = 5;
        }
      }
    });

    scene.add(earth);
  });
}