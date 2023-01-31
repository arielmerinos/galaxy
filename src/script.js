import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
//const gui = new dat.GUI()


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters = {
    count: 25000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 2.5,
    insideColor: '#78c1dd',
    outsideColor: '#006992'
}

let galaxyGeometry = null
let galaxyMaterial = null
let galaxy = null

const generateGalaxy = () =>
{
    if(galaxyGeometry !== null){
        galaxyGeometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(galaxy)
    }


    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    galaxyGeometry = new THREE.BufferGeometry()
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    
    for (let i = 0; i < parameters.count; i++) {
        // positions
        const i3 = i * 3
        const randomRadius = Math.random() * parameters.radius
        const spinAngle = randomRadius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches *  Math.PI * 2
        
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        
        positions[i3 + 0] = randomX + Math.cos(branchAngle + spinAngle) * randomRadius;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = randomZ + Math.sin(branchAngle + spinAngle) * randomRadius;
    
        //Color

        const midexedColor = colorInside.clone()
        midexedColor.lerp(colorOutside, randomRadius/parameters.radius)

        colors[i3 + 0] = midexedColor.r
        colors[i3 + 1] = midexedColor.g
        colors[i3 + 2] = midexedColor.b
    
    }
    
        galaxyGeometry.setAttribute(
            'position', 
            new THREE.BufferAttribute(positions, 3)
        )
    
        galaxyGeometry.setAttribute(
            'color', 
            new THREE.BufferAttribute(colors, 3)
        )

    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        vertexColors: true        
    })
    galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxy)
}


generateGalaxy()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setClearColor('black')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

// gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
// gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
// gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy) 
// gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy) 
// gui.add(parameters, 'spin').min(-5).max(5).step(1).onFinishChange(generateGalaxy) 
// gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy) 
// gui.add(parameters, 'randomnessPower').min(1).max(10).step(1).onFinishChange(generateGalaxy) 
// gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy) 
// gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy) 



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()