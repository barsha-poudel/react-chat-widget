import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  const API_URL = 'http://52.66.8.242:8088/chat';

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (query) => {
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'student2@example.com',
          query: query,
          course_id: 'AI101'
        })
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: data.message,
        suggestions: data.suggestions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "Something went wrong while contacting the server. Please try again later.",
        suggestions: []
      }]);
      console.error("API Error:", error);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className="chat-widget">
      <header className="chat-header">
        <h2>Chat Bot</h2>
        <p>Powered by OIAI</p>
      </header>

      <main ref={chatWindowRef} className="chat-window">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} onSuggestionClick={handleSendMessage} />
        ))}
        {isLoading && <TypingIndicator />}
      </main>

      <footer className="chat-footer">
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            autoComplete="off"
            required
          />
          <button type="submit">✈️</button>
        </form>
      </footer>
    </div>
  );
}

const ChatMessage = ({ message, onSuggestionClick }) => {
  const { sender, text, suggestions } = message;
  return (
    <div className={`message-container ${sender}-container`}>
      <div className={`message ${sender}-message`}>{text}</div>
      {suggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map(sugg => (
            <button key={sugg.id} className="suggestion-btn" onClick={() => onSuggestionClick(sugg.question)}>
              {sugg.question}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="message ai-message typing-indicator">
    <span></span><span></span><span></span>
  </div>
);

export default App;
