import * as THREE from 'three'

export function addDefaultMeshes(){
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({color: 0xff0000,});
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

export function addStandardMeshes(){
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshStandardMaterial({
        color: '#FC03FF'
    })
    const mesh = new THREE.Mesh(geometry,material);
    return mesh;
}

export function interactPoints(){
    const geometry = new THREE.SphereGeometry(.02,16,16);
    const material = new THREE.MeshBasicMaterial({color:0x0000ff});
    const mesh = new THREE.Mesh(geometry,material);
    return mesh;
}

// export function addtextBox(){
//     const geometry = new THREE.PlaneGeometry(4,1)
// }