import { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../../useGlobalContext';
import microphone from "../../../../public/icons/microphone.svg"
export function ChatWindow() {
    const { messages, sendMessageToAI } = useGlobalContext();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Send message to AI via global context
        sendMessageToAI(inputValue);
        setInputValue('');
    };

    const handleMicClick = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Speech recognition not supported in this browser.');
            return;
        }
        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;
            recognitionRef.current.continuous = true;
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[event.resultIndex][0].transcript;
                setInputValue(prev => prev + transcript);
            };
            recognitionRef.current.onerror = (event) => {
                alert('Speech recognition error: ' + event.error);
                setIsListening(false);
            };
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    return (
        <div className="mt-6 flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                }`}
                        >
                            <p className="text-sm">{message.text}</p>
                            {message.isLoading && (
                                <div className="mt-2 flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSubmit} className="mt-6 flex-shrink-0">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Generate lofi beats mixed with a bit of jazz..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={handleMicClick}
                        className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isListening ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        aria-label="Start voice input"
                    >
                        {/* Simple mic SVG icon */}
                                    <img src={microphone} alt="microphone" />
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={!inputValue.trim()}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
