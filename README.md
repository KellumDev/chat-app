# 💬 ChatApp — Real-time Chat (NestJS + React)

A full-stack real-time chat application built to practice:
- **REST API design** with NestJS
- **WebSockets** with Socket.io
- **State management** with Redux Toolkit
- **Database/ORM** with TypeORM + PostgreSQL
- **Forms & validation** with React Hook Form + class-validator
- **Auth** with JWT + Passport Guards
- **UI** with Chakra UI + Tailwind CSS

---

## 🚀 Getting Started

### 1. Start the Database
```bash
docker-compose up -d
```

### 2. Start the Backend
```bash
cd backend
npm install
npm run start:dev
# Runs on http://localhost:3001
```

### 3. Start the Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 4. Open the App
Visit `http://localhost:5173`, register an account, and start chatting!

---

## 🗂 Project Structure

```
chat-app/
├── docker-compose.yml          # PostgreSQL container
├── backend/                    # NestJS API
│   └── src/
│       ├── main.ts             # Bootstrap, CORS, ValidationPipe
│       ├── app.module.ts       # Root module, TypeORM config
│       ├── auth/               # JWT auth, Passport strategy, Guards
│       ├── users/              # User entity, service, controller
│       ├── rooms/              # Room entity, CRUD, join/leave
│       ├── messages/           # Message entity, history endpoint
│       └── gateway/            # WebSocket gateway (Socket.io)
└── frontend/                   # React + Vite
    └── src/
        ├── app/                # Store, hooks, axios client, socket
        ├── features/
        │   ├── auth/           # Login, Register pages + authSlice
        │   ├── rooms/          # Room list, create modal + roomsSlice
        │   └── chat/           # ChatWindow + chatSlice
        └── components/         # Sidebar, ProtectedRoute
```

---

## 🔌 WebSocket Events

| Event (Client → Server) | Payload | Description |
|---|---|---|
| `room:join` | `{ roomId }` | Join a room socket, receive message history |
| `room:leave` | `{ roomId }` | Leave a room socket |
| `message:send` | `{ roomId, content }` | Send a message |
| `message:typing` | `{ roomId, isTyping }` | Broadcast typing status |

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `messages:history` | `Message[]` | History when joining a room |
| `message:new` | `Message` | New message broadcast |
| `message:typing` | `{ user, isTyping }` | Typing indicator |
| `user:online` | `{ userId, username }` | User connected |
| `user:offline` | `{ userId }` | User disconnected |

---

## 🔐 REST API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, get JWT |

### Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/me` | ✅ | Get current user profile |
| GET | `/api/users` | ✅ | Get all users |

### Rooms
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/rooms` | ✅ | List all public rooms |
| POST | `/api/rooms` | ✅ | Create a room |
| GET | `/api/rooms/:id` | ✅ | Get room details |
| POST | `/api/rooms/:id/join` | ✅ | Join a room |
| POST | `/api/rooms/:id/leave` | ✅ | Leave a room |
| DELETE | `/api/rooms/:id` | ✅ | Delete room (owner only) |

### Messages
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/rooms/:roomId/messages` | ✅ | Get message history |

---

## 🏋️ Features to Add (Practice Ideas)

### Beginner
- [ ] Show member list panel for the active room
- [ ] Display online/offline status badges
- [ ] Message timestamps with hover tooltip
- [ ] Empty state illustration for no rooms

### Intermediate
- [ ] Message pagination / infinite scroll (cursor-based)
- [ ] User profile page with avatar upload
- [ ] Search rooms by name
- [ ] Unread message count badges on rooms

### Advanced
- [ ] Direct Messages (DMs) between users
- [ ] Message reactions (emoji)
- [ ] Reply to a message (threads)
- [ ] Role-based access (admin/moderator)
- [ ] Push notifications (Web Push API)
- [ ] Message search with full-text search (PostgreSQL tsvector)

---

## 🧱 Key Concepts to Review

**NestJS**
- `@Injectable()`, `@Controller()`, `@Module()` decorators
- `@UseGuards()` for route protection
- `@WebSocketGateway()`, `@SubscribeMessage()` for WebSockets
- `@InjectRepository()` for TypeORM injection
- DTOs + `class-validator` for request validation

**React / Redux**
- `createSlice` and `createAsyncThunk` patterns
- `useSelector` / `useDispatch` with typed hooks
- React Hook Form's `register`, `handleSubmit`, `formState`
- Socket.io event subscription in `useEffect` with cleanup

**TypeORM**
- Entity decorators: `@Entity`, `@Column`, `@ManyToOne`, `@ManyToMany`
- Repository pattern: `find`, `findOne`, `save`, `remove`
- Relations: eager vs lazy loading
