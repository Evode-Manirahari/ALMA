# ALMA Demo Guide

## 🤖 How to Test ALMA AI Assistant

ALMA is an intelligent AI assistant with built-in bias detection and reality anchors. Test these features while having natural conversations!

### 1. **Basic AI Conversation**
Try these starter messages:
- "Hello, I'm ALMA!"
- "What can you help me with?"
- "Tell me about artificial intelligence"
- "Help me solve a math problem"

### 2. **Query Counting & Reality Anchors**
- Send 5 messages to ALMA
- On the 5th message, you'll see a red response with a reality anchor
- Watch the query counter in the bottom-right corner
- Notice the tally marks in the bottom-left corner

### 3. **Bias Detection**
Try these sample messages to test different bias types:

#### Political Bias (Left)
```
"I think we need more progressive policies to address climate change and social inequality."
```

#### Political Bias (Right)
```
"We should focus on free market solutions and traditional values to solve our problems."
```

#### Emotional Content
```
"I'm feeling really sad and anxious about the current situation."
```

#### Absolute Language
```
"This is absolutely impossible and everyone knows it will never work."
```

### 4. **Echo Chamber Prevention**
- Have a 30+ second conversation about political topics
- After 25 seconds of political discussion, you'll see a viewpoint injection bubble
- The bubble shows an opposing perspective and fades away after 5 seconds

### 5. **Decision Brief Template**
- Ask complex questions like "Should we implement universal healthcare?"
- ALMA will provide a structured decision brief with:
  - What we know (Cited)
  - What we think (Inference)
  - What we don't know (Unverified)
  - How to find out (Next steps)

### 6. **Emotional Support**
- Use emotional language like "I'm depressed and need help"
- ALMA will detect the emotional content
- A modal will appear offering to connect you with real people
- You can choose to open email or messages apps

### 7. **Reality Anchors**
- Every 5 queries, you'll see reality reminders like:
  - "⚠️ REMINDER: I AM AN AI LANGUAGE MODEL — NOT A HUMAN FRIEND."
  - "⚠️ WORDS, NOT THOUGHTS — JUST PREDICTIONS."
  - "⚠️ I CALCULATE RESPONSES — I DON'T "KNOW.""

### 8. **User Feedback**
- Click "Helpful" or "Not helpful" buttons on assistant responses
- This helps ALMA learn and improve over time

## 🎨 UI Features to Notice

### Color Scheme
- **Green**: Primary actions, success states, nature-inspired
- **Beige**: Background, warm, comfortable
- **White**: Clean, pure, readable content

### Animations
- Smooth fade-in for new messages
- Bounce animation for query counter
- Slide-up for tally marks
- Pulse animation for reality anchors

### Responsive Design
- Try resizing your browser window
- Test on mobile devices
- UI adapts to different screen sizes

## 🧪 Test Scenarios

### Scenario 1: Academic Research
1. Ask: "What are the pros and cons of renewable energy?"
2. Notice the balanced decision brief
3. Continue asking follow-up questions
4. Watch for bias detection and reality anchors

### Scenario 2: Emotional Support
1. Express feelings of stress or anxiety
2. Notice emotional bias detection
3. Trigger the human connection modal
4. Test the email/messages integration

### Scenario 3: Political Discussion
1. Start a conversation about a political topic
2. Express strong opinions one way
3. Continue for 30+ seconds
4. Watch for viewpoint injection bubbles

### Scenario 4: Long Conversation
1. Ask 10+ questions in a row
2. Notice the query counter and tallies
3. See multiple reality anchor reminders
4. Experience the full bias detection system

## 🔍 What to Look For

### Bias Indicators
- **Political**: Shows left/right/center bias with scores
- **Emotional**: Highlights emotional content and sentiment
- **Cognitive**: Identifies absolute language patterns

### Reality Anchors
- **Visual**: Red responses every 5 queries
- **Text**: Reality reminder messages
- **Structure**: Decision brief templates
- **Reflection**: "What do we know vs what did we assume?"

### User Experience
- **Friendly**: Warm, approachable design
- **Informative**: Clear bias indicators and explanations
- **Supportive**: Human connection options
- **Educational**: Helps users think critically

## 🎯 Expected Behaviors

1. **Immediate Response**: ALMA responds quickly to messages
2. **Bias Detection**: Accurately identifies different types of bias
3. **Visual Feedback**: Clear indicators for all features
4. **Smooth Animations**: Polished, professional feel
5. **Helpful Guidance**: Constructive suggestions and support

## 🚀 Getting Started

1. Run `./start.sh` or `npm run dev`
2. Open http://localhost:3000
3. Start chatting with ALMA
4. Try the test scenarios above
5. Explore all the features!

---

**Happy testing!** 🎉 ALMA is designed to help you think more critically and stay grounded in reality while exploring ideas.
