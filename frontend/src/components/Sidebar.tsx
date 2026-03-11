import React, { useEffect, useState } from 'react';
import {
  Box, VStack, Text, Button, HStack, Badge, Avatar,
  Divider, IconButton, useDisclosure, Tooltip,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks.ts';
import { fetchRooms, setActiveRoom, joinRoom } from '../features/rooms/roomsSlice';
import { logout } from '../features/auth/authSlice';
import { disconnectSocket } from '../app/socket';
import CreateRoomModal from '../features/rooms/CreateRoomModal';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { rooms, activeRoom } = useAppSelector((state) => state.rooms);
  const { user } = useAppSelector((state) => state.auth);
  const { onlineUsers } = useAppSelector((state) => state.chat);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleRoomClick = (room: any) => {
    dispatch(setActiveRoom(room));
  };

  const handleJoin = (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation();
    dispatch(joinRoom(roomId));
  };

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
  };

  const isUserMember = (room: any) =>
    room.members?.some((m: any) => m.id === user?.id);

  return (
    <Box
      w="260px"
      minW="260px"
      h="100vh"
      bg="gray.900"
      borderRight="1px"
      borderColor="gray.700"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.700">
        <Text fontSize="xl" fontWeight="bold" color="brand.500">💬 ChatApp</Text>
      </Box>

      {/* Rooms */}
      <Box flex={1} overflowY="auto" p={3}>
        <HStack justify="space-between" mb={3}>
          <Text fontSize="xs" fontWeight="semibold" color="gray.400" textTransform="uppercase" letterSpacing="wider">
            Rooms
          </Text>
          <Tooltip label="Create Room">
            <IconButton
              aria-label="Create room"
              icon={<AddIcon />}
              size="xs"
              colorScheme="blue"
              variant="ghost"
              onClick={onOpen}
            />
          </Tooltip>
        </HStack>

        <VStack spacing={1} align="stretch">
          {rooms.map((room) => {
            const isMember = isUserMember(room);
            const isActive = activeRoom?.id === room.id;

            return (
              <Box
                key={room.id}
                p={2}
                borderRadius="md"
                cursor="pointer"
                bg={isActive ? 'blue.700' : 'transparent'}
                _hover={{ bg: isActive ? 'blue.700' : 'gray.700' }}
                onClick={() => handleRoomClick(room)}
                transition="background 0.15s"
              >
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Text color="gray.400">#</Text>
                    <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'normal'} color={isActive ? 'white' : 'gray.300'} noOfLines={1}>
                      {room.name}
                    </Text>
                  </HStack>
                  {!isMember && (
                    <Button size="xs" colorScheme="blue" variant="outline" onClick={(e) => handleJoin(e, room.id)}>
                      Join
                    </Button>
                  )}
                </HStack>
                {room.description && (
                  <Text fontSize="xs" color="gray.500" ml={5} noOfLines={1}>{room.description}</Text>
                )}
              </Box>
            );
          })}
          {rooms.length === 0 && (
            <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
              No rooms yet. Create one!
            </Text>
          )}
        </VStack>
      </Box>

      {/* User Footer */}
      <Box p={3} borderTop="1px" borderColor="gray.700">
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Box position="relative">
              <Avatar size="sm" name={user?.username} />
              <Box
                position="absolute"
                bottom={0}
                right={0}
                w={2.5}
                h={2.5}
                bg="green.400"
                borderRadius="full"
                border="2px solid"
                borderColor="gray.900"
              />
            </Box>
            <Box>
              <Text fontSize="sm" fontWeight="semibold" color="white">{user?.username}</Text>
              <Text fontSize="xs" color="gray.500">Online</Text>
            </Box>
          </HStack>
          <Button size="xs" variant="ghost" colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>
      </Box>

      <CreateRoomModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default Sidebar;
