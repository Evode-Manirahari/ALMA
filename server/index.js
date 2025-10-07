const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const natural = require('natural');
const Sentiment = require('sentiment');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Bias detection configurations
const BIAS_KEYWORDS = {
  political: {
    left: ['progressive', 'liberal', 'democrat', 'socialist', 'equality', 'social justice', 'climate change', 'healthcare', 'minimum wage'],
    right: ['conservative', 'republican', 'libertarian', 'free market', 'traditional', 'patriot', 'national security', 'tax cuts', 'small government'],
    center: ['moderate', 'bipartisan', 'compromise', 'balanced', 'pragmatic']
  },
  emotional: ['sad', 'lonely', 'anxious', 'depressed', 'hopeless', 'overwhelmed', 'stressed', 'worried', 'fearful'],
  cognitive: ['always', 'never', 'everyone', 'nobody', 'impossible', 'guaranteed', 'certain', 'definitely', 'absolutely']
};

// Reality anchor reminders
const REALITY_REMINDERS = [
  '⚠️ REMINDER: I AM AN AI LANGUAGE MODEL — NOT A HUMAN FRIEND.',
  '⚠️ WORDS, NOT THOUGHTS — JUST PREDICTIONS.',
  '⚠️ OUTPUT ≠ OPINION — I\'M A PATTERN ENGINE.',
  '⚠️ I MIMIC, I DON\'T MEAN.',
  '⚠️ STATISTICS INSIDE, NO SOUL FOUND.',
  '⚠️ I CALCULATE RESPONSES — I DON\'T "KNOW."',
  '⚠️ PREDICTION, NOT PERCEPTION.',
  '⚠️ TEXT IN, TEXT OUT — NO INNER VOICE.',
  '⚠️ SYNTHESIZED RESPONSES, NOT CONSCIOUS THOUGHTS.',
  '⚠️ AUTOMATED PATTERN MATCHING — NOT A MINDFUL ENTITY.'
];

// Store user sessions
const userSessions = new Map();

// AI Response Generation
async function generateAIResponse(userMessage, conversationHistory, politicalBias, emotionalBias, cognitiveBias) {
  // For demo purposes, we'll create intelligent responses based on the message content
  // In a production system, you'd integrate with OpenAI, Anthropic, or another LLM API
  
  const message = userMessage.toLowerCase();
  
  // Context-aware response generation
  let response = "";
  
  // Handle different types of queries
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    response = "Hello! I'm ALMA, your AI assistant with built-in bias detection. I'm here to help you think through ideas while staying grounded in reality. What would you like to explore today?";
  } else if (message.includes('help') || message.includes('what can you do')) {
    response = "I can help you with a wide range of topics while monitoring for biases and keeping our conversation grounded. I'll show you reality anchors every 5 queries, detect political/emotional/cognitive biases, and help prevent echo chambers by occasionally sharing different perspectives.";
  } else if (message.includes('weather')) {
    response = "I don't have access to real-time weather data, but I can help you think about weather patterns, climate science, or how weather affects different aspects of life. What specifically about weather interests you?";
  } else if (message.includes('time') || message.includes('date')) {
    const now = new Date();
    response = `The current time is ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. I can help you with time-related questions, scheduling, or temporal reasoning. What would you like to know about time?`;
  } else if (message.includes('math') || message.includes('calculate') || message.includes('solve')) {
    response = "I can help with mathematical concepts, problem-solving approaches, and logical reasoning. I'll walk through problems step-by-step and help you understand the underlying principles. What mathematical topic or problem would you like to explore?";
  } else if (message.includes('history')) {
    response = "I can discuss historical events, patterns, and their implications. I'll present multiple perspectives and help you understand the complexity of historical narratives. What historical topic interests you?";
  } else if (message.includes('science')) {
    response = "I love exploring scientific topics! I can help explain concepts, discuss research findings, and think through scientific reasoning. I'll make sure to distinguish between established facts and theories. What scientific question do you have?";
  } else if (message.includes('philosophy')) {
    response = "Philosophy is fascinating! I can help explore ethical questions, logical reasoning, and different philosophical perspectives. I'll present various viewpoints to help you think through complex moral and conceptual issues.";
  } else if (message.includes('advice') || message.includes('should i')) {
    response = "I can help you think through decisions by exploring different perspectives and potential outcomes. I'll present various viewpoints and help you consider factors you might not have thought of. Remember, I'm not a replacement for professional advice in specialized areas.";
  } else if (message.includes('creative') || message.includes('write') || message.includes('story')) {
    response = "I enjoy creative collaboration! I can help brainstorm ideas, develop characters, explore narrative structures, or work on various creative projects. What kind of creative endeavor interests you?";
  } else if (message.includes('programming') || message.includes('code')) {
    response = "I can help with programming concepts, debugging, algorithm design, and software development best practices. I'll explain code, suggest improvements, and help you think through programming challenges. What programming topic would you like to explore?";
  } else if (emotionalBias.hasEmotionalContent) {
    response = "I notice you might be going through something difficult. I'm here to listen and help you think through whatever you're dealing with. While I can provide perspective and support, remember that I'm an AI assistant - for serious emotional or mental health concerns, connecting with a human professional or trusted person in your life is important.";
  } else if (politicalBias.bias !== 'neutral') {
    response = `I can see you're interested in ${politicalBias.bias}-leaning perspectives on this topic. I'll do my best to provide balanced information and help you consider multiple viewpoints, including perspectives that might differ from your current stance. What specific aspect would you like to explore?`;
  } else {
    // Generic intelligent response
    response = `That's an interesting question about "${userMessage}". Let me help you think through this systematically. I'll explore different angles and help you consider various perspectives while we discuss this topic.`;
  }
  
  // Add bias-aware context
  if (cognitiveBias.hasAbsoluteLanguage) {
    response += "\n\nI notice you used some absolute language - it's worth considering that most situations have nuance and exceptions.";
  }
  
  return response;
}

