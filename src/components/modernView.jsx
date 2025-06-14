import { useEffect, useState } from "react";
import api from "../services/services";
import utils from "../utils/utils";

export default function ModernView() {
  const [gazetteData, setGazetteData] = useState([]);
  const [allMinistryData, setAllMinistryData] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [allPersonList, setAllPersonList] = useState([]);
  const [activeMinistryList, setActiveMinistryList] = useState([]);
  const [allDepartmentList, setAllDepartmentList] = useState([]);
  const [personListForMinistry, setPersonListForMinistry] = useState([]);
  const [departmentListForMinistry, setDepartmentListForMinistry] = useState(
    []
  );
  const [presidentRelations, setPresidentRelations] = useState([]);
  const [presidentList, setPresidentList] = useState([]);
  const [selectedPresident, setSelectedPresident] = useState();

  const fetchGazetteData = async (selectedPresident) => {
    try {
      const startTime = selectedPresident.startTime.split("T")[0];
      const endTime = selectedPresident.endTime.split("T")[0];

      const { dates, allMinistryData } = await api.fetchInitialGazetteData();

      var filteredDates = [];
      if(endTime == ""){
        filteredDates = dates.filter(date => date >= startTime);
      } else {
        filteredDates = dates.filter(date => date >= startTime && date <= endTime);
      }

      setGazetteData(filteredDates);
      setAllMinistryData(allMinistryData);

      if (dates.length > 0) {
        setSelectedDate(dates[dates.length - 1]);
      }
    } catch (e) {
      console.log(`Error fetching gazette data : ${e.message}`);
    }
  };

  const fetchMinistryList = async () => {
    try {
      setActiveMinistryList([]);
      const activeMinistry = await api.fetchActiveMinistries(
        selectedDate,
        allMinistryData
      );
      console.log(activeMinistry.children)
      setActiveMinistryList(activeMinistry.children);
    } catch (e) {
      console.log("");
    }
  };

  const clearCurrentLists = () => {
    setDepartmentListForMinistry([]);
    setPersonListForMinistry([]);
  };

  useEffect(() => {
    clearCurrentLists();
    fetchMinistryList();
    fetchAllDepartmentData();
  }, [selectedDate, selectedPresident]);

  const fetchPersonData = async () => {
    try {
      const personResponse = await api.fetchAllPersons();
      const personList = await personResponse.json();
      setAllPersonList(personList.body); 

      //this is for president data
      const presidentResponse = await api.fetchPresidentsData();
      setPresidentRelations(presidentResponse);

      console.log(presidentResponse)

      const presidentSet = new Set(presidentResponse.map(p => p.relatedEntityId));

      const presidentListInDetail = personList.body.filter((person) =>
        presidentSet.has(person.id)
      );

      setPresidentList(presidentListInDetail);
      setSelectedPresident(presidentListInDetail[presidentListInDetail.length - 1]);

    } catch (e) {
      console.log(`Error fetching person data : ${e.message}`);
    }
  };

  useEffect(()=>{
    if(selectedPresident?.created){
      clearCurrentLists();
      const matchedPresidentRelation = presidentRelations.find(obj => obj.startTime == selectedPresident.created);
      fetchGazetteData(matchedPresidentRelation);
    }
  },[selectedPresident])

  const fetchAllDepartmentData = async () => {
    try {
      const response = await api.fetchAllDepartments();
      const departmentList = await response.json();
      setAllDepartmentList(departmentList.body);
    } catch (e) {
      console.log(`Error fetching department data : ${e.message}`);
    }
  };

  const fetchPersonListAndDepListForMinistry = async (ministryId) => {
    try {
      clearCurrentLists();
      console.log(ministryId)
      const response1 = await api.fetchActiveRelationsForMinistry(
        selectedDate,
        ministryId,
        "AS_APPOINTED"
      );
      const response2 = await api.fetchActiveRelationsForMinistry(
        selectedDate,
        ministryId,
        "AS_DEPARTMENT"
      );

      const res1 = await response1.json();
      const res2 = await response2.json();

      console.log(res1);
      console.log(res2);

      const personSet = new Set(res1.map((person) => person.relatedEntityId));
      const departmentSet = new Set(
        res2.map((department) => department.relatedEntityId)
      );

      const personListInDetail = allPersonList.filter((person) => {
        return personSet.has(person.id);
      });

      const departmentListInDetail = allDepartmentList.filter((department) => {
        return departmentSet.has(department.id);
      });

      setPersonListForMinistry(personListInDetail);
      setDepartmentListForMinistry(departmentListInDetail);
    } catch (e) {
      console.log(`Error fetching person list for mistry : `, e.message);
    }
  };

  useEffect(() => {
    const initialFetchData = async () => {
      try {
        await fetchPersonData();
      } catch (e) {
        console.error("Error loading initial data:", e.message);
      }
    };
    initialFetchData();
    
  }, []);

  return (
    <div>
      <h1>Modern view - here inject the Sehansi's and Chanuka's works</h1>
      <h2>President List</h2>
      {presidentList &&
        presidentList.map((president, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setSelectedPresident(president);
                console.log(selectedPresident)
              }}
            >
              {utils.extractNameFromProtobuf(president.name)}
            </button>
          );
        })}
      <p>{`Selected president : ${
        selectedPresident &&
        utils.extractNameFromProtobuf(selectedPresident.name)
      }`}</p>
      <p>{`Year : ${
        selectedPresident &&
        selectedPresident.created.split("T")[0]
      }`}</p>
      <h2>Timeline</h2>
      {gazetteData &&
        gazetteData.map((date, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                setSelectedDate(date);
              }}
            >
              {date}
            </button>
          );
        })}
      <p>Selected Date : {selectedDate}</p>
      <h2>Ministry List</h2>
      {activeMinistryList &&
        activeMinistryList.map((ministry, index) => {
          return (
            <button
              key={index}
              onClick={() => fetchPersonListAndDepListForMinistry(ministry.id)}
            >
              {ministry.name}
            </button>
          );
        })}

      <h2>The Person List for Ministry</h2>
      {personListForMinistry.length > 0 &&
        personListForMinistry.map((person, index) => {
          return (
            <div key={index} style={{ display: "flex", margin: "10px" }}>
              {/* <p>{index}</p> */}
              <p>{utils.extractNameFromProtobuf(person.name)}</p>
            </div>
          );
        })}
      <h2>The Department List for Ministry</h2>
      {departmentListForMinistry.length > 0 &&
        departmentListForMinistry.map((department, index) => {
          return (
            <div key={index} style={{ display: "flex", margin: "10px" }}>
              {/* <p>{index}</p> */}
              <p>{utils.extractNameFromProtobuf(department.name)}</p>
            </div>
          );
        })}
    </div>
  );
}
