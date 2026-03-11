import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../app/api';

export interface Room {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  createdAt: string;
  createdBy: { id: string; username: string };
  members: { id: string; username: string }[];
}

interface RoomsState {
  rooms: Room[];
  activeRoom: Room | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  activeRoom: null,
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk('rooms/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/rooms');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch rooms');
  }
});

export const createRoom = createAsyncThunk(
  'rooms/create',
  async (data: { name: string; description?: string; isPrivate?: boolean }, { rejectWithValue }) => {
    try {
      const res = await api.post('/rooms', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create room');
    }
  },
);

export const joinRoom = createAsyncThunk('rooms/join', async (roomId: string, { rejectWithValue }) => {
  try {
    const res = await api.post(`/rooms/${roomId}/join`);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to join room');
  }
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setActiveRoom(state, action: PayloadAction<Room | null>) {
      state.activeRoom = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => { state.loading = true; })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.unshift(action.payload);
        state.activeRoom = action.payload;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        const idx = state.rooms.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.rooms[idx] = action.payload;
        else state.rooms.unshift(action.payload);
        state.activeRoom = action.payload;
      });
  },
});

export const { setActiveRoom } = roomsSlice.actions;
export default roomsSlice.reducer;
