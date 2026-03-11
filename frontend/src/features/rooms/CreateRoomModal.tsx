import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, FormControl, FormLabel,
  FormErrorMessage, Input, Textarea, Switch, HStack, Text, VStack,
} from '@chakra-ui/react';
import { useAppDispatch } from '../../app/hooks';
import { createRoom } from './roomsSlice';

interface CreateRoomForm {
  name: string;
  description: string;
  isPrivate: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateRoomForm>();

  const onSubmit = async (data: CreateRoomForm) => {
    const result = await dispatch(createRoom(data));
    if (createRoom.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>Create a Room</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Room Name</FormLabel>
                <Input
                  placeholder="e.g. general, random"
                  {...register('name', {
                    required: 'Room name is required',
                    minLength: { value: 3, message: 'Min 3 characters' },
                    maxLength: { value: 50, message: 'Max 50 characters' },
                  })}
                />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Description (optional)</FormLabel>
                <Textarea
                  placeholder="What's this room about?"
                  rows={3}
                  {...register('description', { maxLength: { value: 200, message: 'Max 200 chars' } })}
                />
              </FormControl>

              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>Private Room</FormLabel>
                  <Switch colorScheme="blue" {...register('isPrivate')} />
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Private rooms won't appear in the room list
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
              Create Room
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;
