"use client"

import { useEffect, useState, useCallback } from "react"
import TidyTree from "./components/TidyTree"
import EventSlider from "./components/EventSlider"
import { ErrorBoundary } from "react-error-boundary"

// Decode minister name from hex format
const decodeHexString = (hex) => decodeURIComponent(hex.replace(/(..)/g, "%$1"))

// Convert raw ministerial data into tree format
const transformRawDataToTree = (rawData) => {
  const children = rawData.map((item) => {
    let name = item.name
    const ministryId = item.id

    try {
      const parsed = JSON.parse(item.name)
      if (parsed?.value) {
        name = decodeHexString(parsed.value)
      }
    } catch (e) {
      name = item.name
    }

    return {
      name,
      children: [],
      id: ministryId,
      type: "ministry",
    }
  })

  return {
    name: "Government",
    children,
    type: "root",
  }
}

// Fetch departments for a specific ministry
const fetchDepartments = async (ministryId) => {
  try {
    const response = await fetch(`/v1/entities/${ministryId}/allrelations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const departments = await response.json()

    return departments
      .filter((dept) => dept.name === "AS_DEPARTMENT")
      .map((dept) => ({
        name: dept.relatedEntityId,
        id: dept.relatedEntityId,
        type: "department",
      }))
  } catch (error) {
    console.error(`Error fetching departments for ministry ${ministryId}:`, error)
    return []
  }
}

const fetchGazetteData = async () => {
  try {
    const response = await fetch("/v1/entities/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kind: {
          major: "Organisation",
          minor: "minister",
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const result = await response.json()
    const dates = result.body
      .map((item) => item.created?.split("T")[0])
      .filter((date) => !!date)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort()

    return { dates, rawData: result.body }
  } catch (error) {
    console.error("Error fetching gazette dates from API:", error)
    return {
      dates: [],
      rawData: [],
    }
  }
}

// Add this function before the App component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Something went wrong:</h2>
      <pre style={{ color: "#ff6b6b", marginBottom: "20px" }}>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  )
}

const App = () => {
  const [treeData, setTreeData] = useState(null)
  const [isTreeDataLoading, setIsTreeDataLoading] = useState(true)
  const [gazetteData, setGazetteData] = useState([])
  const [allData, setAllData] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [departmentData, setDepartmentData] = useState({})
  const [loadingDepartments, setLoadingDepartments] = useState(new Set())
  const [expandedMinistries, setExpandedMinistries] = useState(new Set())

  useEffect(() => {
    const initializeApp = async () => {
      if (gazetteData.length === 0) {
        const { dates, rawData } = await fetchGazetteData()
        setGazetteData(dates)

        if (dates.length > 0) {
          const latestDate = dates[dates.length - 1]
          const transformed = transformRawDataToTree(rawData)
          setTreeData(transformed)
          setSelectedDate(latestDate)
          setAllData({ [latestDate]: transformed })
        }

        setIsTreeDataLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleDateChange = async (date) => {
    setIsTreeDataLoading(true)
    setSelectedDate(date)
    // Clear department data and expanded state when changing dates
    setDepartmentData({})
    setExpandedMinistries(new Set())

    if (!allData[date]) {
      const { rawData } = await fetchGazetteData()
      const filteredData = rawData.filter((item) => item.created?.startsWith(date))
      const transformed = transformRawDataToTree(filteredData)
      setAllData((prev) => ({ ...prev, [date]: transformed }))
      setTreeData(transformed)
    } else {
      setTreeData(allData[date])
    }
    setIsTreeDataLoading(false)
  }

  // Fixed ministry click handler with proper toggle logic
  const handleMinistryClick = useCallback(
    async (ministryId) => {
      // Check if this ministry is already expanded
      const isCurrentlyExpanded = expandedMinistries.has(ministryId)

      if (isCurrentlyExpanded) {
        // If expanded, collapse it by removing from the set
        setExpandedMinistries((prev) => {
          const newSet = new Set(prev)
          newSet.delete(ministryId)
          return newSet
        })
      } else {
        // If collapsed, expand it by adding to the set
        setExpandedMinistries((prev) => {
          const newSet = new Set(prev)
          newSet.add(ministryId)
          return newSet
        })

        // Then fetch departments if not already loaded
        if (!departmentData[ministryId]) {
          setLoadingDepartments((prev) => new Set([...prev, ministryId]))

          try {
            const departments = await fetchDepartments(ministryId)

            setDepartmentData((prev) => ({
              ...prev,
              [ministryId]: departments,
            }))
          } catch (error) {
            console.error(`Failed to fetch departments for ministry ${ministryId}:`, error)
          } finally {
            setLoadingDepartments((prev) => {
              const newSet = new Set(prev)
              newSet.delete(ministryId)
              return newSet
            })
          }
        }
      }
    },
    [expandedMinistries, departmentData],
  )

  const timelineData = gazetteData.map((date) => ({
    date,
    event: `OrgChart at ${date}`,
  }))

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            height: "50px",
            padding: "10px 20px",
            backgroundColor: "#1e1e1e",
            borderBottom: "1px solid #333",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, color: "#fff" }}>Organization Chart</h2>
        </div>

        {/* Slider */}
        <div
          style={{
            height: "120px",
            backgroundColor: "#1e1e1e",
            borderBottom: "1px solid #333",
            padding: "20px",
            flexShrink: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {gazetteData.length > 0 && (
              <EventSlider data={timelineData} onSelectDate={handleDateChange} selectedDate={selectedDate} />
            )}
          </ErrorBoundary>
        </div>

        {/* Tree */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {isTreeDataLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  color: "#fff",
                }}
              >
                <p>Loading...</p>
              </div>
            ) : (
              <TidyTree
                data={treeData}
                onMinistryClick={handleMinistryClick}
                loadingDepartments={loadingDepartments}
                departmentData={departmentData}
                expandedMinistries={expandedMinistries}
              />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App
