import * as THREE from 'three'

export function addLight(){
    const light = new THREE.DirectionalLight(0xffffff,1)
    light.position.set(1,1,1)
    const light2 = new THREE.AmbientLight(0xffffff,0.6)

    return light,light2
}

export function spotLight(){
    //spot light that turns on to highlight desk
}