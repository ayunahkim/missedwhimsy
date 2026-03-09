import './style.css'
import * as THREE from 'three'
import {addDefaultMeshes, addStandardMeshes, interactPoints} from './addDefaultMeshes'
import { addLight } from './addLight';
import Model from './model'
import gsap from 'gsap'
import { InteractionManager } from 'three.interactive';
import { addParticles } from './addParticles';
import { postProcessing } from './postProcessing';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();

// (FOV, aspect ratio, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// orbit control stuff
// const controls = new OrbitControls(camera,renderer.domElement)
// controls.enableDamping = true;
// controls.minDistance=3
// controls.maxDistance=6
// controls.minPolarAngle=Math.PI/2
// controls.maxPolarAngle=Math.PI/2

let composer;
let modelFlag = false;

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
)

const meshes = {};
const particles = {};
const flowers = [];
const lights = {};

const mixers = [];

const clock = new THREE.Clock()

let ran = false;

let pt1 = false;
let pt2 = false;
let fl1 = false;

init();

function init(){
  //setup stuff
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera.position.z = 5;
  composer = postProcessing(scene,camera,renderer)

  meshes.point1 = interactPoints();
  meshes.point1.position.z = 2;
  meshes.point1.position.y = -.1
  scene.add(meshes.point1)

  meshes.point2 = interactPoints();
  meshes.point2.position.z = 1.5;
  meshes.point2.position.x = -.5;
  meshes.point2.position.y = -.18
  scene.add(meshes.point2)
  
  //here we populate our meshes container
  particles.points = addParticles();
  scene.add(particles.points)

  lights.default = addLight();
  scene.add(lights.default);

  resize();
  animate();
  instances();
  points();
  cameraMovement();
}

function points(){
  meshes.point1.addEventListener('click',()=>{
    pt1 = true;
    console.log('clickedddd')
    msg();
  })
  interactionManager.add(meshes.point1)

  meshes.point2.addEventListener('click',()=>{
    pt2 = true;
    console.log('pt 2')
    msg();
  })
  interactionManager.add(meshes.point2)
}

function msg(){
  if(pt1){
    let element = document.getElementById('box1')
    gsap.to(element,{
      opacity:100,
    })
    window.addEventListener('click',()=>{
      if(element.style.opacity=='100'){
        gsap.to(element,{
          opacity:0,
        })
        pt1 = false
      }
    })
  } else if(pt2){
    let element = document.getElementById('box2')
    gsap.to(element,{
      opacity:100,
    })

    window.addEventListener('click',()=>{
      if(element.style.opacity==100){
        gsap.to(element,{
          opacity:0,
        })
        pt2 = false
      }
    })
  }
}

function cameraMovement(){
  window.addEventListener('click',()=>{
    // if zoomed out
    if(camera.position.z==5&&pt1==false&&pt2==false&&fl1==false){
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
    } else if(camera.position.z==2.5&&pt1==false&&pt2==false&&fl1==false){
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
  })
}

function instances(){
  const desk = new Model({
    url:'./desk.glb',
    scene: scene,
    meshes: meshes,
    name:'desk',
    scale: new THREE.Vector3(.008,.008,.008),
    position: new THREE.Vector3(.2,-0.8,1.5),
    rotation: new THREE.Vector3(0,-0.87,0)
  })
  desk.init()

  // for(let i=0;i<20;i++){
  //   let xpos = (Math.random()-0.5)*2
  //   let ypos = (Math.random()-0.8)
  //   let zpos = (Math.random()+1.2)

  //   let temp = new Model({
  //     url:'./flower2.glb',
  //     scene:scene,
  //     meshes:meshes,
  //     name:'flower'+String([i]),
  //     scale: new THREE.Vector3(1.2,1.2,1.2),
  //     position: new THREE.Vector3(xpos,ypos,zpos),
  //     animationState:true,
  //     mixers:mixers,
  //   })
  //   // temp.init()
  // }

  let flower1 = new Model({
    url:'./flower2.glb',
    scene:scene,
    meshes:meshes,
    name:'flower1',
    scale: new THREE.Vector3(2,2,2),
    position: new THREE.Vector3(.15,-.2,2.2),
    // animationState:true,
    mixers:mixers
  })
  flower1.init()

}

function resize(){
  window.addEventListener('resize',()=>{
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  })
}

function dissipate(obj){
  let temp = obj.getObjectsByProperty('name',"Object_33")
  let temp2 = obj.getObjectsByProperty('name','Object_34')
  let temp3 = obj.getObjectsByProperty('name','m3_m3_0')

  temp[0].material.transparent = true;
  temp2[0].material.transparent = true;
  temp3[0].material.transparent = true;

  gsap.to(temp[0].material,{
    opacity:0,
    duration:3,
    ease:'power1'
  })
  gsap.to(temp2[0].material,{
    opacity:0,
    duration:3,
    ease:'power1'
  })
  gsap.to(temp3[0].material,{
    opacity:0,
    duration:3,
    ease:'power1'
  })
}

function animate(){
  interactionManager.update();
  
  if(meshes.flower1 && modelFlag==false){
    modelFlag = true
    meshes.flower1.addEventListener('click',(event)=>{
      fl1=true;
      gsap.to(meshes.flower1.rotation,{
        y:meshes.flower1.rotation.y + Math.PI * 2,
        duration:3,
        ease:'power1.inOut'
      })
      let element = document.getElementById('flowerbox1')
      gsap.to(element,{
        opacity:100,
    })
    window.addEventListener('click',()=>{
      if(element.style.opacity==100){
        gsap.to(element,{
          opacity:0,
        })
        fl1=false;
        dissipate(meshes.flower1);
      }
     })
    })
    interactionManager.add(meshes.flower1)
  }

  const delta = clock.getDelta()
  for(const mixer of mixers){
    mixer.update(delta)
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
    positions[i3+1] -= floatDownSpeed*0.013
    if(positions[i3+1]<-5){
      positions[i3+1] = respawnY
    }
  }
  positionAttr.needsUpdate = true;

  // controls.update();
  composer.render();
}