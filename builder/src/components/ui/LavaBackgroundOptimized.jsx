import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { LayerMaterial, Color, Depth, Noise } from 'lamina'

// This component performs the magic
function LavaMesh({ colors, speed }) {
    const ref = useRef()
    // Use useFrame to animate on each frame
    useFrame((state, delta) => {
        // Move the "noise time" to animate
        if (ref.current) {
            // Adjust speed factor based on prop (e.g. speed=20 -> 0.2 factor)
            const speedFactor = (speed || 20) / 100;
            ref.current.layers[2].offset.x += delta * speedFactor
            ref.current.layers[2].offset.y += delta * (speedFactor * 0.5)
            ref.current.layers[2].offset.z += delta * (speedFactor * 0.5)
        }
    })

    // Destructure config colors or use defaults
    const color1 = colors?.[0] || "#ff0000";
    const color2 = colors?.[1] || "#ff5500";
    const color3 = colors?.[2] || "#550000";
    const color4 = colors?.[3] || "#ffffff";
    const color5 = colors?.[4] || "#000000";

    return (
        <mesh scale={[100, 100, 1]}> {/* Large plane to cover viewport */}
            <planeGeometry args={[1, 1, 16, 16]} /> {/* Reduced segments from 64x64 to 16x16 */}
            <LayerMaterial ref={ref}>
                {/* Color and Noise Layers Mixed */}
                <Color color={color1} alpha={1} mode="normal" />
                <Depth colorA={color2} colorB={color3} alpha={0.5} mode="normal" near={0} far={2} origin={[1, 1, 1]} />
                {/* Noise Layer creates the movement effect */}
                <Noise mapping="local" type="simplex" scale={0.3} colorA={color4} colorB={color5} mode="overlay" alpha={0.5} offset={[0, 0, 0]} />
            </LayerMaterial>
        </mesh>
    )
}

// Main component to use in background
export default function LavaBackgroundOptimized({ config }) {
    const { colors, speed } = config || {};

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <Canvas
                dpr={[1, 1]} // Hard limit pixel ratio to 1 for performance (avoids high DPI scaling)
                gl={{ antialias: false, useLegacyLights: true }} // Disable antialiasing and legacy lights for speed
                camera={{ position: [0, 0, 5], fov: 45 }}
            >
                <LavaMesh colors={colors} speed={speed} />
            </Canvas>
        </div>
    )
}
