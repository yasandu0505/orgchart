import utils from "../utils/utils"

// Fetch initial gazette dates and all ministry protobuf data
const fetchInitialGazetteData = async () => {
  try {
    const response = await fetch("/v1/entities/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: {
          major: "Organisation",
          minor: "minister"
        }
      })
    })
    const responseForPerson = await fetch("/v1/entities/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: {
          major: "Person",
          minor: "citizen"
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    if (!responseForPerson.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const result = await response.json()
    const resultForPerson = await responseForPerson.json()

    const datesList1 = result.body.map((item) => item.created?.split("T")[0]);
    const datesList2 = resultForPerson.body.map((item) => item.created?.split("T")[0]);

    const mergedDateList = datesList1.concat(datesList2).sort();
    const dates = Array.from(new Set(mergedDateList))
    
    return { dates, allMinistryData: result.body }
  } catch (error) {
    console.error("Error fetching initial gazette data from API:", error)
    return {
      dates: [],
      allMinistryData: [],
    }
  }
}

const fetchPresidentsData = async (governmentNodeId = "gov_01") => {
  try{
    const response = await fetch(`/v1/entities/${governmentNodeId}/allrelations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const jsonResponse = await response.json();
    const presidentData = jsonResponse.filter(person => person.name == "AS_APPOINTED");

    return presidentData;

  }catch(e){
    console.log(`Error fetching presidents `,e.message);
    return [];
  }
}

const fetchActiveMinistries = async (selectedDate, allMinistryData, governmentNodeId = "gov_01") => {
  try {
    const response = await fetch(`/v1/entities/${governmentNodeId}/relations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        relatedEntityId: "",
        startTime: `${selectedDate}T00:00:00Z`,
        endTime: "",
        id: "",
        name: "AS_MINISTER"
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const activeMinistryRelations = await response.json()

    // Extract the relatedEntityIds from the response
    const activeMinistryIds = activeMinistryRelations
      .filter(relation => relation.relatedEntityId)
      .map(relation => relation.relatedEntityId)

    // console.log('Active ministry IDs:', activeMinistryIds)

    // Map active ministry IDs with the protobuf data to get ministry names
    const activeMinistries = allMinistryData
      .filter(ministry => activeMinistryIds.includes(ministry.id))
      .map(ministry => {
        let name = ministry.name
        
        try {
          const parsed = JSON.parse(ministry.name)
          if (parsed?.value) {
            name = utils.decodeHexString(parsed.value)
          }
        } catch (e) {
          // Use extractNameFromProtobuf as fallback
          name = utils.extractNameFromProtobuf(ministry.name) || ministry.name
        }

        return {
          name,
          id: ministry.id,
          type: "ministry",
          children: []
        }
      })

    // console.log('Active ministries with names:', activeMinistries)

    return {
      name: "Government",
      children: activeMinistries,
      type: "root",
    }

  } catch (error) {
    console.error("Error fetching active ministries:", error)
    // Return empty tree structure on error
    return {
      name: "Government",
      children: [],
      type: "root",
    }
  }
}

const fetchAllPersons = async () => {
  try{
const response = await fetch("/v1/entities/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: {
          major: "Person",
          minor: "citizen"
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response;
  } catch (error) {
    console.error("Error fetching person data from API:", error)
    return {
      dates: [],
      allMinistryData: [],
    }
  }
}

const fetchActiveRelationsForMinistry = async (selectedDate, ministryId, relationType) => {
  try {
    const response = await fetch(`/v1/entities/${ministryId}/relations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        relatedEntityId: "",
        startTime: `${selectedDate}T00:00:00Z`,
        endTime: "",
        id: "",
        name: relationType
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response;
    
  } catch (error) {
    console.error("Error fetching active ministries:", error)
  }
}

// Fetch active departments for a specific ministry with date filtering
const fetchAllDepartments = async () => {
    // Fetch all department protobuf data
    const response = await fetch("/v1/entities/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        kind: {
          major: "Organisation",
          minor: "department" 
        }
      })
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response;
    
} 


export default {fetchInitialGazetteData, fetchActiveMinistries, fetchAllPersons, fetchActiveRelationsForMinistry, fetchAllDepartments, fetchPresidentsData};