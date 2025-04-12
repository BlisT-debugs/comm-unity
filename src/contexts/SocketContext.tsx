
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Define the context types
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Socket.io server URL - replace with your actual Socket.io server URL when deployed
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();

  // Initialize socket connection when the component mounts and user is authenticated
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create new socket connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        userId: user.id,
        username: user.username || user.email
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Set up event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to chat server');
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Disconnected from chat server');
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      toast.error(`Connection error: ${err.message}`);
    });

    newSocket.on('users_online', (users) => {
      setOnlineUsers(users);
    });

    // Save socket instance
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  // Function to join a room (e.g., for community or issue discussions)
  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join_room', roomId);
      console.log(`Joined room: ${roomId}`);
    }
  };

  // Function to leave a room
  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave_room', roomId);
      console.log(`Left room: ${roomId}`);
    }
  };

  // Function to send a message to a specific room
  const sendMessage = (roomId: string, message: string) => {
    if (!socket || !isConnected || !user) return;
    
    const messageData = {
      roomId,
      message,
      userId: user.id,
      username: user.username || user.email,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('send_message', messageData);
  };

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        isConnected, 
        onlineUsers,
        joinRoom,
        leaveRoom,
        sendMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};
