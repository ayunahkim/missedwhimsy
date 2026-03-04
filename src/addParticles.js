import * as THREE from 'three'

export function addParticles(){
    const count = 1000

    const positions = new Float32Array(count*3)

    for(let i=0; i<count*3; i++){
        positions[i] = (Math.random()- 0.5) * 10;
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions,3))

    const tLoader = new THREE.TextureLoader()
    const particlesTexture = tLoader.load('./assets/10.png')

    const material = new THREE.PointsMaterial({
        color: '#FFDD80',
        size:0.1,
        map: particlesTexture,
        transparent:true,
        alphaMap:particlesTexture,
        alphaTest:0.001,
        depthWrite:false,
        blending:THREE.AdditiveBlending
    })
    return new THREE.Points(geometry,material)
}