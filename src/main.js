import './style.css'
import * as THREE from 'three'
import {addDefaultMeshes, addStandardMeshes} from './addDefaultMeshes'
import { addLight } from './addLight';
import Model from './model'
import gsap from 'gsap'
import { InteractionManager } from 'three.interactive';
import { addParticles } from './addParticles';
import { postProcessing } from './postProcessing';

const scene = new THREE.Scene();
// (FOV, aspect ratio, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

let composer;
let modelFlag = false;

let counter = 0;

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
)

const meshes = {};
const particles = {};
const lights = {};
const flowers = {};

const clock = new THREE.Clock()

init();

function init(){
  //setup stuff
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;
  composer = postProcessing(scene,camera,renderer)
  
  //here we populate our meshes container
  particles.points = addParticles();
  scene.add(particles.points)

  lights.default = addLight();
  scene.add(lights.default);

  resize();
  animate();
  instances();
  cameraMove();
}

function cameraMove(){
  window.addEventListener('click',()=>{
    if(counter%2==0){
        gsap.to(camera.position,{
          x:-.2,
          y:.4,
          z:2.5,
          duration:.8,
          ease:'power1.inOut'
        })
        gsap.to(camera.rotation,{
          x:-.6,
          duration:.8,
          ease:'power1.inOut'
        })
      } else {
        gsap.to(camera.position,{
          x:0,
          y:0,
          z:5,
          duration:.8,
          ease:'power1.inOut'
        })
        gsap.to(camera.rotation,{
          x:0,
          duration:.8,
          ease:'power1.inOut'
        })
      }
    counter++;
  })
}

function instances(){
  const desk = new Model({
    url:'./assets/desk.glb',
    scene: scene,
    meshes: meshes,
    name:'desk',
    scale: new THREE.Vector3(.008,.008,.008),
    position: new THREE.Vector3(.2,-0.8,1.5),
    rotation: new THREE.Vector3(0,-0.87,0)
    // replace:true,
    // replaceURL:'./assets/mat.png',
  })
  desk.init()

  const flower1 = new Model({
    url:'./assets/flower1.glb',
    scene: scene,
    meshes: meshes,
    name: 'flower1',
    scale: new THREE.Vector3(.1,.1,.1),
    position: new THREE.Vector3(-3,-2,0),
    animations:true,
  })
  // flower1.init()

  const flower2 = new Model({
    url:'./assets/flower2.glb',
    scene:scene,
    meshes:meshes,
    name:'flower2',
    scale: new THREE.Vector3(1.2,1.2,1.2),
    position: new THREE.Vector3(.15,-.2,2.2),
    animations:true
  })
  flower2.init()
}

function resize(){
  window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })
}

function animate(){
  interactionManager.update();

  // if(meshes.desk && modelFlag==false){
  //   modelFlag = true;
  //   meshes.desk.addEventListener('click',(event)=>{
  //     if(counter==0){
  //       gsap.to(camera.position,{
  //         x:-.2,
  //         y:.4,
  //         z:2.5,
  //         duration:.8,
  //         ease:'power1.inOut'
  //       })
  //       gsap.to(camera.rotation,{
  //         x:-.6,
  //         duration:.8,
  //         ease:'power1.inOut'
  //       })
  //     } else {
  //       gsap.to(camera.position,{
  //         x:0,
  //         y:0,
  //         z:5,
  //         duration:.8,
  //         ease:'power1.inOut'
  //       })
  //       gsap.to(camera.rotation,{
  //         x:0,
  //         duration:.8,
  //         ease:'power1.inOut'
  //       })
  //     }
  //   })
  //   interactionManager.add(meshes.desk);
  // }

  if(meshes.flower2 && modelFlag==false){
    modelFlag = true;
    meshes.flower2.addEventListener('mouseover',(event)=>{
      gsap.to(meshes.flower2.rotation,{
        y:meshes.flower2.rotation.y + Math.PI * 2,
        duration:2,
        ease:'power1.inOut',
      })
    })
    interactionManager.add(meshes.flower2)
  }

  requestAnimationFrame(animate);
  
  const t= clock.getElapsedTime()
  const {count,positions,baseX,baseZ,sineAmp,sineFreq,positionAttr} = 
    particles.points.userData

  const floatDownSpeed = 0.1
  const respawnY = 5

  for (let i=0; i<count; i++){
    const i3 = i*3
    positions[i3] = baseX[i] + sineAmp[i] * Math.sin(t*sineFreq[i])
    positions[i3+2] = baseZ[i]+sineAmp[i]* Math.cos(t*sineFreq[i])

    if(positions[i3+1]<-5){
      positions[i3+1] = respawnY
    }
  }
  positionAttr.needsUpdate = true;
  // controls.update();
  composer.render();
}