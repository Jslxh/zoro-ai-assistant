'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface VoicePromptFormProps {
  formAction: (payload: FormData) => Promise<void> | void; // Mark async possibility explicitly
  currentPromptValue?: string;
}

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      toast({
        variant: 'destructive',
        title: 'Browser unsupported',
        description: 'Speech recognition is not supported in your browser.',
      });
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: 'Listening...',
        description: 'Speak your command.',
        duration: 3000,
      });
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (event.results.length > 0) {
        const transcriptResult = event.results[0][0].transcript;
        setTranscript(transcriptResult);
      }
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      toast({
        variant: 'destructive',
        title: 'Voice Error',
        description: 'There was an error with voice recognition.',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Cleanup on unmount
    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [toast]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Avoid errors if start is called twice quickly
        console.warn('Speech recognition start error:', err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
  };
};

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      aria-label="Send command"
      className="p-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 flex-shrink-0"
    >
      {isSubmitting ? <LoadingDots className="h-5 w-5" /> : <Send className="h-5 w-5" />}
    </Button>
  );
}

export function VoicePromptForm({ formAction, currentPromptValue = '' }: VoicePromptFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [prompt, setPrompt] = useState(currentPromptValue);
  const { transcript, isListening, startListening, stopListening } = useSpeechRecognition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Update prompt whenever new transcript is available
  useEffect(() => {
    if (transcript.trim()) {
      setPrompt(transcript);
    }
  }, [transcript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prevent submit if prompt is empty or only whitespace
    if (!prompt.trim()) {
      toast({
        title: 'Input required',
        description: 'Please enter or speak a command before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(formRef.current!);
    formData.set('prompt', prompt.trim());

    try {
      await formAction(formData);
      toast({
        title: 'Success',
        description: 'Your command was sent successfully.'
      });
      setPrompt('');
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send your command. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3" noValidate>
      <Label htmlFor="prompt" className="sr-only">
        Your Command
      </Label>
      <div
        className={cn(
          'flex items-center space-x-2 p-2 bg-card rounded-xl shadow-lg border border-border/50',
          'focus-within:ring-2 focus-within:ring-primary/70 focus-within:border-primary/50',
          'hover:shadow-xl transition-all duration-300 ease-in-out'
        )}
      >
        <Button
          type="button"
          onClick={handleToggleListening}
          variant="ghost"
          size="icon"
          className={cn(
            'p-2.5 rounded-lg flex-shrink-0 text-primary/80 hover:text-primary hover:bg-primary/10',
            'w-10 h-10 transition-colors duration-200',
            isListening && 'bg-accent/20 text-accent animate-pulse ring-2 ring-accent/50'
          )}
          aria-label={isListening ? 'Stop listening' : 'Start voice command'}
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Input
          id="prompt"
          name="prompt"
          placeholder={isListening ? 'Listening...' : 'Type or say your command'}
          required
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-grow bg-transparent border-0 focus:ring-0 focus:outline-none text-base placeholder:text-muted-foreground h-10 px-2"
          autoComplete="off"
          spellCheck={false}
        />
        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
