import * as THREE from 'three'

export function addParticles(){
    const count = 1000

    const positions = new Float32Array(count*3)

    const baseX = new Float32Array(count)
    const baseZ = new Float32Array(count)
    const sineAmp = new Float32Array(count)
    const sineFreq = new Float32Array(count)

    for(let i=0; i<count; i++){
        const i3 = i*3

        baseX[i] = (Math.random()-0.5)*10
        baseZ[i] = (Math.random()-0.5)*10
        positions[i3] = baseX[i]
        positions[i3+1] = (Math.random()-0.5)*10
        positions[i3+2] = baseZ[i]

        sineAmp[i] = 0.2 + Math.random()*0.1
        sineFreq[i] = 0.5 + Math.random()*0.2
    }

    const geometry = new THREE.BufferGeometry()
    const positionAttr = new THREE.BufferAttribute(positions,3)
    geometry.setAttribute('position', positionAttr)

    const tLoader = new THREE.TextureLoader()
    const particlesTexture = tLoader.load('./assets/10.png')
    particlesTexture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.PointsMaterial({
        color: '#FFE9A1',
        size:0.1,
        map: particlesTexture,
        transparent:true,
        alphaMap:particlesTexture,
        alphaTest:0.001,
        depthWrite:false,
        blending:THREE.AdditiveBlending
    })
    
    const points = new THREE.Points(geometry,material)
    points.userData = {
        count,
        positions,
        baseX,
        baseZ,
        sineAmp,
        sineFreq,
        positionAttr,
    }

    return points
}