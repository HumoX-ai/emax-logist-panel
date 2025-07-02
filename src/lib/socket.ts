import { io } from 'socket.io-client';

export const socket = io('https://back.emaxb.uz', {
  transports: ['websocket'],
  autoConnect: false
});
