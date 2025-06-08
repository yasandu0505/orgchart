import React, { useEffect, useState } from "react";
import TidyTree from "./components/TidyTree";
import EventSlider from "./components/EventSlider";
import { ErrorBoundary } from "react-error-boundary";

// Decode minister name from hex format
const decodeHexString = (hex) =>
  decodeURIComponent(hex.replace(/(..)/g, "%$1"));

// Convert raw ministerial data into tree format
const transformRawDataToTree = (rawData) => {
  const children = rawData.map((item) => {
    let name = item.name;
    let ministryId = item.id; // Store the ministry ID for later use
    
    try {
      const parsed = JSON.parse(item.name);
      if (parsed?.value) {
        name = decodeHexString(parsed.value);
      }
    } catch (e) {
      // Fallback to raw name if JSON.parse fails
      name = item.name;
    }

    return { 
      name, 
      children: [], 
      id: ministryId, // Add ministry ID to the node
      type: 'ministry' // Add type to identify ministry nodes
    };
  });

  return {
    name: "Government",
    children,
    type: 'root'
  };
};

// Fetch departments for a specific ministry
const fetchDepartments = async (ministryId) => {
  try {
    const response = await fetch(`/v1/entities/${ministryId}/allrelations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      } // Empty JSON body for POST request
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const departments = await response.json();
    
    // Transform department data into simple array of department info
    return departments
      .filter(dept => dept.name === "AS_DEPARTMENT") // Filter only department relations
      .map(dept => ({
        name: dept.relatedEntityId, // Use relatedEntityId as department name
        id: dept.relatedEntityId,
        type: 'department'
      }));
  } catch (error) {
    console.error(`Error fetching departments for ministry ${ministryId}:`, error);
    return [];
  }
};

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
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    const dates = result.body
      .map((item) => item.created?.split("T")[0])
      .filter((date) => !!date)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    return { dates, rawData: result.body };
  } catch (error) {
    console.error("Error fetching gazette dates from API:", error);
    return {
      dates: [],
      rawData: [],
    };
  }
};

const App = () => {
  const [treeData, setTreeData] = useState(null);
  const [isTreeDataLoading, setIsTreeDataLoading] = useState(true);
  const [gazetteData, setGazetteData] = useState([]);
  const [allData, setAllData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [departmentData, setDepartmentData] = useState({}); // Store departments separately
  const [loadingDepartments, setLoadingDepartments] = useState(new Set());

  useEffect(() => {
    const initializeApp = async () => {
      if (gazetteData.length === 0) {
        const { dates, rawData } = await fetchGazetteData();
        setGazetteData(dates);

        if (dates.length > 0) {
          const latestDate = dates[dates.length - 1]; // show latest by default
          const transformed = transformRawDataToTree(rawData);
          setTreeData(transformed);
          setSelectedDate(latestDate);
          setAllData({ [latestDate]: transformed });
        }

        setIsTreeDataLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleDateChange = async (date) => {
    setIsTreeDataLoading(true);
    setSelectedDate(date);
    // Clear department data when changing dates
    setDepartmentData({});
    
    if (!allData[date]) {
      const { rawData } = await fetchGazetteData(); // You might want to fetch only specific date's data
      const filteredData = rawData.filter((item) =>
        item.created?.startsWith(date)
      );
      const transformed = transformRawDataToTree(filteredData);
      setAllData((prev) => ({ ...prev, [date]: transformed }));
      setTreeData(transformed);
    } else {
      setTreeData(allData[date]);
    }
    setIsTreeDataLoading(false);
  };

  // Handle ministry node click to fetch departments
  const handleMinistryClick = async (ministryId) => {
    // Check if departments are already loaded for this ministry
    if (departmentData[ministryId]) {
      return; // Departments already loaded
    }

    // Show loading state for this specific ministry
    setLoadingDepartments(prev => new Set([...prev, ministryId]));

    try {
      const departments = await fetchDepartments(ministryId);
      
      // Store departments separately without modifying tree structure
      setDepartmentData(prev => ({
        ...prev,
        [ministryId]: departments
      }));

    } catch (error) {
      console.error(`Failed to fetch departments for ministry ${ministryId}:`, error);
    } finally {
      // Remove loading state for this ministry
      setLoadingDepartments(prev => {
        const newSet = new Set(prev);
        newSet.delete(ministryId);
        return newSet;
      });
    }
  };

  const timelineData = gazetteData.map((date) => ({
    date,
    event: `OrgChart at ${date}`,
  }));

  return (
    <ErrorBoundary>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ height: "50px", padding: "10px 20px", backgroundColor: "#1e1e1e", borderBottom: "1px solid #333", flexShrink: 0 }}>
          <h2 style={{ margin: 0 }}>Organization Chart</h2>
        </div>

        {/* Slider */}
        <div style={{ height: "120px", backgroundColor: "#1e1e1e", borderBottom: "1px solid #333", padding: "20px", flexShrink: 0, width: "100%", display: "flex", alignItems: "center" }}>
          <ErrorBoundary>
            {gazetteData.length > 0 && (
              <EventSlider
                data={timelineData}
                onSelectDate={handleDateChange}
                selectedDate={selectedDate}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Tree */}
        <div style={{ flex: 1, backgroundColor: "#1e1e1e", overflow: "auto", padding: "20px", position: "relative" }}>
          <ErrorBoundary>
            {isTreeDataLoading ? (
              <p style={{ color: "#fff" }}>Loading...</p>
            ) : (
              <TidyTree 
                data={treeData} 
                onMinistryClick={handleMinistryClick}
                loadingDepartments={loadingDepartments}
                departmentData={departmentData}
              />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;