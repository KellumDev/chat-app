import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  roomId: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface TypingUser {
  userId: string;
  username: string;
}

interface ChatState {
  messages: Record<string, Message[]>; // keyed by roomId
  typingUsers: Record<string, TypingUser[]>; // keyed by roomId
  onlineUsers: string[]; // array of userIds
}

const initialState: ChatState = {
  messages: {},
  typingUsers: {},
  onlineUsers: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRoomMessages(state, action: PayloadAction<{ roomId: string; messages: Message[] }>) {
      state.messages[action.payload.roomId] = action.payload.messages;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const { roomId } = action.payload;
      if (!state.messages[roomId]) state.messages[roomId] = [];
      state.messages[roomId].push(action.payload);
    },
    setTyping(state, action: PayloadAction<{ roomId: string; user: TypingUser; isTyping: boolean }>) {
      const { roomId, user, isTyping } = action.payload;
      if (!state.typingUsers[roomId]) state.typingUsers[roomId] = [];
      if (isTyping) {
        const exists = state.typingUsers[roomId].find((u) => u.userId === user.userId);
        if (!exists) state.typingUsers[roomId].push(user);
      } else {
        state.typingUsers[roomId] = state.typingUsers[roomId].filter((u) => u.userId !== user.userId);
      }
    },
    setUserOnline(state, action: PayloadAction<string>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    setUserOffline(state, action: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
    },
    clearRoomMessages(state, action: PayloadAction<string>) {
      delete state.messages[action.payload];
    },
  },
});

export const {
  setRoomMessages,
  addMessage,
  setTyping,
  setUserOnline,
  setUserOffline,
  clearRoomMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
