import { useEffect, useRef, useState, useMemo } from "react"
import * as d3 from "d3"
import "./TidyTree.css"

const TidyTree = ({
  data,
  onMinistryClick,
  loadingDepartments = new Set(),
  departmentData = {},
  expandedMinistries = new Set(),
}) => {
  const containerRef = useRef(null)
  // const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const treeRef = useRef(null)
  const rootRef = useRef(null)

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  // Stabilize the tree structure
  const treeStructure = useMemo(() => {
    if (!data) return null

    const createTreeStructure = (node) => {
      const treeNode = { ...node }

      if (node.children) {
        treeNode.children = node.children.map((child) => {
          const childNode = { ...child }
          childNode._children = child.type === "ministry" ? [] : null
          childNode.children = null
          return childNode
        })
      }

      return treeNode
    }

    return createTreeStructure(data)
  }, [data])

  // Convert Sets to arrays for stable comparison
  const expandedMinistriesArray = useMemo(() => Array.from(expandedMinistries), [expandedMinistries])
  const loadingDepartmentsArray = useMemo(() => Array.from(loadingDepartments), [loadingDepartments])

  // Function to highlight nodes and their path
  const highlightPath = (ministryId) => {
    // Remove all existing highlights
    d3.selectAll(".nodes circle, .nodes text, .links path").classed("highlight", false)

    if (!ministryId) return

    // Highlight the root
    d3.select(`[data-id='root']`).selectAll("circle, text").classed("highlight", true)

    // Highlight the clicked ministry
    d3.select(`[data-id='${ministryId}']`).selectAll("circle, text").classed("highlight", true)

    // Highlight departments of the clicked ministry
    if (departmentData[ministryId]) {
      departmentData[ministryId].forEach((dept) => {
        d3.select(`[data-id='${dept.id}']`).selectAll("circle, text").classed("highlight", true)
      })
    }

    // Highlight the connecting links
    d3.selectAll(".links path").classed(
      "highlight",
      (d) =>
        (d.source.data.type === "root" && d.target.data.id === ministryId) ||
        (d.source.data.id === ministryId && d.target.data.type === "department"),
    )
  }

  // Update function to add/remove departments for a specific ministry
  const updateDepartments = (ministryId, isExpanding) => {
    if (!rootRef.current || !treeRef.current) return

    const root = rootRef.current
    const tree = treeRef.current
    const svg = d3.select(containerRef.current).select("svg")
    const gNode = svg.select(".nodes")
    const gLink = svg.select(".links")
    const { width } = dimensions

    const duration = 500

    // Find the ministry node in the hierarchy
    let ministryNode = null
    root.eachBefore((d) => {
      if (d.data.id === ministryId) {
        ministryNode = d
      }
    })

    if (!ministryNode) return

    if (isExpanding) {
      // Add departments to the ministry node
      const departments = departmentData[ministryId] || []
      ministryNode.children = departments.map((dept) => ({
        data: dept,
        parent: ministryNode,
        depth: ministryNode.depth + 1,
        children: null,
        _children: null,
        id: dept.id,
      }))
    } else {
      // Remove departments
      ministryNode.children = null
    }

    // Recompute the tree layout
    tree(root)

    // Calculate new bounds
    let left = root,
      right = root
    root.eachBefore((node) => {
      if (node.x < left.x) left = node
      if (node.x > right.x) right = node
    })

    const marginTop = 10
    // const marginRight = 10
    const marginBottom = 10
    const marginLeft = 40
    const height = right.x - left.x + marginTop + marginBottom

    // Update SVG dimensions
    svg
      .transition()
      .duration(duration)
      .attr("height", height)
      .attr("viewBox", [-marginLeft, left.x - marginTop, width, height])

    const nodes = root.descendants()
    const links = root.links()
    const ministersExpanded = expandedMinistriesArray.length > 0

    // Update nodes
    const node = gNode.selectAll("g").data(nodes, (d) => d.data.id || "root")

    // Enter new nodes (departments)
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", () => `translate(${ministryNode.y},${ministryNode.x})`) // Start from ministry position
      .attr("data-id", (d) => d.data.id || "root")
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)

    // Add circles for new nodes
    nodeEnter
      .append("circle")
      .attr("r", (d) => (d.data.type === "department" ? 4 : 5))
      .attr("fill", (d) => {
        if (d.data.type === "root") return "#fff"
        if (d.data.type === "department") return "#4A9EFF"
        return "#F3F3FF"
      })
      .attr("stroke", "#2593B8")
      .attr("stroke-width", 1.5)
      .style("cursor", (d) => (d.data.type === "ministry" ? "pointer" : "default"))

    // Add text for new nodes
    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", 6)
      .attr("text-anchor", "start")
      .text((d) => d.data.name.split(":")[0])
      .attr("fill", "#F4F4F4")
      .style("cursor", (d) => (d.data.type === "ministry" ? "pointer" : "default"))

    // Add click handlers to ALL nodes (including existing ones)
    node
      .merge(nodeEnter)
      .selectAll("circle")
      .on("click", (event, d) => {
        if (d.data.type === "ministry") {
          event.stopPropagation()
          onMinistryClick(d.data.id)
        }
      })

    node
      .merge(nodeEnter)
      .selectAll("text:not(.loading-indicator)")
      .on("click", (event, d) => {
        if (d.data.type === "ministry") {
          event.stopPropagation()
          onMinistryClick(d.data.id)
        }
      })

    // Update all nodes positions with better layout
    node
      .merge(nodeEnter)
      .transition()
      .duration(duration)
      .attr("transform", (d) => {
        let adjustedY = d.y

        // Better positioning logic to prevent departments from going off-screen
        if (d.depth === 1) {
          // Ministry nodes
          adjustedY = ministersExpanded ? width * 0.25 : width * 0.5
        } else if (d.depth === 2) {
          // Department nodes - ensure they fit within screen
          const maxDepartmentX = width - 450 // Leave 200px margin from right edge
          adjustedY = Math.min(d.y, maxDepartmentX)
        }

        return `translate(${adjustedY},${d.x})`
      })
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)

    // Update loading indicators
    node
      .merge(nodeEnter)
      .selectAll(".loading-indicator")
      .style("opacity", (d) => {
        return loadingDepartmentsArray.includes(d.data.id) ? 1 : 0
      })

    // Remove exiting nodes
    node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", `translate(${ministryNode.y},${ministryNode.x})`) // Exit to ministry position
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .remove()

    // Update links
    const link = gLink.selectAll("path").data(links, (d) => d.target.data.id || "root")

    // Enter new links
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", () => {
        const o = { x: ministryNode.x, y: ministryNode.y }
        return d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)({ source: o, target: o })
      })

    // Update all links with better positioning
    link
      .merge(linkEnter)
      .transition()
      .duration(duration)
      .attr("d", (d) => {
        let adjustedSourceY = d.source.y
        let adjustedTargetY = d.target.y

        // Apply same positioning logic as nodes
        if (d.source.depth === 1) {
          adjustedSourceY = ministersExpanded ? width * 0.25 : width * 0.5
        }
        if (d.target.depth === 1) {
          adjustedTargetY = ministersExpanded ? width * 0.25 : width * 0.5
        }
        if (d.target.depth === 2) {
          const maxDepartmentX = width - 450
          adjustedTargetY = Math.min(d.target.y, maxDepartmentX)
        }

        return d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)({
          source: { x: d.source.x, y: adjustedSourceY },
          target: { x: d.target.x, y: adjustedTargetY },
        })
      })

    // Remove exiting links
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", () => {
        const o = { x: ministryNode.x, y: ministryNode.y }
        return d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)({ source: o, target: o })
      })
      .remove()

    // Store the old positions for transition
    root.eachBefore((d) => {
      d.x0 = d.x
      d.y0 = d.y
    })

    // Highlight the path after animation
    setTimeout(() => {
      highlightPath(ministryId)
    }, duration + 50)
  }

  // Watch for changes in expanded ministries and update accordingly
  useEffect(() => {
    if (!rootRef.current) return

    // Get the current expanded ministries from the tree
    const currentExpanded = new Set()
    rootRef.current.eachBefore((d) => {
      if (d.data.type === "ministry" && d.children) {
        currentExpanded.add(d.data.id)
      }
    })

    // Find ministries that need to be expanded
    expandedMinistriesArray.forEach((ministryId) => {
      if (!currentExpanded.has(ministryId) && departmentData[ministryId]) {
        updateDepartments(ministryId, true)
      }
    })

    // Find ministries that need to be collapsed
    Array.from(currentExpanded).forEach((ministryId) => {
      if (!expandedMinistriesArray.includes(ministryId)) {
        updateDepartments(ministryId, false)
      }
    })
  }, [expandedMinistriesArray, departmentData, dimensions])

  // Initial tree setup
  useEffect(() => {
    if (!treeStructure || dimensions.width === 0) return

    const { width, height } = dimensions

    // Clear existing SVG
    d3.select(containerRef.current).selectAll("svg").remove()

    // Create SVG
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif")
      .style("user-select", "none")

    // Margins
    const marginTop = 10
    const marginRight = 10
    const marginBottom = 10
    const marginLeft = 40

    // Create hierarchy
    const root = d3.hierarchy(treeStructure)
    rootRef.current = root

    // Tree layout with better spacing
    const dx = 25 // Increased vertical spacing
    const dy = (width - marginRight - marginLeft) / (1 + root.height)

    const tree = d3.tree().nodeSize([dx, dy])
    treeRef.current = tree

    // Create groups
    const gLink = svg
      .append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#2593B8")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)

    const gNode = svg.append("g").attr("class", "nodes").attr("cursor", "pointer").attr("pointer-events", "all")

    // Initial tree computation
    tree(root)

    // Calculate bounds
    let left = root,
      right = root
    root.eachBefore((node) => {
      if (node.x < left.x) left = node
      if (node.x > right.x) right = node
    })

    const treeHeight = right.x - left.x + marginTop + marginBottom

    // Set SVG dimensions
    svg.attr("height", treeHeight).attr("viewBox", [-marginLeft, left.x - marginTop, width, treeHeight])

    const nodes = root.descendants()
    const links = root.links()

    // Add initial nodes
    const nodeEnter = gNode
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => {
        let adjustedY = d.y
        if (d.depth === 1) {
          adjustedY = width * 0.5 // Start ministries at center
        }
        return `translate(${adjustedY},${d.x})`
      })
      .attr("data-id", (d) => d.data.id || "root")

    // Add circles
    nodeEnter
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) => {
        if (d.data.type === "root") return "#fff"
        return "#F3F3FF"
      })
      .attr("stroke", "#2593B8")
      .attr("stroke-width", 1.5)
      .style("cursor", (d) => (d.data.type === "ministry" ? "pointer" : "default"))
      .on("click", (event, d) => {
        if (d.data.type === "ministry") {
          event.stopPropagation()
          onMinistryClick(d.data.id)
        }
      })

    // Add text
    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", 6)
      .attr("text-anchor", "start")
      .text((d) => d.data.name.split(":")[0])
      .attr("fill", "#F4F4F4")
      .style("cursor", (d) => (d.data.type === "ministry" ? "pointer" : "default"))
      .on("click", (event, d) => {
        if (d.data.type === "ministry") {
          event.stopPropagation()
          onMinistryClick(d.data.id)
        }
      })

    // Add loading indicators
    nodeEnter
      .append("text")
      .attr("class", "loading-indicator")
      .attr("dy", "0.31em")
      .attr("x", -15)
      .attr("text-anchor", "middle")
      .text("⟳")
      .attr("fill", "#ffeb3b")
      .style("font-size", "12px")
      .style("opacity", 0)

    // Add initial links
    gLink
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", (d) => {
        const adjustedSourceY = d.source.depth === 1 ? width * 0.5 : d.source.y
        const adjustedTargetY = d.target.depth === 1 ? width * 0.5 : d.target.y

        return d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)({
          source: { x: d.source.x, y: adjustedSourceY },
          target: { x: d.target.x, y: adjustedTargetY },
        })
      })

    // Initialize positions
    root.x0 = dy / 2
    root.y0 = 0
    root.descendants().forEach((d, i) => {
      d.id = d.data.id || i
      d.x0 = d.x
      d.y0 = d.y
    })

    // Cleanup function
    return () => {
      d3.select(containerRef.current).selectAll("svg").remove()
    }
  }, [treeStructure, dimensions])

  return (
    <div
      ref={containerRef}
      style={{
        paddingTop: "30px",
        paddingBottom: "30px",
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#ffffff"
      }}
    />
  )
}

export default TidyTree
