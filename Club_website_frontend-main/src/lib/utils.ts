import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getApiUrl(path: string): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return `${envUrl.replace(/\/$/, '')}${path}`;
  }
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    if (path.startsWith('/api/club-chat') || path.startsWith('/api/admin') || path.startsWith('/api/events')) {
      return `http://localhost:8000${path}`;
    } else {
      return `http://localhost:5000${path}`;
    }
  }
  
  return path;
}
