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

export default {decodeHexString, hexToString, extractNameFromProtobuf};
