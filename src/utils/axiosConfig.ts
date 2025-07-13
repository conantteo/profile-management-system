// axiosConfig.ts

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { minimatch } from 'minimatch';
import { mapFields, type Mapping } from './objectUtils';

const endpointPatterns = ['/api/app/**', '/api/test/v2/**'];

// Define your mapping object here or import it from another file
const mapping: Mapping = {
  id_str: 'id',
  name_str: 'name',
  city_str: 'city',
  // Add more field mappings as needed
};

// Helper function to check if the URL matches any pattern
function matchesPattern(url: string, patterns: string[]): boolean {
  return patterns.some((pattern) => minimatch(url, pattern));
}

export const api: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Map outgoing request body fields
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (
    config.url &&
    matchesPattern(config.url, endpointPatterns) &&
    config.data
  ) {
    config.data = mapFields(config.data, mapping);
  }
  return config;
});

// Response interceptor: Map incoming response data fields
api.interceptors.response.use((response: AxiosResponse) => {
  if (
    response.config.url &&
    matchesPattern(response.config.url, endpointPatterns) &&
    response.data
  ) {
    response.data = mapFields(response.data, mapping);
  }
  return response;
});
