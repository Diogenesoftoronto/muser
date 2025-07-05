import { createContext, useContext, useState, useCallback } from 'react';
import { callAI } from './components/Backend';

const GlobalContext = createContext();

export function useGlobalContext() {
    const context = useContext(GlobalContext);
    if (!context) {
        // Return a default context to prevent errors during initial render
        throw new Error('useGlobalContext must be used within a GlobalContextProvider');
    }

    return context;
}

export function GlobalContextProvider({ children }) {
    const [messages, setMessages] = useState([
        {
            id: 0,
            text: "welcome to muser, a new vibe coding music platform to generate music. Chat to get started.",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const [replContext, setReplContext] = useState(null);

    const addMessage = useCallback((message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const sendMessageToAI = useCallback(async (userMessage) => {
        try {
            // Add user message to chat
            const userMsg = {
                id: Date.now(),
                text: userMessage,
                sender: 'user',
                timestamp: new Date()
            };
            addMessage(userMsg);

            // Add loading message
            const loadingMsg = {
                id: Date.now() + 1,
                text: "Generating music code...",
                sender: 'bot',
                timestamp: new Date(),
                isLoading: true
            };
            addMessage(loadingMsg);

            // Call AI
            const response = await callAI([userMessage]);
            const parsedResponse = JSON.parse(response);
            console.log("parsedResponse", parsedResponse);
            // Remove loading message and add AI response
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [...filtered, {
                    id: Date.now() + 2,
                    text: parsedResponse.reasoning,
                    sender: 'model',
                    timestamp: new Date()
                }];
            });

            // Apply code to REPL editor if available
            if (replContext?.editorRef?.current) {
                try {
                    if (parsedResponse.code) {
                        replContext.editorRef.current.setCode(parsedResponse.code);
                        replContext.handleEvaluate();
                    }
                } catch (error) {
                    console.error('Failed to parse AI response:', error);
                }
            }

        } catch (error) {
            console.error('Error calling AI:', error);

            // Remove loading message and add error message
            setMessages(prev => {
                const filtered = prev.filter(msg => !msg.isLoading);
                return [...filtered, {
                    id: Date.now() + 2,
                    text: "Sorry, I encountered an error while generating the music code. Please try again.",
                    sender: 'bot',
                    timestamp: new Date()
                }];
            });
        }
    }, [addMessage, replContext]);

    const setReplEditorContext = useCallback((context) => {
        setReplContext(context);
    }, []);

    const value = {
        messages,
        addMessage,
        sendMessageToAI,
        setReplEditorContext,
        replContext
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
} 