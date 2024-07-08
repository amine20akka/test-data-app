import './style.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls, ZoomSlider } from 'ol/control';
import { DblClickDragZoom, defaults as defaultInteractions, } from 'ol/interaction.js';
import { fetchAndProcessLayers } from './REST_API.js'
// import { fetchCapabilities, processCapabilitiesData } from './GetCapabilities_API';

// Initialize the map
const map = new Map({
  target: 'map',
  interactions: defaultInteractions().extend([
    new DblClickDragZoom(),
  ]),
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  }),
  controls: defaultControls().extend([
    new ZoomSlider(),
  ]).extend([]),
});

// Handle FullScreen control with custom button click
const fullscreenButton = document.getElementById('fullscreen-btn');

fullscreenButton.addEventListener('click', () => {
  const mapTarget = map.getTargetElement();

  if (!document.fullscreenElement) {
    if (mapTarget.requestFullscreen) {
      mapTarget.requestFullscreen().catch(error => {
        console.error('Failed to enter fullscreen:', error);
      });
    } else if (mapTarget.mozRequestFullScreen) { // Firefox
      mapTarget.mozRequestFullScreen().catch(error => {
        console.error('Failed to enter fullscreen:', error);
      });
    } else if (mapTarget.webkitRequestFullscreen) { // Chrome, Safari, Opera
      mapTarget.webkitRequestFullscreen().catch(error => {
        console.error('Failed to enter fullscreen:', error);
      });
    } else if (mapTarget.msRequestFullscreen) { // IE/Edge
      mapTarget.msRequestFullscreen().catch(error => {
        console.error('Failed to enter fullscreen:', error);
      });
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(error => {
        console.error('Failed to exit fullscreen:', error);
      });
    } else if (document.mozCancelFullScreen) { // Firefox
      document.mozCancelFullScreen().catch(error => {
        console.error('Failed to exit fullscreen:', error);
      });
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
      document.webkitExitFullscreen().catch(error => {
        console.error('Failed to exit fullscreen:', error);
      });
    } else if (document.msExitFullscreen) { // IE/Edge
      document.msExitFullscreen().catch(error => {
        console.error('Failed to exit fullscreen:', error);
      });
    }
  }
});

// Fonction pour ajouter une couche WMS
export function addWMSLayer(layerName) {
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

// Appel de la fonction pour récupérer et traiter les couches d'un workspace spécifique
fetchAndProcessLayers('test_data');

// Sélecteur de fond de carte
const backgroundSelector = document.getElementById('background-selector');

backgroundSelector.addEventListener('change', function() {
  const selectedValue = this.value;

  // Supprimer les couches actuelles
  map.getLayers().clear();

  // Ajouter la nouvelle couche en fonction de la sélection
  switch (selectedValue) {
    case 'osm':
      map.addLayer(new TileLayer({
        source: new OSM()
      }));
      fetchAndProcessLayers('test_data');
      break;
    case 'satellite':
      map.addLayer(new TileLayer({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attributions: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
      }));
      fetchAndProcessLayers('test_data');
      break;
      case 'topographic':
        map.addLayer(new TileLayer({
          source: new XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            attributions: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
          })
        }));
        fetchAndProcessLayers('test_data');
        break;
    default:
      break;
  }
});


// // Function to fetch and process layers from GetCapabilities
// fetchCapabilities()
//   .then(xmlData => {
//     const layerNames = processCapabilitiesData(xmlData);
//     layerNames.forEach(layerName => {
//       addWMSLayer(layerName);
//     });
//   })
//   .catch(error => {
//     console.error('Global error:', error);
//   });