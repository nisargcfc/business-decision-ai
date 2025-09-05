# 🤖 Business Decision AI Agent

A sophisticated multi-agent AI system that helps businesses make data-driven decisions through intelligent analysis and strategic recommendations.

## ✨ Features

### 🧠 Multi-Agent Architecture
- **Research Agent** 🔍 - Market & Industry Analysis
- **Analysis Agent** 📊 - Risk & Opportunity Assessment  
- **Strategy Agent** 🎯 - Action Plan Generation
- **Validation Agent** ✅ - Quality Assurance & Validation

### 🚀 Key Capabilities
- **Intelligent Business Analysis** - AI-powered market research and competitor analysis
- **Risk Assessment** - Comprehensive risk and opportunity evaluation
- **Strategic Planning** - Data-driven action plans with KPIs
- **Real-time Processing** - Live agent status updates and progress tracking
- **Fallback System** - Graceful handling of API failures with sample data

### 🛠️ Technical Stack
- **Frontend**: React 18, Tailwind CSS
- **AI Integration**: Claude Sonnet API
- **Deployment**: Vercel
- **Styling**: Modern UI with responsive design

## 🎮 Example Scenarios

### Scenario 1: AI/SaaS Business
- **Business Goal**: Launch AI-powered customer support platform for European SMBs
- **Industry**: SaaS
- **Budget**: €300K - €500K
- **Timeline**: 9 months
- **Constraints**: Small team of 8 people, must comply with GDPR, limited marketing budget, need to compete with established players like Zendesk

### Scenario 2: Healthcare AI
- **Business Goal**: Launch AI diagnostic tool for radiology departments in Irish hospitals
- **Industry**: Healthcare
- **Budget**: €800K - €1.2M
- **Timeline**: 18 months
- **Constraints**: Medical device regulations, data privacy requirements, need clinical validation studies, limited hospital budgets

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- API key (optional - works with fallback data)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/business-decision-ai.git

# Navigate to project directory
cd business-decision-ai

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
REACT_APP_API_KEY=your_api_key_here
```

**Note**: The app works without an API key using fallback data for demonstration purposes.

## 🎮 How to Use

1. **Enter Business Context**:
   - Business Goal
   - Industry
   - Budget
   - Timeline
   - Constraints

2. **Watch AI Agents Work**:
   - Research Agent analyzes market conditions
   - Analysis Agent assesses risks and opportunities
   - Strategy Agent creates action plans
   - Validation Agent ensures quality

3. **Get Comprehensive Results**:
   - Market analysis with competitor insights
   - Risk assessment with mitigation strategies
   - Strategic recommendations with KPIs
   - Validation feedback and improvements

## 🏗️ Architecture

```
Input → Research Agent → Analysis Agent → Strategy Agent → Validation Agent → Results
```

Each agent operates independently with specialized prompts and structured JSON output, creating a robust decision-making pipeline.

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Project Structure

```
src/
├── App.js          # Main application with multi-agent logic
├── App.css         # Custom styles
├── index.js        # React entry point
└── index.css       # Tailwind CSS imports
```

## 🌟 Agent Development Skills Demonstrated

- **Multi-Agent System Design** - Coordinated AI agents with specialized roles
- **API Integration** - Robust error handling and fallback systems
- **State Management** - Complex agent status tracking and workflow orchestration
- **User Experience** - Real-time progress updates and intuitive interface
- **Production Ready** - Environment variable handling, build optimization, deployment

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
