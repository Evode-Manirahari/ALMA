// Vercel serverless function for bias analysis

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
    emotionalWords: emotionalWords
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

// AI Response Generation
function generateAIResponse(userMessage, queryCount) {
  const message = userMessage.toLowerCase();
  let response = "";
  
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
  } else {
    response = `That's an interesting question about "${userMessage}". Let me help you think through this systematically. I'll explore different angles and help you consider various perspectives while we discuss this topic.`;
  }
  
  return response;
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, queryCount = 0 } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Detect biases
  const politicalBias = detectPoliticalBias(message);
  const emotionalBias = detectEmotionalBias(message);
  const cognitiveBias = detectCognitiveBias(message);

  // Generate AI response
  const aiResponse = generateAIResponse(message, queryCount);

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

  const showRedResponse = (queryCount + 1) % 5 === 0;
  const realityAnchor = showRedResponse ? 
    REALITY_REMINDERS[Math.floor(Math.random() * REALITY_REMINDERS.length)] : null;

  // Check for emotional content that might need human connection
  const humanConnection = emotionalBias.hasEmotionalContent && emotionalBias.emotionalWords.length > 1;

  // Add bias-aware context
  let finalResponse = aiResponse;
  if (cognitiveBias.hasAbsoluteLanguage) {
    finalResponse += "\n\nI notice you used some absolute language - it's worth considering that most situations have nuance and exceptions.";
  }

  // Decision brief template
  const decisionBrief = {
    whatWeKnow: "Based on our conversation so far...",
    whatWeThink: "I'm inferring that...",
    whatWeDontKnow: "I'm not certain about...",
    howToFindOut: "To better understand this, you could..."
  };

  const response = {
    message: finalResponse,
    biases: {
      political: politicalBias,
      emotional: emotionalBias,
      cognitive: cognitiveBias
    },
    queryCount: queryCount + 1,
    showRedResponse,
    realityAnchor,
    humanConnection,
    decisionBrief,
    timestamp: new Date().toISOString()
  };

  res.status(200).json(response);
}
