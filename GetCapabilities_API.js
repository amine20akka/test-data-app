import axios from 'axios';

// Function to fetch GetCapabilities XML data from GeoServer
export function fetchCapabilities() {
  const url = 'http://localhost:8080/geoserver/test_data/wms?service=WMS&version=1.1.1&request=GetCapabilities';

  return axios.get(url)
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Request failed');
      }
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching capabilities:', error);
      throw error;
    });
}

// Function to process GetCapabilities XML data and extract layer names
export function processCapabilitiesData(xmlData) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
  
  // Extract layer names from the XML data
  const layers = xmlDoc.getElementsByTagName('Layer');
  const layerNames = [];
  
  for (let i = 0; i < layers.length; i++) {
    const nameElement = layers[i].getElementsByTagName('Name')[0];
    if (nameElement) {
      layerNames.push(nameElement.textContent);
    }
  }
  
  return layerNames;
}
