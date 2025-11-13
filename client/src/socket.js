// client/src/socket.js
import { io } from 'socket.io-client';

// Production mein backend same origin pe hai
const URL = import.meta.env.DEV 
  ? 'http://localhost:5000' 
  : ''; // Same origin → /socket.io

export const socket = io(URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});