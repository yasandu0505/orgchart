"use client"

import { useState, useEffect, useRef } from "react"

// Custom icon components using SVG
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
)

const Network = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="2"></circle>
    <path d="m16.24 7.76-1.41 1.41"></path>
    <path d="m15.07 13.05-.78-.78"></path>
    <path d="m16.24 16.24-1.41-1.41"></path>
    <path d="m7.76 16.24 1.41-1.41"></path>
    <path d="m8.93 10.95.78.78"></path>
    <path d="m7.76 7.76 1.41 1.41"></path>
    <circle cx="12" cy="2" r="1"></circle>
    <circle cx="12" cy="22" r="1"></circle>
    <circle cx="22" cy="12" r="1"></circle>
    <circle cx="2" cy="12" r="1"></circle>
    <circle cx="5.64" cy="5.64" r="1"></circle>
    <circle cx="18.36" cy="18.36" r="1"></circle>
    <circle cx="5.64" cy="18.36" r="1"></circle>
    <circle cx="18.36" cy="5.64" r="1"></circle>
  </svg>
)

const Globe = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" x2="22" y1="12" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
)

const Building = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
    <path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"></path>
  </svg>
)

const MapPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const Shield = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
)

const Users = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="m22 21-3.7-3.7a2.5 2.5 0 0 0-3.6 0L12 21"></path>
    <circle cx="17" cy="11" r="3"></circle>
  </svg>
)

const Database = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5v14a9 3 0 0 0 18 0V5"></path>
    <path d="M3 12a9 3 0 0 0 18 0"></path>
  </svg>
)

export default function Home() {
  const [hoveredBox, setHoveredBox] = useState(null)
  const canvasRef = useRef(null)

  // Node connection animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const nodes = []
    const connections = []
    const nodeCount = 30

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, ${Math.floor(Math.random() * 55 + 200)}, ${Math.random() * 0.5 + 0.2})`,
      })
    }

    // Create connections between nodes
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() > 0.85) {
          connections.push([i, j])
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw connections
      connections.forEach(([i, j]) => {
        const nodeA = nodes[i]
        const nodeB = nodes[j]
        const dx = nodeB.x - nodeA.x
        const dy = nodeB.y - nodeA.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200) {
          ctx.beginPath()
          ctx.moveTo(nodeA.x, nodeA.y)
          ctx.lineTo(nodeB.x, nodeB.y)
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - distance / 200)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      // Update and draw nodes
      nodes.forEach((node) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const onExplore = () => {
    console.log("Explore clicked")
  }

  const governmentLevels = [
    {
      id: "state",
      title: "State Government",
      icon: Building,
      description: "Governors, State Legislature, Courts",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      id: "agencies",
      title: "Agencies & Depts",
      icon: Shield,
      description: "Federal agencies and departments",
      gradient: "from-orange-500/20 to-red-500/20",
    },
    {
      id: "officials",
      title: "Key Officials",
      icon: Users,
      description: "Elected representatives and appointees",
      gradient: "from-indigo-500/20 to-blue-500/20",
    },
  ]

  const BoxComponent = ({ box }) => {
    const Icon = box.icon
    const isHovered = hoveredBox === box.id

    return (
      <div
        className={`relative group cursor-pointer transition-all duration-500 transform ${
          isHovered ? "scale-105" : "scale-100"
        }`}
        onMouseEnter={() => setHoveredBox(box.id)}
        onMouseLeave={() => setHoveredBox(null)}
      >
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${box.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
        />

        {/* Main box */}
        <div
          className={`relative backdrop-blur-sm bg-gray-900/40 border rounded-xl p-6 transition-all duration-300 ${
            isHovered
              ? "border-cyan-400/50 shadow-lg shadow-cyan-400/20"
              : "border-gray-700/50 hover:border-gray-600/50"
          }`}
        >
          {/* Animated border */}
          <div
            className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-3">
              <div
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  isHovered ? "bg-cyan-400/20" : "bg-gray-800/50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${isHovered ? "text-cyan-400" : "text-gray-400"}`}
                />
              </div>
              <h3
                className={`font-semibold transition-colors duration-300 ${
                  isHovered ? "text-cyan-400" : "text-gray-200"
                }`}
              >
                {box.title}
              </h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{box.description}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex bg-gray-950 relative overflow-hidden">
      {/* Node connection animation canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-12 relative z-10">
        {/* Left side content */}
        <div className="w-full md:w-7/12 pr-0 md:pr-8 mb-12 md:mb-0">
          <div className="text-left max-w-2xl">
            {/* Main title with gradient */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
                Explore Your
              </h1>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent leading-tight">
                Government Structure
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed">
              Navigate through the complex layers of government with our intelligent mapping system. Discover
              connections, understand hierarchies, and explore the network that shapes our democracy.
            </p>

            {/* Central network icon */}
            {/* <div className="mb-12 flex justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-6 rounded-full border border-cyan-400/30">
                  <Network className="w-12 h-12 text-cyan-400" />
                </div>
              </div>
            </div> */}

            {/* CTA Button */}
            <button
              onClick={onExplore}
              className="group relative px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-400/25"
            >
              <span className="flex items-center space-x-2">
                <span>Begin Exploration</span>
                <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>

              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Right side content */}
        <div className="w-full md:w-5/12 space-y-10">
          {/* Government Levels */}
          <div className="space-y-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-300 mb-2">Government Levels</h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
            </div>
            <div className="space-y-4">
              {governmentLevels.map((box) => (
                <BoxComponent key={box.id} box={box} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-950 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"></div>
    </div>
  )
}
