const axios = require('axios');
const humps = require('humps');

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
});

export const initializeClient = (config) => {
  apiClient.defaults.headers.common = {
    ...apiClient.defaults.headers.common,
    Authorization: `Bearer ${config.token}`,
  };
};

apiClient.interceptors.response.use((response) => {
  response.data = humps.camelizeKeys(response.data);
  return response;
});

module.exports = apiClient;