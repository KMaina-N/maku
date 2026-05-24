'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HeroCanvasProps {
  isPlaying: boolean
}

export function HeroCanvas({ isPlaying }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({ energy: 0, mouseX: 0, mouseY: 0, isPlaying, isTabVisible: true })

  // Synchronize playback state without restarting WebGL context
  useEffect(() => {
    stateRef.current.isPlaying = isPlaying
  }, [isPlaying])

  // Performance Optimization: Pause loop when the tab is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      stateRef.current.isTabVisible = document.visibilityState === 'visible'
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── 1. WebGL Initialization ──────────────────────────────────────────
    const scene = new THREE.Scene()
    
    // Establish base client layout boundaries explicitly 
    const initialWidth = container.clientWidth || window.innerWidth
    const initialHeight = container.clientHeight || window.innerHeight

    const camera = new THREE.PerspectiveCamera(
      45,
      initialWidth / initialHeight,
      0.1,
      100
    )
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(initialWidth, initialHeight)
    container.appendChild(renderer.domElement)

    // ── 2. Atmospheric Matrix Lighting ───────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x050505)
    scene.add(ambientLight)

    const pointLightTeal = new THREE.PointLight(0x00c9b1, 10, 15)
    pointLightTeal.position.set(2.5, 2, 2)
    scene.add(pointLightTeal)

    const pointLightIndigo = new THREE.PointLight(0x6366f1, 6, 15)
    pointLightIndigo.position.set(-3, -2, 1)
    scene.add(pointLightIndigo)

    // ── 3. High-Density Vector Sculpture Mesh ────────────────────────────
    const geometry = new THREE.IcosahedronGeometry(1.3, 64)
    
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x0a1110,
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    })

    const sculpture = new THREE.Mesh(geometry, material)
    sculpture.position.set(2.0, 0.1, 0)
    scene.add(sculpture)

    // Cache structural position offsets for mathematical deformation mutations
    const positionAttribute = geometry.attributes.position
    const initialPositions = positionAttribute.clone()

    // ── 4. Floating Ambient Micro-dust Particles ───────────────────────────
    const particleCount = 100
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8 + 2
      particlePositions[i + 1] = (Math.random() - 0.5) * 6
      particlePositions[i + 2] = (Math.random() - 0.5) * 4
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x00c9b1,
      size: 0.025,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── 5. Parallax Vector Tracking ──────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      stateRef.current.mouseX = (e.clientX / window.innerWidth) - 0.5
      stateRef.current.mouseY = (e.clientY / window.innerHeight) - 0.5
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ── 6. Fluid Defensive Layout Matrix Fitting ────────────────────────
    const fitLayoutToDevice = (width: number, height: number) => {
      if (width === 0 || height === 0) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false) // Note: set updateStyle to false to prevent layout shaking
      
      // Dynamic breakpoint tracking based on actual runtime bounding rect limits
      if (width < 640) {
        // Mobile layout: Push sculpture lower and stabilize scales completely
        sculpture.position.set(0, 0.7, -1.6)
        sculpture.scale.set(0.60, 0.60, 0.60)
        camera.position.z = 5.2
      } else if (width < 1024) {
        // Tablet layout: Intermediate offset tracking
        sculpture.position.set(0, 1.0, -1.0)
        sculpture.scale.set(0.85, 0.85, 0.85)
        camera.position.z = 6.0
      } else if (width < 1440) {
        // Small Laptop/Desktop: Right-asymmetric alignment alignment
        sculpture.position.set(1.6, 0.1, 0)
        sculpture.scale.set(1.0, 1.0, 1.0)
        camera.position.z = 6.0
      } else {
        // Ultrawide Screens: Full spatial layout expression
        sculpture.position.set(2.2, 0.1, 0)
        sculpture.scale.set(1.15, 1.15, 1.15)
        camera.position.z = 6.0
      }
    }

    // High fidelity observation using Floored Content Bounds to cut off micro loops
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return
      const entry = entries[0]
      
      // Pull dimensions using target floor layouts to strip subpixel adjustments
      const width = Math.floor(entry.contentRect.width || entry.target.clientWidth)
      const height = Math.floor(entry.contentRect.height || entry.target.clientHeight)
      
      fitLayoutToDevice(width, height)
    })
    resizeObserver.observe(container)

    // ── 7. Mathematical Animation Frame Loop ─────────────────────────────
    const clock = new THREE.Clock()
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const state = stateRef.current
      if (!state.isTabVisible) return

      const time = clock.getElapsedTime()

      // Kinetic audio momentum spring curves interpolation
      const targetEnergy = state.isPlaying ? 1.0 : 0.05
      state.energy += (targetEnergy - state.energy) * 0.05

      // Constant ambient rotational matrix momentum
      sculpture.rotation.y = time * 0.12
      sculpture.rotation.x = time * 0.06

      // Mutate 3D Mesh Vertices using dampened trigonometric frequencies
      const currentPositions = geometry.attributes.position
      const currentVertex = new THREE.Vector3()
      const initialVertex = new THREE.Vector3()

      for (let i = 0; i < initialPositions.count; i++) {
        initialVertex.fromBufferAttribute(initialPositions, i)
        currentVertex.copy(initialVertex)

        // Dampen structural waves slightly (from 0.2 -> 0.12) to prevent mobile border layout overflow
        const wave1 = Math.sin(initialVertex.x * 3.0 + time * 3.5) * 0.12
        const wave2 = Math.cos(initialVertex.y * 2.5 + time * 2.8) * 0.09
        const wave3 = Math.sin(initialVertex.z * 4.0 + time * 4.2) * 0.06

        const displacement = (wave1 + wave2 + wave3) * state.energy
        currentVertex.addScaledVector(initialVertex.clone().normalize(), displacement)
        
        currentPositions.setXYZ(i, currentVertex.x, currentVertex.y, currentVertex.z)
      }
      currentPositions.needsUpdate = true

      // Synchronize dynamic parameters matching energy states
      pointLightTeal.intensity = 5 + state.energy * 10
      material.color.setHSL(0.48 + state.energy * 0.04, 0.6, 0.04 + state.energy * 0.04)

      // Idle float animation patterns over ambient dust particles
      particles.rotation.y = -time * 0.02
      particles.position.y = Math.sin(time * 0.4) * 0.08

      // Interpolate spring velocity for smooth cursor parallax shifts
      camera.position.x += (state.mouseX * 1.8 - camera.position.x) * 0.04
      camera.position.y += (-state.mouseY * 1.2 - camera.position.y) * 0.04
      camera.lookAt(new THREE.Vector3(sculpture.position.x * 0.35, 0, 0))

      renderer.render(scene, camera)
    }

    animate()

    // ── 8. Secure Thread Hardware Disposal ───────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }

      geometry.dispose()
      initialPositions.dispose()
      material.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      // Changed to `fixed` instead of `absolute` to isolate canvas painting entirely from parent scroll calculations
      className="fixed inset-0 w-full h-full screen mix-blend-screen opacity-95 pointer-events-none z-10 select-none overflow-hidden" 
    />
  )
}