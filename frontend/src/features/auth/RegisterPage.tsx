import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Text, VStack, Alert, AlertIcon, useColorModeValue,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register as registerUser, clearError } from './authSlice';
import { connectSocket } from '../../app/socket';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const bg = useColorModeValue('white', 'gray.800');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (data: RegisterForm) => {
    dispatch(clearError());
    const { confirmPassword, ...payload } = data;
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      connectSocket();
      navigate('/');
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.900">
      <Box bg={bg} p={8} borderRadius="xl" w="full" maxW="400px" shadow="xl">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" color="brand.500">
            💬 ChatApp
          </Heading>
          <Heading size="md" textAlign="center">Create Account</Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Username</FormLabel>
                <Input
                  placeholder="cooluser123"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Min 3 characters' },
                    maxLength: { value: 20, message: 'Max 20 characters' },
                  })}
                />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  })}
                />
                <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                isLoading={loading}
                loadingText="Creating account..."
                mt={2}
              >
                Create Account
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            Already have an account?{' '}
            <Link to="/login">
              <Text as="span" color="brand.500" fontWeight="semibold">Sign in</Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default RegisterPage;
