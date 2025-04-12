
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';

// Add TypeScript declarations for the Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
  interpretation: string;
  emma: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Define the Speech Recognition constructor
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Add to Window interface
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  isListening?: boolean;
  onListeningChange?: (isListening: boolean) => void;
  placeholder?: string;
  className?: string;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon';
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscriptChange,
  isListening: externalIsListening,
  onListeningChange,
  placeholder = 'Voice input',
  className = '',
  buttonSize = 'default',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { connectionStatus } = useApp();
  const isOffline = connectionStatus === 'offline';
  const interimResultsRef = useRef<string>('');
  
  // Sync with external listening state if provided
  useEffect(() => {
    if (externalIsListening !== undefined) {
      setIsListening(externalIsListening);
    }
  }, [externalIsListening]);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('Speech recognition not supported in this browser');
      return;
    }
    
    // Use the appropriate constructor
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.error('Speech recognition not supported');
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Default language
    
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      // If we have a final transcript, send it to the parent
      if (finalTranscript) {
        onTranscriptChange(finalTranscript);
        interimResultsRef.current = '';
      } else if (interimTranscript) {
        // Store interim results
        interimResultsRef.current = interimTranscript;
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
      
      // Show appropriate error message
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied', {
          description: 'Please allow microphone access to use voice input'
        });
      } else {
        toast.error('Voice recognition error', {
          description: event.error
        });
      }
    };
    
    recognition.onend = () => {
      // Only set isListening to false if we're not in the middle of processing
      if (!isProcessing) {
        setIsListening(false);
        if (onListeningChange) onListeningChange(false);
      }
      
      // If we have interim results when recognition ends, send them as final
      if (interimResultsRef.current) {
        onTranscriptChange(interimResultsRef.current);
        interimResultsRef.current = '';
      }
    };
    
    recognitionRef.current = recognition;
    
    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        
        if (isListening) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            console.error('Error stopping recognition:', error);
          }
        }
      }
    };
  }, [onTranscriptChange, onListeningChange, isProcessing]);
  
  const toggleListening = async () => {
    if (isOffline) {
      toast.error('Voice input unavailable while offline');
      return;
    }
    
    if (isProcessing) return;
    
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
      setIsListening(false);
      if (onListeningChange) onListeningChange(false);
    } else {
      try {
        setIsProcessing(true);
        
        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
            setIsListening(true);
            if (onListeningChange) onListeningChange(true);
            toast.success(placeholder ? `Listening for ${placeholder.toLowerCase()}...` : 'Listening...');
          } catch (error) {
            console.error('Error starting recognition:', error);
            toast.error('Failed to start voice recognition', {
              description: 'Please try again or use text input instead'
            });
          }
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Could not access microphone', {
          description: 'Please check your microphone permissions'
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  return (
    <Button
      type="button"
      onClick={toggleListening}
      variant={isListening ? "destructive" : "outline"}
      size={buttonSize}
      disabled={isProcessing || isOffline}
      className={className}
      title={isListening ? "Stop voice input" : "Start voice input"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceInput;
