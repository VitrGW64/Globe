import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createSun(scene, directionalLight) {
  let sun = null;

  const sunDistance = 25;
  let sunAngle = 0;

  const sunGroup = new THREE.Group();
  scene.add(sunGroup);
  
  const fallback = new THREE.Mesh(
    new THREE.SphereGeometry(9, 64, 48),
    new THREE.MeshBasicMaterial({
      color: 0xff4500,     
      toneMapped: false
    })
  );
  sunGroup.add(fallback);

  const loader = new GLTFLoader();
  loader.load('./models/sun.glb', (gltf) => {
    sun = gltf.scene;
  
    const box = new THREE.Box3().setFromObject(sun);
    const center = box.getCenter(new THREE.Vector3());
    sun.position.sub(center);
    
    const size = box.getSize(new THREE.Vector3()).length();
    sun.scale.setScalar(14 / (size || 1));
    
    sun.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        
        mat.emissive = new THREE.Color(0xff4500);     
        mat.emissiveIntensity = 18;                   
        mat.emissiveMap = mat.map || mat.emissiveMap; 

        mat.toneMapped = false;       
        mat.needsUpdate = true;
        
        if ('roughness' in mat) mat.roughness = 0.7;
        if ('metalness' in mat) mat.metalness = 0.0;
      }
    });
    
    sunGroup.remove(fallback);
    sunGroup.add(sun);
    console.log('Orange-red Sun loaded successfully! ☀️');
  }, undefined, (err) => {
    console.error('Sun GLB failed to load — using fallback sphere:', err);
    
  });
  
  sunGroup.update = () => {
    const x = sunDistance * Math.cos(sunAngle);
    const z = sunDistance * Math.sin(sunAngle);
    sunGroup.position.set(x, 0, z);
    if (directionalLight) {
      directionalLight.position.set(x, 0, z);
    }
  };
      
    let sunRotation = 0;
    sunGroup.rotateSun = (delta) => {
      if (!sun) return; 
      if (!sun.children.length) return; 
      sun.rotation.y = sunRotation;
      sunRotation += delta * 0.05; 
    };

  sunGroup.setAngle = (angle) => {
    sunAngle = angle;
    sunGroup.update();
  };

  sunGroup.getAngle = () => sunAngle;

  sunGroup.update(); 
  return sunGroup;
}