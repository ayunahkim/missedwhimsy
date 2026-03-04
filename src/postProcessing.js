import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass'

export function postProcessing(scene,camera,renderer){
    const composer = new EffectComposer(renderer)
    composer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    composer.setSize(window.innerWidth,window.innerHeight)

    const renderPass = new RenderPass(scene,camera)
    composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass()
    bloomPass.strength = 0.4
    composer.addPass(bloomPass)

    return composer
}