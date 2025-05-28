<template>
  <div ref="container" style="width: 600px; height: 400px; border: 1px solid #ccc;"></div>
</template>

<script setup>
import * as THREE from 'three'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {useHead} from "@vueuse/head";

const container = ref(null)

let scene, camera, renderer
let upperArm, forearm, biceps, triceps, elbowPivot
let contractTarget = 1
let contractCurrent = 1
let forearmRotationTarget = 0
let forearmRotationCurrent = 0

function createArm() {
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xcccccc })
  const muscleMatRed = new THREE.MeshStandardMaterial({ color: 0xd94e4e })
  const muscleMatBlue = new THREE.MeshStandardMaterial({ color: 0x4e76d9 })

  // Humerus (braț superior)
  upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 4, 0.5), boneMat)
  upperArm.position.set(0, 2, 0) // cotul va fi la (0,0)

  // Radius + Ulna (antebraț)
  forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 4, 0.4), boneMat)
  forearm.position.set(0, -2, 0)

  // Cot = pivot
  elbowPivot = new THREE.Object3D()
  elbowPivot.position.set(0, 0, 0)
  elbowPivot.add(forearm)
  upperArm.add(elbowPivot)

  // Biceps (față)
  biceps = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5, 20), muscleMatRed)
  biceps.rotation.z = Math.PI / 2
  biceps.position.set(0.6, 1.5, 0)

  // Triceps (spate)
  triceps = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.5, 20), muscleMatBlue)
  triceps.rotation.z = Math.PI / 2
  triceps.position.set(-0.6, 1.5, 0)

  upperArm.add(biceps)
  upperArm.add(triceps)
}

function animate() {
  requestAnimationFrame(animate)

  // Contractie biceps + extindere triceps
  contractCurrent += (contractTarget - contractCurrent) * 0.1
  biceps.scale.x = 1 + 0.5 * (1 - contractCurrent)
  biceps.scale.y = contractCurrent
  triceps.scale.x = 1 + 0.5 * (contractCurrent - 1)
  triceps.scale.y = 2 - contractCurrent

  // Flexie antebraț (cot)
  forearmRotationTarget = contractTarget === 1 ? 0 : Math.PI / 3
  forearmRotationCurrent += (forearmRotationTarget - forearmRotationCurrent) * 0.1
  elbowPivot.rotation.z = -forearmRotationCurrent

  renderer.render(scene, camera)
}

function onClick() {
  contractTarget = contractTarget === 1 ? 0.5 : 1
}

onMounted(() => {
  useHead({
    meta: [
      { name: "robots", content: "noindex, nofollow" }
    ]
  })
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf9f9f9)

  camera = new THREE.OrthographicCamera(-5, 5, 3.5, -3.5, 0.1, 100)
  camera.position.set(0, 0, 10)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(600, 400)
  container.value.appendChild(renderer.domElement)

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 10).normalize()
  scene.add(light)

  createArm()
  scene.add(upperArm)

  renderer.domElement.addEventListener('click', onClick)

  animate()
})

onBeforeUnmount(() => {
  renderer.domElement.removeEventListener('click', onClick)
  renderer.dispose()
})
</script>

<style>
/* Opțional: poți adăuga stiluri */
</style>
