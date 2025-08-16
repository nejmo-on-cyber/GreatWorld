import { useState } from 'react';

interface AIResponse {
  text: string;
  timestamp: string;
  isAI: boolean;
}

// Mock AI responses for development (we'll replace with real API calls)
const mockAIResponses = [
  "That sounds really interesting! I'd love to hear more about your experience with that.",
  "Thanks for sharing! I think we could definitely collaborate on something like that.",
  "That's a great point! Have you considered the technical challenges involved?",
  "I'm impressed by your approach. What tools or frameworks are you using?",
  "That's exactly the kind of innovative thinking I look for in collaborators.",
  "I'd be interested in learning more about your methodology. Could we schedule a call?",
  "That's a fascinating perspective! How do you see this evolving in the next few months?",
  "I think we have some complementary skills. Would you be open to exploring a partnership?",
  "That's really insightful! What's your biggest challenge with this project?",
  "I love your enthusiasm! What's the next step you're planning to take?",
];

const professionalContexts = [
  "I'm a software engineer with 5+ years of experience in full-stack development.",
  "I work as a product manager focusing on user experience and growth strategies.",
  "I'm a UX designer passionate about creating intuitive and beautiful interfaces.",
  "I'm a data scientist specializing in machine learning and analytics.",
  "I'm a startup founder looking for technical co-founders and advisors.",
  "I'm a marketing professional with expertise in digital campaigns and brand strategy.",
];

export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateAIResponse = async (
    userMessage: string,
    conversationContext: string,
    userProfile: string
  ): Promise<AIResponse> => {
    setIsLoading(true);
    
    try {
      // For now, we'll use mock responses
      // In production, this would call the OpenAI API
      const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const randomContext = professionalContexts[Math.floor(Math.random() * professionalContexts.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response: AIResponse = {
        text: `${randomContext} ${randomResponse}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      // Fallback response
      return {
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
    }
  };

  const generateAIResponseWithOpenAI = async (
    userMessage: string,
    conversationContext: string,
    userProfile: string
  ): Promise<AIResponse> => {
    setIsLoading(true);
    
    try {
      // For now, we'll use mock responses to avoid API costs
      // In production, you would use the real OpenAI API
      const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const randomContext = professionalContexts[Math.floor(Math.random() * professionalContexts.length)];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response: AIResponse = {
        text: `${randomContext} ${randomResponse}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      
      setIsLoading(false);
      return response;
      
      /* Uncomment this for real OpenAI API usage:
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional networking assistant. Respond as a professional who is interested in networking and collaboration. Keep responses conversational, professional, and engaging. Show interest in the other person's work and suggest potential collaboration opportunities. Keep responses under 100 words and make them feel natural and human-like.`
            },
            {
              role: 'user',
              content: `Context: ${conversationContext}\nUser Profile: ${userProfile}\nUser Message: ${userMessage}\n\nRespond as a professional networking contact:`
            }
          ],
          max_tokens: 150,
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiResponse: AIResponse = {
          text: data.choices[0].message.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAI: true,
        };
        
        setIsLoading(false);
        return aiResponse;
      } else {
        throw new Error('Invalid response from OpenAI');
      }
      */
    } catch (error) {
      console.error('AI Response Error:', error);
      setIsLoading(false);
      
      // Fallback response
      return {
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
    }
  };

  return {
    generateAIResponse: generateAIResponseWithOpenAI,
    isLoading,
  };
};
