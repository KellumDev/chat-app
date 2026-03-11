import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, FormErrorMessage,
  Heading, Input, Text, VStack, Alert, AlertIcon, useColorModeValue,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from './authSlice';
import { connectSocket } from '../../app/socket';

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((state) => state.auth);
  const bg = useColorModeValue('white', 'gray.800');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (data: LoginForm) => {
    dispatch(clearError());
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) {
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
          <Heading size="md" textAlign="center">Sign In</Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
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

              <Button
                type="submit"
                colorScheme="blue"
                w="full"
                isLoading={loading}
                loadingText="Signing in..."
                mt={2}
              >
                Sign In
              </Button>
            </VStack>
          </form>

          <Text textAlign="center" fontSize="sm" color="gray.500">
            No account?{' '}
            <Link to="/register">
              <Text as="span" color="brand.500" fontWeight="semibold">Register</Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
