import  { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);


  const mockApiCall = async (query) => {
    console.log(`Making API call for query: "${query}"`);
    const successfulResponse = {
      message: "Currently, the app is only available in English. But we are working on making more language options available in the future.",
      suggestions: [
        { id: 41, question: "Do I need internet access to use the app?" },
        { id: 31, question: "How do I download the app on my phone or computer?" }
      ]
    };
    const errorResponse = {
      message: "Sorry, I couldn't find a good match for your query. Please try rephrasing or contact our support at support@oiedu.co.uk.",
      suggestions: []
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    return query.toLowerCase().includes("language") ? successfulResponse : errorResponse;
  };

  const handleSendMessage = async (query) => {
    if (!query) return;

    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsLoading(true);

    const response = await mockApiCall(query);
    
    setMessages(prev => [...prev, {
      sender: 'ai',
      text: response.message,
      suggestions: response.suggestions
    }]);
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