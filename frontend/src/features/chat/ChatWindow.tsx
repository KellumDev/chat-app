import React, { useEffect, useRef, useCallback } from 'react';
import {
  Box, Text, VStack, HStack, Avatar, Input, IconButton,
  Spinner, Badge, Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addMessage, setRoomMessages, setTyping } from './chatSlice';
import { getSocket } from '../../app/socket';
import type { Message } from './chatSlice';

interface MessageForm {
  content: string;
}

const ChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeRoom } = useAppSelector((state) => state.rooms);
  const { user } = useAppSelector((state) => state.auth);
  const messages = useAppSelector((state) =>
    activeRoom ? (state.chat.messages[activeRoom.id] || []) : []
  );
  const typingUsers = useAppSelector((state) =>
    activeRoom ? (state.chat.typingUsers[activeRoom.id] || []) : []
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { register, handleSubmit, reset, watch } = useForm<MessageForm>();
  const socket = getSocket();

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join room on socket and listen for events
  useEffect(() => {
    if (!activeRoom) return;

    socket.emit('room:join', { roomId: activeRoom.id });

    const handleHistory = (msgs: Message[]) => {
      dispatch(setRoomMessages({ roomId: activeRoom.id, messages: msgs }));
    };

    const handleNewMessage = (msg: Message) => {
      dispatch(addMessage(msg));
    };

    const handleTyping = (data: { user: { userId: string; username: string }; isTyping: boolean }) => {
      if (data.user.userId !== user?.id) {
        dispatch(setTyping({ roomId: activeRoom.id, user: data.user, isTyping: data.isTyping }));
      }
    };

    socket.on('messages:history', handleHistory);
    socket.on('message:new', handleNewMessage);
    socket.on('message:typing', handleTyping);

    return () => {
      socket.off('messages:history', handleHistory);
      socket.off('message:new', handleNewMessage);
      socket.off('message:typing', handleTyping);
      socket.emit('room:leave', { roomId: activeRoom.id });
    };
  }, [activeRoom?.id]);

  const handleTypingEvent = useCallback(() => {
    if (!activeRoom) return;
    socket.emit('message:typing', { roomId: activeRoom.id, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('message:typing', { roomId: activeRoom.id, isTyping: false });
    }, 2000);
  }, [activeRoom?.id]);

  const onSubmit = (data: MessageForm) => {
    if (!activeRoom || !data.content.trim()) return;
    socket.emit('message:send', { roomId: activeRoom.id, content: data.content.trim() });
    socket.emit('message:typing', { roomId: activeRoom.id, isTyping: false });
    clearTimeout(typingTimeoutRef.current);
    reset();
  };

  if (!activeRoom) {
    return (
      <Flex flex={1} align="center" justify="center" bg="gray.800" direction="column" gap={3}>
        <Text fontSize="4xl">💬</Text>
        <Text color="gray.400" fontSize="lg">Select a room to start chatting</Text>
        <Text color="gray.600" fontSize="sm">Pick a room from the sidebar or create a new one</Text>
      </Flex>
    );
  }

  return (
    <Box flex={1} display="flex" flexDirection="column" bg="gray.800" h="100vh">
      {/* Room Header */}
      <Box px={6} py={4} borderBottom="1px" borderColor="gray.700" bg="gray.850">
        <HStack>
          <Text color="gray.400" fontSize="lg">#</Text>
          <Text fontWeight="bold" color="white" fontSize="lg">{activeRoom.name}</Text>
          {activeRoom.description && (
            <>
              <Box w="1px" h={5} bg="gray.600" mx={1} />
              <Text color="gray.500" fontSize="sm">{activeRoom.description}</Text>
            </>
          )}
          <Badge ml="auto" colorScheme="blue" variant="subtle">
            {activeRoom.members?.length || 0} members
          </Badge>
        </HStack>
      </Box>

      {/* Messages */}
      <Box flex={1} overflowY="auto" px={6} py={4}>
        <VStack spacing={4} align="stretch">
          {messages.map((msg, idx) => {
            const isOwn = msg.author.id === user?.id;
            const showAvatar = idx === 0 || messages[idx - 1]?.author.id !== msg.author.id;

            return (
              <HStack key={msg.id} align="flex-start" spacing={3}>
                <Box w={8} flexShrink={0}>
                  {showAvatar && <Avatar size="sm" name={msg.author.username} />}
                </Box>
                <Box flex={1}>
                  {showAvatar && (
                    <HStack spacing={2} mb={0.5}>
                      <Text fontWeight="semibold" fontSize="sm" color={isOwn ? 'blue.300' : 'white'}>
                        {msg.author.username}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </HStack>
                  )}
                  <Text color="gray.200" fontSize="sm" lineHeight="tall">
                    {msg.content}
                  </Text>
                </Box>
              </HStack>
            );
          })}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Typing Indicator */}
      <Box px={6} h={6}>
        {typingUsers.length > 0 && (
          <Text fontSize="xs" color="gray.500" fontStyle="italic">
            {typingUsers.map((u) => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </Text>
        )}
      </Box>

      {/* Message Input */}
      <Box px={6} pb={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack spacing={2}>
            <Input
              placeholder={`Message #${activeRoom.name}`}
              bg="gray.700"
              border="none"
              _focus={{ boxShadow: 'none', bg: 'gray.600' }}
              color="white"
              size="md"
              autoComplete="off"
              {...register('content', { required: true })}
              onKeyDown={handleTypingEvent}
            />
            <IconButton
              aria-label="Send"
              type="submit"
              colorScheme="blue"
              icon={<Text>➤</Text>}
            />
          </HStack>
        </form>
      </Box>
    </Box>
  );
};

export default ChatWindow;
