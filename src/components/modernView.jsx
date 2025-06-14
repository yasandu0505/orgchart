import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import PresidencyTimeline from './PresidencyTimeline';
import colors from '../assets/colors';
import { useSelector } from 'react-redux';
import { presidents } from '../presidents';
import { useState } from 'react';
import InfoTab from './InfoTab';
import MinistryCardGrid from './MinistryCardGrid';


const ModernView = () => {
    const { selectedIndex, selectedDate } = useSelector((state) => state.presidency);
    const selectedPresident = selectedIndex !== null ? presidents[selectedIndex] : null;

    const [view, setView] = useState('modern');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [drawerMode, setDrawerMode] = useState('ministry');
    const [selectedDepartment, setSelectedDepartment] = useState(null);


    const handleViewChange = (type) => {
        setView(type);
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setDrawerMode('ministry');
        setSelectedDepartment(null);
        setDrawerOpen(true);
    };


    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedCard(null);
        setDrawerMode('ministry');
        setSelectedDepartment(null);
    };

    const handleDepartmentClick = (dep) => {
        setSelectedDepartment(dep);
        setDrawerMode('department');
    };

    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: colors.backgroundPrimary,
                overflowX: 'hidden',
            }}
        >
            {/* Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, justifyContent: 'center' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                        input: { color: colors.textSearch },
                        label: { color: colors.textSearch },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#1565c0' },
                            '&:hover fieldset': { borderColor: colors.textSearch },
                            '&.Mui-focused fieldset': { borderColor: colors.textSearch },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        minWidth: 120,
                        height: '40px',
                        fontWeight: 600,
                        backgroundColor: colors.textSearch,
                        color: '#fff',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#1565c0' },
                    }}
                >
                    Search
                </Button>
            </Box>


            {/* View Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, px: 2 }}>
                <Stack direction="row" spacing={3}>
                    {['classic', 'modern', 'compare'].map((type) => (
                        <Button
                            key={type}
                            variant={view === type ? 'contained' : 'outlined'}
                            onClick={() => handleViewChange(type)}
                            sx={{
                                color: view === type ? '#fff' : colors.primary,
                                backgroundColor: view === type ? colors.primary : 'transparent',
                                borderColor: colors.primary,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: view === type ? colors.primary : `${colors.primary}22`, // light hover tint
                                    borderColor: colors.primary,
                                },
                            }}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                    ))}
                </Stack>
            </Box>

            <Box sx={{ display: "flex", mt: 5 }}>
                <PresidencyTimeline />
            </Box>

            {/* Selected Info Card */}
            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <Card sx={{ m: 2 }}>
                    <Box sx={{ padding: 2 }}>
                        {selectedPresident && (
                            <>
                                <Typography>{selectedPresident.name}</Typography>
                                <Typography>Term: {selectedPresident.year}</Typography>
                            </>
                        )}
                    </Box>
                </Card>
            </Box>



            {/* Card Grid for Modern View */}
            {view === 'modern' && selectedDate != null && (
                <MinistryCardGrid
                    selectedPresident={selectedPresident}
                    selectedDate={selectedDate}
                    onCardClick={handleCardClick}
                />

            )}

            {/* Right Drawer */}
            <InfoTab
                drawerOpen={drawerOpen}
                drawerMode={drawerMode}
                selectedCard={selectedCard}
                selectedDepartment={selectedDepartment}
                selectedDate={selectedDate}
                onClose={handleDrawerClose}
                onBack={() => setDrawerMode('ministry')}
                onDepartmentClick={handleDepartmentClick}
            />

        </Box>
    );
};

export default ModernView; 
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
