import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket']
});

// Optional: Debug
socket.on('connect', () => {
  console.log('Socket connected!');
});