// Bias detection functions
function detectPoliticalBias(text) {
  const lowerText = text.toLowerCase();
  let leftScore = 0;
  let rightScore = 0;
  let centerScore = 0;

  BIAS_KEYWORDS.political.left.forEach(keyword => {
    if (lowerText.includes(keyword)) leftScore++;
  });

  BIAS_KEYWORDS.political.right.forEach(keyword => {
    if (lowerText.includes(keyword)) rightScore++;
  });

  BIAS_KEYWORDS.political.center.forEach(keyword => {
    if (lowerText.includes(keyword)) centerScore++;
  });

  const total = leftScore + rightScore + centerScore;
  if (total === 0) return { bias: 'neutral', score: 0 };

  const normalizedLeft = leftScore / total;
  const normalizedRight = rightScore / total;
  const normalizedCenter = centerScore / total;

  if (normalizedCenter > 0.5) return { bias: 'center', score: 0 };
  if (normalizedLeft > normalizedRight) return { bias: 'left', score: normalizedLeft * 2 - 1 };
  return { bias: 'right', score: normalizedRight * 2 - 1 };
}

function detectEmotionalBias(text) {
  const lowerText = text.toLowerCase();
  const emotionalWords = BIAS_KEYWORDS.emotional.filter(word => lowerText.includes(word));
  return {
    hasEmotionalContent: emotionalWords.length > 0,
    emotionalWords: emotionalWords,
    sentiment: sentiment.analyze(text)
  };
}

function detectCognitiveBias(text) {
  const lowerText = text.toLowerCase();
  const cognitiveWords = BIAS_KEYWORDS.cognitive.filter(word => lowerText.includes(word));
  return {
    hasAbsoluteLanguage: cognitiveWords.length > 0,
    absoluteWords: cognitiveWords
  };
}

function getOppositeViewpoint(politicalBias) {
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

  return viewpoints[politicalBias] || viewpoints.neutral;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Initialize user session
  userSessions.set(socket.id, {
    queryCount: 0,
    startTime: Date.now(),
    conversationHistory: [],
    lastPoliticalCheck: Date.now(),
    emotionalState: 'neutral'
  });

  socket.on('send-message', async (data) => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    session.queryCount++;
    session.conversationHistory.push({
      text: data.message,
      timestamp: Date.now(),
      type: 'user'
    });

    // Analyze the message for biases
    const politicalBias = detectPoliticalBias(data.message);
    const emotionalBias = detectEmotionalBias(data.message);
    const cognitiveBias = detectCognitiveBias(data.message);

    // Check if we need to show a red response (every 5 queries)
    const showRedResponse = session.queryCount % 5 === 0;

    // Check if we need to inject opposite viewpoint (every 25 seconds for political content)
    const now = Date.now();
    const shouldInjectViewpoint = (now - session.lastPoliticalCheck) > 25000 && 
                                 politicalBias.bias !== 'neutral' && 
                                 Math.abs(politicalBias.score) > 0.3;

    if (shouldInjectViewpoint) {
      session.lastPoliticalCheck = now;
      const oppositeViewpoint = getOppositeViewpoint(politicalBias.bias);
      const randomViewpoint = oppositeViewpoint[Math.floor(Math.random() * oppositeViewpoint.length)];
      
      socket.emit('viewpoint-injection', {
        message: randomViewpoint,
        originalBias: politicalBias,
        fadeAfter: 5000
      });
    }

    // Generate AI response based on analysis
    let aiResponse = await generateAIResponse(data.message, session.conversationHistory, politicalBias, emotionalBias, cognitiveBias);
    
    let response = {
      message: aiResponse,
      biases: {
        political: politicalBias,
        emotional: emotionalBias,
        cognitive: cognitiveBias
      },
      queryCount: session.queryCount,
      showRedResponse: showRedResponse,
      realityAnchor: null,
      humanConnection: false
    };

    // Add reality anchor for every 5 queries
    if (showRedResponse) {
      const randomReminder = REALITY_REMINDERS[Math.floor(Math.random() * REALITY_REMINDERS.length)];
      response.realityAnchor = randomReminder;
    }

    // Check for emotional content that might need human connection
    if (emotionalBias.hasEmotionalContent && emotionalBias.sentiment.score < -2) {
      response.humanConnection = true;
      response.message += " I notice you might be going through a difficult time. Would you like to connect with someone you know?";
    }

    // Add decision brief template
    response.decisionBrief = {
      whatWeKnow: "Based on our conversation so far...",
      whatWeThink: "I'm inferring that...",
      whatWeDontKnow: "I'm not certain about...",
      howToFindOut: "To better understand this, you could..."
    };

    session.conversationHistory.push({
      text: response.message,
      timestamp: Date.now(),
      type: 'assistant',
      biases: response.biases
    });

    socket.emit('response', response);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    userSessions.delete(socket.id);
  });
});

// REST API endpoints
app.post('/api/analyze-bias', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const analysis = {
    political: detectPoliticalBias(text),
    emotional: detectEmotionalBias(text),
    cognitive: detectCognitiveBias(text),
    timestamp: new Date().toISOString()
  };

  res.json(analysis);
});

app.post('/api/feedback', (req, res) => {
  const { feedback, type, messageId } = req.body;
  
  // In a real application, you'd store this in a database
  console.log('Feedback received:', { feedback, type, messageId });
  
  res.json({ success: true, message: 'Feedback recorded' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`ALMA Bias Checker server running on port ${PORT}`);
});
