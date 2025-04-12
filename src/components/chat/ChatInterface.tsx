
import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Users, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  roomId: string;
  message: string;
  userId: string;
  username: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  roomId: string;
  roomName: string;
  roomType: 'community' | 'issue' | 'discussion';
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ roomId, roomName, roomType }) => {
  const { socket, isConnected, onlineUsers, joinRoom, leaveRoom, sendMessage } = useSocket();
  const { user, profile } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Join the room when component mounts
  useEffect(() => {
    if (isConnected) {
      joinRoom(roomId);
    }
    
    // Cleanup when component unmounts
    return () => {
      leaveRoom(roomId);
    };
  }, [isConnected, roomId]);
  
  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    
    const handleReceiveMessage = (data: Message) => {
      if (data.roomId === roomId) {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    };
    
    socket.on('receive_message', handleReceiveMessage);
    
    // Load previous messages (this would come from your database)
    const loadMessages = async () => {
      // This is a placeholder - in a real app you would fetch from API/DB
      console.log('Loading messages for room:', roomId);
      // setMessages([...historical messages would go here]);
    };
    
    loadMessages();
    
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, roomId]);
  
  // Scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected || !user) return;
    
    // Send the message
    sendMessage(roomId, message);
    
    // Get display name
    const displayName = profile?.username || user.email || user.id.substring(0, 8);
    
    // Add message to local state (optimistic update)
    const newMessage: Message = {
      id: Date.now().toString(),
      roomId,
      message,
      userId: user.id,
      username: displayName,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
  };
  
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };
  
  // Helper function to get the first character of a name safely
  const getAvatarFallback = (name: string): string => {
    return name && name.length > 0 ? name[0].toUpperCase() : '?';
  };
  
  return (
    <Card className="flex flex-col h-[500px] shadow-md">
      <CardHeader className="p-3 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-lg">{roomName} Chat</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> Connected
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span> Disconnected
                </span>
              )}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowUsers(!showUsers)}
            className="relative"
          >
            <Users className="h-5 w-5" />
            {onlineUsers.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                {onlineUsers.length}
              </Badge>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-grow relative">
          <ScrollArea className="h-[380px] p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                  No messages yet. Be the first to send a message!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-2 ${msg.userId === user?.id ? 'justify-end' : ''}`}
                  >
                    {msg.userId !== user?.id && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{getAvatarFallback(msg.username)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[70%] ${msg.userId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      {msg.userId !== user?.id && (
                        <p className="text-xs font-medium mb-1">{msg.username}</p>
                      )}
                      <p className="break-words">{msg.message}</p>
                      <p className="text-xs opacity-70 text-right mt-1">
                        {formatMessageTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>
        
        {showUsers && (
          <div className="border-l w-48 p-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Online Users
            </h4>
            <ScrollArea className="h-[340px]">
              <div className="space-y-2">
                {onlineUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No users online</p>
                ) : (
                  onlineUsers.map((username) => (
                    <div key={username} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-sm truncate">{username}</span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
      
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected || !user}
            className="flex-1"
          />
          <Button type="submit" disabled={!isConnected || !user || !message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
