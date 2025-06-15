import React, { useEffect, useRef } from 'react';
import { MessageCircle, BarChart3, Lightbulb, Calendar, Users, AlertTriangle, ChevronRight, Building2, User } from 'lucide-react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Sample government hierarchy data
    const data = {
      name: "Prime Minister",
      children: [
        {
          name: "Finance Ministry",
          children: [
            { name: "Dept-A" },
            { name: "Dept-B" }
          ]
        },
        {
          name: "Health Ministry",
          children: [
            { name: "Dept-A" },
            { name: "Dept-B" }
          ]
        },
        {
          name: "Education Ministry",
          children: [
            { name: "Dept-A" },
            { name: "Dept-B" }
          ]
        }
      ]
    };

    const width = 400;
    const height = 250;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree().size([width - 40, height - 40]);
    treeLayout(root);

    // Create links
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical()
        .x(d => d.x + 20)
        .y(d => d.y + 20))
      .attr("fill", "none")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2);

    // Create nodes
    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x + 20}, ${d.y + 20})`);

    nodes.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.depth === 0 ? "#3b82f6" : d.depth === 1 ? "#8b5cf6" : "#06b6d4");

    nodes.append("text")
      .attr("dy", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "500")
      .style("fill", "#374151")
      .text(d => d.data.name);

  }, []);

  const handleExplore = () => {
    navigate("/modern-view");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Navigate Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Government Hierarchy
            </span>
            , <br />
            No Matter Where You Stand
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Understand your role, track policy implementations, and collaborate effectively 
            with GovTrack - the comprehensive governance management platform for public servants.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors" onClick={handleExplore}>
            Begin Exploration
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Section - Classic View */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Classic View<br />
              <span className="text-sm font-normal text-gray-600">D3.js Powered Tree Diagram</span>
            </h3>
            
            <div className="flex flex-col items-center">
              <svg ref={svgRef}></svg>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Interactive Government Hierarchy</p>
                <div className="flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Executive</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">Ministry</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-600">Department</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Modern View */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Modern View<br />
              <span className="text-sm font-normal text-gray-600">Easy Navigation Interface</span>
            </h3>
            
            <div className="space-y-3">
              {/* Executive Level */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Executive Branch</h4>
                      <p className="text-sm text-gray-600">Prime Minister's Office</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Ministry Level */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ministry Level</h4>
                      <p className="text-sm text-gray-600">3 Active Ministries</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Department Level */}
              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-lg p-4 border-l-4 border-cyan-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-cyan-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Department Level</h4>
                      <p className="text-sm text-gray-600">8 Active Departments</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-3 mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">847</p>
                    <p className="text-xs text-gray-600">Total Positions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">23</p>
                    <p className="text-xs text-gray-600">Active Projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - AI Insights */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              AI Powered Insights
            </h3>
            
            {/* AI Query */}
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-800">
                  What tasks are causing delays in my department?
                </span>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-900 mb-3">Top Delays Detected:</p>

            {/* Delay Analysis */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-800 mb-2">Task:</p>
              <p className="text-blue-600 font-medium mb-2">Budget Review for Social Programs</p>
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">
                  Waiting on resource allocation approval.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">3 days overdue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;