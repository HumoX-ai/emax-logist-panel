# Chat API Implementation Guide

This document describes the updated chat API implementation with proper pagination and socket.io integration.

## API Endpoints

### 1. Get Chats
**GET** `https://back.emaxb.uz/api/seller/chats`

**Parameters:**
- `offset` (number, optional): Page offset (default: 0)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "chats": [
    {
      "_id": "6864cfb4748713294019a79f",
      "userId": "6814a70ad2d263f8d958a381",
      "orderId": "6860eb40c5162ac9f6bd8059",
      "orderNumber": 29425,
      "sellerId": "68140d4bf9e882094b3546be",
      "isDeleted": false,
      "createdAt": "2025-07-02T06:20:37.002Z",
      "updatedAt": "2025-07-02T06:25:58.988Z",
      "__v": 0,
      "lastMessage": "hi",
      "user": {
        "_id": "6814a70ad2d263f8d958a381",
        "fullName": "Humoyun",
        "phone": "+998935980530"
      }
    }
  ],
  "totalCount": 4
}
```

### 2. Get Messages
**GET** `https://back.emaxb.uz/api/seller/messages`

**Parameters:**
- `orderId` (string, required): Order ID for the chat
- `offset` (number, optional): Page offset (default: 0)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "messages": [
    {
      "_id": "6864cfcb748713294019a7a6",
      "userId": "6814a70ad2d263f8d958a381",
      "orderId": "6860eb40c5162ac9f6bd8059",
      "chatId": "6864cfb4748713294019a79f",
      "orderNumber": 29425,
      "sellerId": "68140d4bf9e882094b3546be",
      "text": "salom",
      "senderType": "USER",
      "isDeleted": false,
      "createdAt": "2025-07-02T06:20:59.284Z",
      "updatedAt": "2025-07-02T06:20:59.284Z",
      "__v": 0
    }
  ],
  "totalCount": 1
}
```

### 3. Send Message
**POST** `https://back.emaxb.uz/api/seller/messages`

**Body:**
```json
{
  "chatId": "6864cfb4748713294019a79f",
  "text": "string"
}
```

**Response:**
Returns the created message object.

## Implementation Features

### 1. Pagination Logic
- **Chats**: Load 20 chats per request
- **Messages**: Load 50 messages per request
- Proper pagination with offset/limit parameters
- "Load More" buttons for incremental loading

### 2. Socket.io Integration
- Base URL: `https://back.emaxb.uz`
- Auto-connect with authentication token
- Real-time message updates
- Chat list updates when new messages arrive

### 3. Cache Management
- RTK Query for state management
- Optimistic updates for sent messages
- Proper cache invalidation
- Tag-based cache updates

### 4. UI Components
- Modern chat interface with sidebar
- Real-time connection status indicator
- Search functionality for chats
- Responsive design
- Loading states and skeleton screens

## Files Updated

### API Layer
- `/src/lib/api/chatApi.ts` - Main API definitions with pagination
- `/src/lib/useSocket.ts` - Socket.io hook with authentication
- `/src/stores/store.ts` - Added chat API to Redux store

### Components
- `/src/features/chat/components/ModernChatInterface.tsx` - Main chat component
- `/src/app/dashboard/chat/page.tsx` - Updated chat page

### Hooks (Optional)
- `/src/hooks/useChatList.ts` - Chat list pagination hook
- `/src/hooks/useMessages.ts` - Messages pagination hook

## Key Features

### Pagination
```typescript
// Chats pagination
const { data: chatsData } = useGetChatsQuery({ 
  offset: chatsPage, 
  limit: 20 
});

// Messages pagination
const { data: messagesData } = useGetMessagesQuery({ 
  orderId: selectedChat?.orderId || '', 
  offset: messagesPage, 
  limit: 50 
});
```

### Socket Integration
```typescript
// Socket connection with auth
const { socket, isConnected } = useSocket();

// Event handlers
socket.on('new_message', handleNewMessage);
socket.on('chat_updated', handleChatUpdate);
```

### Optimistic Updates
```typescript
// Automatically update cache when sending messages
onQueryStarted: async ({ chatId, text }, { dispatch, queryFulfilled }) => {
  const { data: newMessage } = await queryFulfilled;
  
  // Update messages cache
  dispatch(
    chatApi.util.updateQueryData('getMessages', { orderId: newMessage.orderId }, (draft) => {
      draft.messages.push(newMessage);
      draft.totalCount += 1;
    })
  );
}
```

## Usage Instructions

1. **Install Dependencies**: Socket.io-client is already installed
2. **Configure Redux Store**: Chat API is added to the store
3. **Use the Component**: Import `ModernChatInterface` in your chat page
4. **Authentication**: The socket automatically uses the auth token

## Socket Events

The implementation listens for these socket events:
- `new_message` - When a new message is received
- `chat_updated` - When chat metadata is updated

## Error Handling

- Network errors are handled gracefully
- Loading states prevent duplicate requests
- Optimistic updates with rollback on failure
- Silent error handling for socket connections

## Performance Optimizations

- Incremental loading for both chats and messages
- Efficient re-renders with proper React keys
- Debounced search functionality
- Lazy loading of older messages
- Auto-scroll to new messages

This implementation provides a robust, scalable chat system with proper pagination, real-time updates, and excellent user experience.
