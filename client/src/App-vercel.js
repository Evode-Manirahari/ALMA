import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  AlertTriangle, 
  Heart, 
  Brain, 
  Users, 
  MessageCircle,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [queryCount, setQueryCount] = useState(0);
  const [tallies, setTallies] = useState([]);
  const [showHumanConnection, setShowHumanConnection] = useState(false);
  const [viewpointMessage, setViewpointMessage] = useState(null);
  const [lastPoliticalCheck, setLastPoliticalCheck] = useState(Date.now());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        type: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      
      try {
        const response = await fetch('/api/analyze-bias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: inputMessage, 
            queryCount: queryCount 
          }),
        });

        const data = await response.json();
        
        const assistantMessage = {
          id: Date.now() + 1,
          text: data.message,
          type: 'assistant',
          biases: data.biases,
          queryCount: data.queryCount,
          showRedResponse: data.showRedResponse,
          realityAnchor: data.realityAnchor,
          humanConnection: data.humanConnection,
          decisionBrief: data.decisionBrief,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setQueryCount(data.queryCount);

        // Update tallies (every 5 queries)
        if (data.queryCount % 5 === 0) {
          setTallies(prev => [...prev, { id: Date.now(), queryCount: data.queryCount }]);
        }

        // Show human connection modal if needed
        if (data.humanConnection) {
          setShowHumanConnection(true);
        }

        // Check for viewpoint injection (every 25 seconds for political content)
        const now = Date.now();
        if ((now - lastPoliticalCheck) > 25000 && 
            data.biases.political.bias !== 'neutral' && 
            Math.abs(data.biases.political.score) > 0.3) {
          
          setLastPoliticalCheck(now);
          const oppositeViewpoint = getOppositeViewpoint(data.biases.political.bias);
          
          setViewpointMessage({
            message: oppositeViewpoint,
            originalBias: data.biases.political,
            fadeAfter: 5000
          });
          
          setTimeout(() => {
            setViewpointMessage(null);
          }, 5000);
        }

      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
          type: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }

      setInputMessage('');
    }
  };

  const getOppositeViewpoint = (politicalBias) => {
    const viewpoints = {
      left: [
        "Consider the perspective that free markets and individual responsibility can drive innovation and economic growth.",
        "Some argue that traditional values and institutions provide stability and social cohesion.",
        "There's a viewpoint that limited government intervention allows for more personal freedom and choice."
      ],
      right: [
        "Consider the perspective that collective action and social programs can address systemic inequalities.",
        "Some argue that progressive policies can lead to greater social mobility and opportunity.",
        "There's a viewpoint that government intervention can protect vulnerable populations and ensure fairness."
      ],
      center: [
        "Consider that extreme positions on either side might miss important nuances in complex issues.",
        "Some argue that finding common ground requires understanding multiple perspectives.",
        "There's value in questioning whether current approaches are working effectively."
      ],
      neutral: [
        "Consider exploring different perspectives on this topic to gain a more complete understanding.",
        "Multiple viewpoints exist on this issue - what might the other side argue?",
        "It might be valuable to examine this topic from various angles."
      ]
    };

    const selectedViewpoints = viewpoints[politicalBias] || viewpoints.neutral;
    return selectedViewpoints[Math.floor(Math.random() * selectedViewpoints.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendFeedback = async (messageId, feedback) => {
    // In a real app, you'd send this to an API endpoint
    console.log('Feedback:', { messageId, feedback });
  };

  const openHumanConnection = (type) => {
    if (type === 'email') {
      window.open('mailto:?subject=I need to talk', '_blank');
    } else if (type === 'messages') {
      window.open('sms:', '_blank');
    }
    setShowHumanConnection(false);
  };

  const renderBiasIndicators = (biases) => {
    if (!biases) return null;

    return (
      <div className="bias-indicators">
        {biases.political && biases.political.bias !== 'neutral' && (
          <span className={`bias-indicator bias-political-${biases.political.bias}`}>
            {biases.political.bias} bias ({biases.political.score.toFixed(2)})
          </span>
        )}
        {biases.emotional && biases.emotional.hasEmotionalContent && (
          <span className="bias-indicator bias-emotional">
            emotional content
          </span>
        )}
        {biases.cognitive && biases.cognitive.hasAbsoluteLanguage && (
          <span className="bias-indicator bias-cognitive">
            absolute language
          </span>
        )}
      </div>
    );
  };

  const renderDecisionBrief = (brief) => {
    if (!brief) return null;

    return (
      <div className="decision-brief">
        <h3>📋 Decision Brief</h3>
        <section>
          <h4>What we know:</h4>
          <p>{brief.whatWeKnow}</p>
        </section>
        <section>
          <h4>What we think:</h4>
          <p>{brief.whatWeThink}</p>
        </section>
        <section>
          <h4>What we don't know:</h4>
          <p>{brief.whatWeDontKnow}</p>
        </section>
        <section>
          <h4>How to find out:</h4>
          <p>{brief.howToFindOut}</p>
        </section>
      </div>
    );
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Brain className="logo-icon" />
              <h1>ALMA</h1>
              <span className="tagline">AI Assistant</span>
            </div>
            <div className="connection-status connected">
              <div className="status-dot"></div>
              Connected
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="chat-container">
            <div className="messages-container">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.type} ${message.showRedResponse ? 'red-response' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-content">
                    <div className="message-header">
                      {message.type === 'user' ? (
                        <Heart className="message-icon" />
                      ) : (
                        <Brain className="message-icon" />
                      )}
                      <span className="message-type">
                        {message.type === 'user' ? 'You' : 'ALMA'}
                      </span>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="message-text">
                      {message.text}
                    </div>

                    {renderBiasIndicators(message.biases)}
                    {renderDecisionBrief(message.decisionBrief)}

                    {message.realityAnchor && (
                      <div className="reality-anchor">
                        <AlertTriangle className="anchor-icon" />
                        {message.realityAnchor}
                      </div>
                    )}

                    {message.type === 'assistant' && (
                      <div className="feedback-buttons">
                        <button 
                          className="feedback-btn positive"
                          onClick={() => sendFeedback(message.id, 'positive')}
                        >
                          <CheckCircle size={16} />
                          Helpful
                        </button>
                        <button 
                          className="feedback-btn negative"
                          onClick={() => sendFeedback(message.id, 'negative')}
                        >
                          <XCircle size={16} />
                          Not helpful
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... I'm ALMA, your AI assistant with bias detection!"
                  className="message-input"
                  rows="3"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="send-button"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Query Counter */}
      {queryCount > 0 && (
        <motion.div 
          className="query-counter"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {queryCount}
        </motion.div>
      )}

      {/* Tally System */}
      {tallies.length > 0 && (
        <div className="tally-container">
          <div className="tally-header">
            <MessageCircle size={16} />
            <span>Conversation Length</span>
          </div>
          <div className="tally">
            {tallies.map((tally) => (
              <motion.div
                key={tally.id}
                className="tally-mark"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <div className="tally-count">
            {tallies.length * 5} queries
          </div>
        </div>
      )}

      {/* Viewpoint Injection */}
      <AnimatePresence>
        {viewpointMessage && (
          <motion.div
            className="viewpoint-bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Users className="bubble-icon" />
            <p>{viewpointMessage.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Human Connection Modal */}
      <AnimatePresence>
        {showHumanConnection && (
          <motion.div
            className="human-connection-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHumanConnection(false)}
          >
            <motion.div
              className="human-connection-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="connection-icon" />
              <h3>Connect with Someone You Know</h3>
              <p>I notice you might be going through a difficult time. Sometimes it helps to talk to someone you trust.</p>
              <div className="connection-options">
                <button 
                  className="btn btn-primary"
                  onClick={() => openHumanConnection('email')}
                >
                  <ExternalLink size={16} />
                  Open Email
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => openHumanConnection('messages')}
                >
                  <MessageCircle size={16} />
                  Open Messages
                </button>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowHumanConnection(false)}
              >
                Continue with ALMA
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
