import React, { useEffect, useState } from "react";
import TidyTree from "./components/TidyTree"; // Import the new component
import EventSlider from "./components/EventSlider";
import { ErrorBoundary } from "react-error-boundary";

// Function to fetch the dates through search API
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

    // Assuming result.entities is the array containing `created`
    const dates = result.body
      .map((item) => item.created?.split("T")[0]) // Extract only date part
      .filter((date) => !!date) // Remove null/undefined
      .filter((value, index, self) => self.indexOf(value) === index) // Unique dates
      .sort(); // Optional: sort chronologically

    console.log(dates);

    return { dates, rawData: result.body };
  } catch (error) {
    console.error("Error fetching gazette dates from API:", error);
    return {
      dates: [],
      rawData: [],
    };
  }
};

const exampleTreeData = {
  name: "Government",
  children: [
    {
      name: "Minister of Health",
      children: [
        { name: "Department of Public Health" },
        { name: "Department of Hospitals" }
      ]
    },
    {
      name: "Minister of Education",
      children: [
        { name: "Department of Schools" },
        { name: "Department of Higher Education" }
      ]
    },
    {
      name: "Minister of Transport",
      children: [
        { name: "Department of Bus" },
        { name: "Department of Railway" }
      ]
    },
    {
      name: "Minister of Defence",
      children: [
        { name: "Department of Air Force" },
        { name: "Department of Army" }
      ]
    },
    {
      name: "Minister of Enviornment",
      children: [
        { name: "Department of Rivers" },
        { name: "Department of Canals" }
      ]
    }
  ]
};


const App = () => {
  const [treeData, setTreeData] = useState(null);
  const [isTreeDataLoading, setIsTreeDataLoading] = useState(true);
  const [gazetteData, setGazetteData] = useState([]);
  const [allData, setAllData] = useState({});

  useEffect(() => {
    const initializeApp = async () => {
      if (gazetteData.length === 0) {
        const { dates, rawData } = await fetchGazetteData();
        setGazetteData(dates);

        if (dates.length > 0) {
          setIsTreeDataLoading(false);
        }
      }
    };

    initializeApp();
  }, []);

  const handleDateChange = async (date) => {
    setIsTreeDataLoading(true);
    if (!allData[date]) {
      console.log(`App.jsx: Fetching data for ${date}`);
      console.log("allData");
      console.log(allData);
      const newData = await fetchDataForAllDates([date]);
      console.log("newData");
      console.log(newData);
      setAllData((prevData) => ({
        ...prevData,
        [date]: newData[date],
      }));
      setTreeData(newData[date]);
    } else {
      console.log("allData[date]");
      console.log(date);
      console.log(allData[date]);
      setTreeData(allData[date]);
    }
    setIsTreeDataLoading(false);
  };

  const timelineData = gazetteData.map((date) => ({
    date,
    event: `OrgChart at ${date}`,
  }));

  return (
    <ErrorBoundary>
      <div
        style={{
          position: "fixed", // Fixed position relative to viewport
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
          <h2 style={{ margin: 0 }}>Organization Chart</h2>
        </div>

        {/* Fixed Slider Section */}
        <div
          style={{
            height: "120px", // Fixed height
            backgroundColor: "#1e1e1e",
            borderBottom: "1px solid #333",
            padding: "20px",
            position: "relative", // For proper rendering
            flexShrink: 0, // Prevent shrinking
            width: "100%", // Full width
            display: "flex",
            alignItems: "center", // Center slider vertically
          }}
        >
          <ErrorBoundary>
            {gazetteData.length > 0 && (
              <EventSlider
                data={timelineData}
                onSelectDate={handleDateChange}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Scrollable Tree Section */}
        <div
          style={{
            flex: 1, // Take remaining space
            backgroundColor: "#1e1e1e",
            overflow: "auto", // Enable scrolling
            padding: "20px",
            position: "relative", // For proper rendering
          }}
        >
          <ErrorBoundary>
            {isTreeDataLoading ? (
              <p>Loading...</p>
            ) : (
              <TidyTree data={exampleTreeData} />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
