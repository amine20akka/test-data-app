import './style.css';
import axios from 'axios';
import { addWMSLayer } from './main';

export function fetchLayersFromWorkspace(workspace) {
    const url = `http://localhost:8080/geoserver/rest/workspaces/${workspace}/layers`;
  
    return axios.get(url, {
      auth: {
        username: 'admin',
        password: 'geoserver'
      }
    })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('La requête n\'a pas réussi');
      }
      return response.data;
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des couches:', error);
      throw error;
    });
  }

export function processWorkspaceLayersData(data) {
  const layers = data.layers.layer;
  const layerNames = layers.map(layer => layer.name);

  layerNames.forEach(layerName => {
    addWMSLayer(layerName);
  });
}

export function fetchAndProcessLayers(workspace) {
  fetchLayersFromWorkspace(workspace)
  .then(data => {
    processWorkspaceLayersData(data);
  })
  .catch(error => {
    console.error('Erreur globale:', error);
  });
}