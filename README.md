# ALMA - AI Assistant with Bias Detection

A friendly AI assistant that helps you think through ideas while automatically detecting biases to ensure equality, inclusion, and satisfaction. ALMA helps users remain grounded in reality while exploring ideas through AI without spiraling into self-confirming or hallucinatory loops.

## 🌟 Features

### Core Functionality
- **AI Assistant**: Intelligent conversational AI that responds to a wide range of topics
- **Bias Detection**: Analyzes text for political, emotional, and cognitive biases
- **Reality Anchors**: Implements "cite → then say" workflow with decision brief templates
- **Query Tracking**: Visual indicators for conversation length and depth
- **Echo Chamber Prevention**: Injects opposing viewpoints during lengthy political discussions
- **Emotional Support**: Connects users with human contacts when needed
- **User Feedback**: Collects opinions to refine the system continuously

### Reality Anchor System
- Every 5 queries: Shows reality reminders in red
- Decision brief template with structured thinking:
  - What we know (Cited)
  - What we think (Inference)
  - What we don't know (Unverified)
  - How to find out (Next tests/searches)

### Bias Detection Types
1. **Political Bias**: Left/Right/Center detection with scoring
2. **Emotional Bias**: Detects emotional language and sentiment
3. **Cognitive Bias**: Identifies absolute language and overconfidence

### User Interface Features
- **Query Counter**: Visual tally system showing conversation length
- **Viewpoint Injection**: Periodic opposite perspective bubbles
- **Human Connection**: Modal for connecting with real people
- **Feedback System**: Thumbs up/down for continuous improvement

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd /Users/evodemanirahari/Desktop/ALMA
   ```

2. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

3. **Start the development servers**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Individual Commands

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Start only the backend server
npm run server

# Start only the frontend client
npm run client

# Build for production
npm run build
```

## 🏗️ Project Structure

```
ALMA/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main application component
│   │   ├── App.css        # Component-specific styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Node.js backend
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package configuration
└── README.md
```

## 🎨 Design Philosophy

ALMA uses a friendly, approachable design with:
- **Color Palette**: Green (#4ade80), Beige (#f5f5dc), White (#ffffff)
- **Typography**: Clean, readable fonts with good contrast
- **Animations**: Smooth transitions and subtle feedback
- **Accessibility**: High contrast, keyboard navigation, screen reader friendly

## 🔧 Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **Framer Motion**: Smooth animations and transitions
- **Socket.IO Client**: Real-time communication
- **Lucide React**: Beautiful, consistent icons
- **CSS3**: Custom styling with CSS variables

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **Socket.IO**: Real-time bidirectional communication
- **Natural**: Natural language processing
- **Sentiment**: Sentiment analysis
- **Compromise**: Text parsing and analysis

## 🧠 How It Works

### Bias Detection Algorithm

1. **Political Bias Detection**:
   - Analyzes keywords associated with left/right/center political positions
   - Scores bias on a scale from -1 (far left) to +1 (far right)
   - Triggers viewpoint injection for extreme positions

2. **Emotional Bias Detection**:
   - Identifies emotional language patterns
   - Uses sentiment analysis to detect mood
   - Triggers human connection modal for negative sentiment

3. **Cognitive Bias Detection**:
   - Detects absolute language ("always", "never", "impossible")
   - Identifies overconfident statements
   - Provides reflection prompts

### Reality Anchors

- **Query Counting**: Every 5 queries triggers a reality reminder
- **Decision Brief**: Structured template for critical thinking
- **Citation System**: Encourages source verification
- **Reflection Prompts**: "What do we know vs what did we assume?"

### Echo Chamber Prevention

- **25-Second Rule**: Evaluates political stance every 25 seconds
- **Viewpoint Injection**: Shows opposing perspectives as fading bubbles
- **Bias Scoring**: Quantifies conversation direction
- **Balanced Responses**: Encourages multiple viewpoints

## 🎯 Use Cases

1. **Educational**: Help students think critically about information
2. **Research**: Assist in balanced analysis of topics
3. **Decision Making**: Support structured thinking processes
4. **Mental Health**: Provide emotional support and human connections
5. **Content Creation**: Ensure balanced, inclusive communication

## 🔮 Future Enhancements

- **Machine Learning**: Improve bias detection with training data
- **Multi-language Support**: Detect biases in multiple languages
- **Custom Bias Categories**: User-defined bias detection rules
- **Integration APIs**: Connect with external fact-checking services
- **Analytics Dashboard**: Track bias patterns over time
- **Mobile App**: Native mobile experience
- **Voice Interface**: Voice command integration

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:
- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by research on cognitive biases and echo chambers
- Built with modern web technologies and best practices
- Designed for accessibility and user experience
- Focused on promoting critical thinking and balanced perspectives

---

**ALMA** - Always Learning, Mindfully Aware
