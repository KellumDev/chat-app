import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem('token');
    socket = io('http://localhost:3001', {
      auth: { token },
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const token = localStorage.getItem('token');
  const s = getSocket();
  // Update token in case it changed
  s.auth = { token };
  s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
