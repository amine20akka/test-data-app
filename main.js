import './style.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import axios from 'axios';

// Initialiser la carte
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

// Fonction pour ajouter une couche WMS
function addWMSLayer(layerName) {
  const wmsLayer = new TileLayer({
    source: new TileWMS({
      url: 'http://localhost:8080/geoserver/test_data/wms',
      params: {
        'SERVICE': 'WMS',
        'VERSION': '1.1.0',
        'REQUEST': 'GetMap',
        'LAYERS': layerName,
        'STYLES': '',
        'SRS': 'EPSG:4326',
        'FORMAT': 'image/png'
      },
      serverType: 'geoserver'
    })
  });
  map.addLayer(wmsLayer);
}

// Fonction pour récupérer les informations sur les couches depuis GeoServer en utilisant GetCapabilities
function fetchLayersFromGeoServer() {
  // URL de la requête GetCapabilities WMS
  const url = 'http://localhost:8080/geoserver/test_data/wms?service=WMS&version=1.1.1&request=GetCapabilities';

  // Effectuer la requête Axios
  return axios.get(url)
    .then(response => {
      // Vérifier si la réponse est OK (code HTTP 200)
      if (response.status !== 200) {
        throw new Error('La requête n\'a pas réussi');
      }
      return response.data;  // Renvoyer les données de la réponse
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des couches:', error);
      throw error;  // Propager l'erreur pour la gérer à un niveau supérieur si nécessaire
    });
}

// Fonction pour traiter les données des couches obtenues depuis GeoServer
function processLayersData(xmlData) {
  // Parse XML data
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
  
  // Extraire les noms des couches
  const layers = xmlDoc.getElementsByTagName('Layer');
  const layerNames = [];
  
  for (let i = 0; i < layers.length; i++) {
    const nameElement = layers[i].getElementsByTagName('Name')[0];
    if (nameElement) {
      layerNames.push(nameElement.textContent);
    }
  }
  
  // Ajouter les couches à la carte
  layerNames.forEach(layerName => {
    addWMSLayer(layerName);
  });
}

// Appeler la fonction fetchLayersFromGeoServer pour récupérer les données sur les couches
fetchLayersFromGeoServer()
  .then(xmlData => {
    processLayersData(xmlData);  // Traitement des données des couches récupérées
  })
  .catch(error => {
    console.error('Erreur globale:', error);  // Gestion des erreurs globales
  });