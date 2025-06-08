import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./TidyTree.css";

const TidyTree = ({ data, onMinistryClick, loadingDepartments, departmentData }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [expandedMinistries, setExpandedMinistries] = useState(new Set());

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!data) return;

    // Clear existing SVG when data changes
    d3.select(containerRef.current).selectAll("svg").remove();

    // Create new SVG
    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", 0)
      .attr("viewBox", [0, 0, width, 0])
      .style("max-width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif")
      .style("user-select", "none");

    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 40;

    // Create hierarchy from original data
    const root = d3.hierarchy(data);
    const dx = 25; // Increased spacing for departments
    const dy = (width - marginRight - marginLeft) / (1 + root.height);

    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal = d3.linkHorizontal().x((d) => d.y).y((d) => d.x);

    // Create groups for links and nodes
    const gLink = svg.append("g")
      .attr("class", "links")
      .attr("fill", "none")
      .attr("stroke", "#2593B8")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
      .attr("class", "nodes")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    // Group for department display
    const gDepartments = svg.append("g")
      .attr("class", "departments");

    function update() {
      const duration = 500;
      
      // Create expanded data structure for layout calculation
      const expandedData = createExpandedData(data, expandedMinistries, departmentData);
      const expandedRoot = d3.hierarchy(expandedData);
      
      // Compute layout
      tree(expandedRoot);

      // Get all nodes (ministries + departments)
      const allNodes = expandedRoot.descendants();
      const ministryNodes = allNodes.filter(d => d.data.type === 'root' || d.data.type === 'ministry');
      const departmentNodes = allNodes.filter(d => d.data.type === 'department');

      // Calculate bounds
      let left = expandedRoot, right = expandedRoot;
      expandedRoot.eachBefore((node) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      // Update SVG dimensions
      svg.transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [-marginLeft, left.x - marginTop, width, height]);

      // Update ministry nodes
      const node = gNode.selectAll("g")
        .data(ministryNodes, d => d.data.id || 'root');

      const nodeEnter = node.enter()
        .append("g")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("data-id", d => d.data.id || 'root')
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", async (event, d) => {
          if (d.data.type === 'ministry') {
            const ministryId = d.data.id;
            const isCurrentlyExpanded = expandedMinistries.has(ministryId);
            
            if (isCurrentlyExpanded) {
              // Collapse - remove from expanded set
              setExpandedMinistries(prev => {
                const newSet = new Set(prev);
                newSet.delete(ministryId);
                return newSet;
              });
            } else {
              // Expand - add to expanded set and fetch departments if needed
              setExpandedMinistries(prev => new Set([...prev, ministryId]));
              if (onMinistryClick) {
                await onMinistryClick(ministryId);
              }
            }

            // Apply or remove highlight
            d3.selectAll(".nodes circle,.nodes text,.departments circle,.departments text").classed("highlight", false);
            
            if (!isCurrentlyExpanded) {
              // Only highlight when expanding
              setTimeout(() => {
                highlightNodes(d, ministryId, departmentData);
              }, 100);
            }
          }
        });

      // Add circles for ministry nodes
      nodeEnter.append("circle")
        .attr("r", 5)
        .attr("fill", d => {
          if (d.data.type === 'root') return "#fff";
          if (d.data.type === 'ministry') return "#4CAF50";
          return "#fff";
        })
        .attr("stroke", d => {
          if (d.data.type === 'root') return "#555";
          if (d.data.type === 'ministry') return "#4CAF50";
          return "#555";
        })
        .attr("stroke-width", 1.5);

      // Add text labels for ministry nodes
      nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", 6)
        .attr("text-anchor", "start")
        .text(d => d.data.name)
        .attr("fill", "#fff")
        .style("font-size", d => {
          if (d.data.type === 'root') return "14px";
          if (d.data.type === 'ministry') return "12px";
          return "10px";
        })
        .style("font-weight", d => d.data.type === 'root' ? "bold" : "normal");

      // Add loading indicators
      nodeEnter.append("text")
        .attr("class", "loading-indicator")
        .attr("dy", "0.31em")
        .attr("x", -15)
        .attr("text-anchor", "middle")
        .text("⟳")
        .attr("fill", "#ffeb3b")
        .style("font-size", "12px")
        .style("opacity", 0);

      // Check if any ministries are expanded for animation
      const ministersExpanded = expandedMinistries.size > 0;

      // Update existing nodes with position animations
      const nodeUpdate = node.merge(nodeEnter)
        .transition()
        .duration(duration)
        .attr("transform", d => {
          // Adjust the y position for second layer (minister nodes) - animation logic from original
          let adjustedY = d.y;
          if (d.depth === 1) {
            // If ministers are expanded, shift them left to 1/4 of the width
            adjustedY = ministersExpanded ? width / 4 : width / 2;
          }
          return `translate(${adjustedY},${d.x})`;
        })
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Update loading indicators
      node.merge(nodeEnter).selectAll(".loading-indicator")
        .style("opacity", d => {
          return loadingDepartments && loadingDepartments.has(d.data.id) ? 1 : 0;
        });

      // Remove exiting nodes
      node.exit()
        .transition()
        .duration(duration)
        .remove()
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update department nodes
      const deptNode = gDepartments.selectAll("g")
        .data(departmentNodes, d => d.data.id);

      const deptNodeEnter = deptNode.enter()
        .append("g")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Add circles for department nodes
      deptNodeEnter.append("circle")
        .attr("r", 4)
        .attr("fill", "#2196F3")
        .attr("stroke", "#2196F3")
        .attr("stroke-width", 1);

      // Add text labels for department nodes
      deptNodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", 6)
        .attr("text-anchor", "start")
        .text(d => d.data.name)
        .attr("fill", "#fff")
        .style("font-size", "10px");

      // Update existing department nodes
      deptNode.merge(deptNodeEnter)
        .transition()
        .duration(duration)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      // Remove exiting department nodes
      deptNode.exit()
        .transition()
        .duration(duration)
        .remove()
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      // Update links with position animations
      const allLinks = expandedRoot.links();
      const link = gLink.selectAll("path")
        .data(allLinks, d => `${d.source.data.id || 'root'}-${d.target.data.id}`);

      const linkEnter = link.enter()
        .append("path")
        .attr("d", diagonal);

      link.merge(linkEnter)
        .transition()
        .duration(duration)
        .attr("d", d => {
          // Adjust link positions based on ministry expansion
          const adjustedSourceY = d.source.depth === 1 ? (ministersExpanded ? width / 4 : width / 2) : d.source.y;
          const adjustedTargetY = d.target.depth === 1 ? (ministersExpanded ? width / 4 : width / 2) : d.target.y;

          return diagonal({ 
            source: { x: d.source.x, y: adjustedSourceY }, 
            target: { x: d.target.x, y: adjustedTargetY } 
          });
        });

      link.exit()
        .transition()
        .duration(duration)
        .remove();
    }

    // Helper function to highlight nodes (from original code)
    function highlightNodes(node, ministryId, deptData) {
      // Highlight the clicked ministry node
      d3.select(`[data-id='${ministryId}']`)
        .selectAll("circle, text")
        .classed("highlight", true);
    
      // Highlight departments if they exist for this ministry
      if (deptData[ministryId]) {
        deptData[ministryId].forEach(dept => {
          d3.selectAll(`.departments g`)
            .filter(d => d && d.data && d.data.id === dept.id)
            .selectAll("circle, text")
            .classed("highlight", true);
        });
      }
    }

    // Helper function to create expanded data structure for layout
    function createExpandedData(originalData, expandedSet, deptData) {
      const expanded = { ...originalData };
      
      if (originalData.children) {
        expanded.children = originalData.children.map(ministry => {
          const expandedMinistry = { ...ministry };
          
          if (expandedSet.has(ministry.id) && deptData[ministry.id]) {
            expandedMinistry.children = deptData[ministry.id].map(dept => ({
              ...dept,
              children: []
            }));
          }
          
          return expandedMinistry;
        });
      }
      
      return expanded;
    }

    // Add CSS for animations and highlighting
    const existingStyle = document.getElementById('tidytree-styles');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'tidytree-styles';
      style.textContent = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .highlight {
          filter: brightness(1.5) !important;
          stroke-width: 2px !important;
        }
      `;
      document.head.appendChild(style);
    }

    update();
  }, [data, width, loadingDepartments, departmentData, expandedMinistries]);

  return <div ref={containerRef}></div>;
};

export default TidyTree;