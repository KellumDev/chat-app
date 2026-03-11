import React, { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import Sidebar from './components/Sidebar.tsx';
import ChatWindow from './features/chat/ChatWindow';
import { connectSocket, getSocket } from './app/socket';
import { useAppDispatch } from './app/hooks';
import { setUserOnline, setUserOffline } from './features/chat/chatSlice';

const ChatLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = connectSocket();

    socket.on('user:online', (data: { userId: string }) => {
      dispatch(setUserOnline(data.userId));
    });

    socket.on('user:offline', (data: { userId: string }) => {
      dispatch(setUserOffline(data.userId));
    });

    return () => {
      socket.off('user:online');
      socket.off('user:offline');
    };
  }, []);

  return (
    <Box display="flex" h="100vh" bg="gray.800">
      <Sidebar />
      <ChatWindow />
    </Box>
  );
};

export default ChatLayout;
