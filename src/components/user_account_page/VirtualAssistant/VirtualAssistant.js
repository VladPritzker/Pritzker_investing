import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './VirtualAssistant.css'; // Add styles for the assistant icon and modal

const apiUrl = process.env.REACT_APP_API_URL;

const VirtualAssistant = ({ userId }) => {  // Accept userId as a prop
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
    const [isAssistantOpen, setIsAssistantOpen] = useState(false); // To toggle modal visibility
    const chatWindowRef = useRef(null); // Reference to the chat window for auto-scrolling

    // Auto-scroll to the bottom when new messages are added
    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === '') return;
    
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: 'user', text: input },
        ]);
    
        setInput('');
        setIsLoading(true);
    
        try {
            const response = await axios.post(`${apiUrl}/api/assistant/`, {
              message: input,
              messages: messages.concat({ sender: 'user', text: input }),
              user_id: userId,
            });
        
            const replyText = response.data.reply || response.data.message || 'No response from assistant.';
        
            setMessages(prevMessages => [
              ...prevMessages,
              { sender: 'assistant', text: replyText },
            ]);
        
        } catch (error) {
          console.error('Error communicating with the assistant:', error);
          setMessages(prevMessages => [
            ...prevMessages,
            {
              sender: 'assistant',
              text: 'Sorry, there was an error. Please try again later.',
            },
          ]);
        } finally {
          setIsLoading(false);
        }
    };
    

    
    
    return (
        <div className="virtual-assistant-container">
            {/* Icon to trigger the assistant modal */}
            <div className="assistant-icon" onClick={() => setIsAssistantOpen(true)}>
            ❔
            </div>

            {/* Modal for Virtual Assistant */}
            {isAssistantOpen && (
                <div className="assistant-modal">
                    <div className="assistant-modal-header">
                        <h3>Pritzker assistant</h3>
                        <i className="AI_close_button" onClick={() => setIsAssistantOpen(false)}>
                            &times;
                        </i>
                    </div>
                    <div className="chat-window" ref={chatWindowRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className="message assistant">Assistant is typing...</div>}
                    </div>
                    <div className="input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') sendMessage();
                            }}
                            disabled={isLoading} // Disable input when assistant is responding
                        />
                        <button className='AI_button' onClick={sendMessage} disabled={isLoading || input.trim() === ''}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualAssistant;
