// Simple socket.io client for real-time updates
import { io } from 'socket.io-client';
let socket;
export function connectSocket(token) {
  socket = io('/', { auth: { token } });
  return socket;
}
export function getSocket() { return socket; }
