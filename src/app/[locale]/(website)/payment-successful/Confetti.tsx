"use client"

import { useEffect, useRef, useState } from "react"

interface ConfettiProps {
  count?: number
  duration?: number
}

export default function Confetti({ count = 200, duration = 5000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Hide confetti after duration
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  useEffect(() => {
    if (!showConfetti) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const confettiPieces: {
      x: number
      y: number
      size: number
      color: string
      speed: number
      angle: number
      rotation: number
      rotationSpeed: number
    }[] = []

    const colors = ["#00C853", "#2196F3", "#FFD600", "#FF4081", "#651FFF"]

    // Create confetti pieces
    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.2 - 0.1,
      })
    }

    let animationFrame: number
    const startTime = Date.now()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const opacity = 1 - progress

      confettiPieces.forEach((piece) => {
        ctx.save()
        ctx.translate(piece.x, piece.y)
        ctx.rotate(piece.rotation)
        ctx.globalAlpha = opacity
        ctx.fillStyle = piece.color
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size)
        ctx.restore()

        piece.y += piece.speed
        piece.x += Math.sin(piece.angle) * 2
        piece.rotation += piece.rotationSpeed
      })

      if (elapsed < duration && showConfetti) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [count, duration, showConfetti])

  if (!showConfetti) return null

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" aria-hidden="true" />
}
