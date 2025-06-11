"use client"

import { useEffect, useState, useCallback } from "react"
import TidyTree from "./components/TidyTree"
import EventSlider from "./components/EventSlider"
import { ErrorBoundary } from "react-error-boundary"
import { major } from "@mui/system"

// Decode minister name from hex format
const decodeHexString = (hex) => decodeURIComponent(hex.replace(/(..)/g, "%$1"))

// Helper function to decode hex string to readable text
const hexToString = (hex) => {
  try {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  } catch (error) {
    console.error('Error decoding hex string:', error);
    return hex; // Return original if decoding fails
  }
};

// Helper function to extract name from protobuf format
const extractNameFromProtobuf = (nameObj) => {
  try {
    if (typeof nameObj === 'string') {
      const parsed = JSON.parse(nameObj);
      if (parsed.value) {
        return hexToString(parsed.value);
      }
    }
    return nameObj; // Return as-is if not in expected format
  } catch (error) {
    console.error('Error parsing protobuf name:', error);
    return nameObj;
  }
};

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

// Fetch departments for a specific ministry with date filtering
const fetchDepartments = async (ministryId, selectedDate) => {
  try {
    const response = await fetch(`/v1/entities/${ministryId}/allrelations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const response2 = await fetch("/v1/entities/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: {
          major: "Organisation",
          minor: "department" // Fixed typo: "minro" -> "minor"
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    if (!response2.ok) {
      throw new Error(`API error: ${response2.statusText}`)
    }

    const departments = await response.json();
    const departmentsWithName = await response2.json();

    console.log('Departments with name:', departmentsWithName);

    // Create a lookup map for department names with date filtering
    const departmentNameMap = {};
    if (departmentsWithName.body && Array.isArray(departmentsWithName.body)) {
      departmentsWithName.body.forEach(dept => {
        if (dept && dept.id) {
          // Filter departments by selected date - only include if created <= selectedDate
          const deptCreatedDate = dept.created?.split("T")[0];
          if (!selectedDate || !deptCreatedDate || deptCreatedDate <= selectedDate) {
            const decodedName = extractNameFromProtobuf(dept.name);
            departmentNameMap[dept.id] = decodedName || dept.id;
          }
        }
      });
    }

    console.log('Department name map (filtered by date):', departmentNameMap);

    // Ensure we always return a valid array, even if empty
    if (!Array.isArray(departments)) {
      console.warn('Departments response is not an array:', departments);
      return [];
    }

    const filteredDepartments = departments
      .filter((dept) => dept && dept.name === "AS_DEPARTMENT" && dept.relatedEntityId)
      .map((dept) => {
        const deptName = departmentNameMap[dept.relatedEntityId] || dept.relatedEntityId;
        return {
          name: deptName,
          id: dept.relatedEntityId,
          type: "department",
        };
      })
      .filter((dept) => {
        // Only include departments that have valid data
        return dept && dept.id && dept.name && (!selectedDate || departmentNameMap.hasOwnProperty(dept.id));
      });

    console.log('Filtered departments:', filteredDepartments);
    return filteredDepartments;

  } catch (error) {
    console.error(`Error fetching departments for ministry ${ministryId}:`, error)
    return []
  }
}

// Updated function to fetch gazette dates from text file
const fetchGazetteData = async () => {
  try {
    // Fetch dates from the text file
    const response = await fetch('/gazette_dates.txt');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch gazette dates: ${response.statusText}`);
    }
    
    const textContent = await response.text();
    
    // Parse the text content to extract dates
    // Assuming each date is on a new line and in YYYY-MM-DD format
    const dates = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && line.match(/^\d{4}-\d{2}-\d{2}$/)) // Filter valid date format
      .sort(); // Sort dates

    console.log('Loaded gazette dates from file:', dates);

    // For now, we'll return empty rawData since we're only changing the date fetching
    // The rawData will be handled in the next step of your migration
    return { dates, rawData: [] };

  } catch (error) {
    console.error("Error fetching gazette dates from text file:", error);
    return {
      dates: [],
      rawData: [],
    };
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
          // For now, create an empty tree structure since rawData is empty
          // This will be updated in the next step when you provide the new data source
          const transformed = {
            name: "Government",
            children: [],
            type: "root",
          }
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
      // For now, create empty tree structure for the selected date
      // This will be updated in the next step when you provide the new data source
      const transformed = {
        name: "Government",
        children: [],
        type: "root",
      }
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
            const departments = await fetchDepartments(ministryId, selectedDate)

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