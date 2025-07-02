import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

let socket: Socket | null = null;

export const initializeSocket = async () => {
  if (socket?.connected) return socket;

  // Get token dynamically when needed
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  socket = io('https://back.emaxb.uz', {
    transports: ['websocket'],
    autoConnect: false,
    auth: {
      token: token ? `Bearer ${token}` : null
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connectSocket = async () => {
      try {
        const sock = await initializeSocket();

        sock.on('connect', () => {
          setIsConnected(true);
        });

        sock.on('disconnect', () => {
          setIsConnected(false);
        });

        sock.on('connect_error', () => {
          setIsConnected(false);
        });

        sock.connect();
        setSocketInstance(sock);
      } catch (error) {
        // Silent error handling
        setIsConnected(false);
      }
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  return { socket: socketInstance, isConnected };
};
