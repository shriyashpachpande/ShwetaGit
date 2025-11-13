import axios from 'axios';

const API_BASE = import.meta.env.VITE_API || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

// helper for multipart with progress
export function postMultipart(url, formData, setProgress) {
  return api.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (e.total) setProgress?.(Math.round((e.loaded * 50) / e.total));
    },
    onDownloadProgress: (e) => {
      if (e.total) setProgress?.(50 + Math.round((e.loaded * 50) / e.total));
    },
  });
}
