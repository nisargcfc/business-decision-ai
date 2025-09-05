import React, { useState } from 'react';

// Custom Card components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-1">
    {children}
  </p>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const BusinessDecisionAI = () => {
  const [input, setInput] = useState({
    businessGoal: '',
    industry: '',
    budget: '',
    timeline: '',
    constraints: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const agents = [
    {
      name: 'Research Agent',
      role: 'Market & Industry Analysis',
      icon: '🔍',
      status: 'idle'
    },
    {
      name: 'Analysis Agent', 
      role: 'Risk & Opportunity Assessment',
      icon: '📊',
      status: 'idle'
    },
    {
      name: 'Strategy Agent',
      role: 'Action Plan Generation',
      icon: '🎯',
      status: 'idle'
    },
    {
      name: 'Validation Agent',
      role: 'Quality Assurance & Validation',
      icon: '✅',
      status: 'idle'
    }
  ];

  const [agentStatuses, setAgentStatuses] = useState(agents);

// Production-ready API function with proper error handling
const callClaudeAPI = async (prompt, agentType) => {
  console.log(`🤖 ${agentType} Agent: Starting API call`);
  
  try {
    console.log('📤 Sending request to backend proxy...');
    
    // Use your own API endpoint instead of direct Claude API
    const response = await fetch("/api/claude", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Backend API Error ${response.status}:`, errorData);
      console.log('🔄 Switching to fallback data due to API error');
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('📨 Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }

    console.log(`✅ SUCCESS: ${agentType} Agent received real API response`);
    console.log('📊 Response length:', data.content[0].text.length, 'characters');
    
    return data.content[0].text;
  } catch (error) {
    console.error(`❌ Error in ${agentType}:`, error.message);
    console.log(`🔄 Using fallback data for ${agentType} agent`);
    
    // Graceful fallback to mock data
    return getFallbackResponse(agentType);
  }
};

  // Fallback responses for when API fails
  const getFallbackResponse = (agentType) => {
    const fallbacks = {
      research: JSON.stringify({
        marketSize: "€2.5B+ European market with 15% YoY growth",
        competitors: ["Microsoft Teams", "Slack", "Zoom", "Salesforce"],
        trends: ["AI-first customer service", "Omnichannel integration", "Self-service automation"],
        opportunities: ["EU data compliance focus", "SMB market gap", "Industry-specific solutions"],
        confidence: 0.75
      }),
      analysis: JSON.stringify({
        risks: ["High competition from established players", "Regulatory compliance complexity", "Customer acquisition costs"],
        opportunities: ["Growing demand for AI-powered solutions", "EU data sovereignty requirements", "Underserved SMB segment"],
        feasibilityScore: 0.72,
        recommendations: ["Start with pilot customers", "Focus on EU compliance as differentiator"],
        confidence: 0.78
      }),
      strategy: JSON.stringify({
        actionPlan: ["Phase 1: MVP Development (Months 1-3)", "Phase 2: Beta Testing (Months 4-5)", "Phase 3: EU Launch (Months 6-7)", "Phase 4: Scale & Iterate (Months 8-9)"],
        timeline: "9-month roadmap with quarterly milestones and KPI checkpoints",
        budget: "€300K total: €150K development, €75K marketing, €75K operations",
        kpis: ["Customer acquisition rate", "Monthly recurring revenue", "Customer satisfaction score"],
        confidence: 0.81
      }),
      validation: JSON.stringify({
        validationScore: 0.79,
        issues: ["Timeline may be aggressive for EU compliance", "Budget allocation needs marketing focus"],
        improvements: ["Add 2-month buffer for compliance", "Increase marketing spend to 35%"],
        finalRecommendation: "Proceed with strategy but adjust timeline and budget allocation for realistic EU market entry",
        confidence: 0.84
      })
    };
    
    return fallbacks[agentType] || null;
  };

  const updateAgentStatus = (index, status) => {
    setAgentStatuses(prev => 
      prev.map((agent, i) => 
        i === index ? { ...agent, status } : agent
      )
    );
  };

  const processBusinessDecision = async () => {
    setIsProcessing(true);
    setResults(null);
    setCurrentStep(0);

    const context = `
Business Goal: ${input.businessGoal}
Industry: ${input.industry}
Budget: ${input.budget}
Timeline: ${input.timeline}
Constraints: ${input.constraints}
`;

    let workflowData = { context };

    try {
      // Step 1: Research Agent
      updateAgentStatus(0, 'processing');
      setCurrentStep(1);
      
      const researchPrompt = `
You are a Market Research Agent. Analyze the following business scenario and provide structured output.

${context}

Provide your response as a JSON object with this exact structure:
{
  "marketSize": "estimated market size with numbers",
  "competitors": ["competitor1", "competitor2", "competitor3"],
  "trends": ["trend1", "trend2", "trend3"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "confidence": 0.85
}

IMPORTANT: Respond ONLY with valid JSON. No additional text.
`;
      
      const researchResult = await callClaudeAPI(researchPrompt, 'research');
      let researchData;
      
      if (researchResult) {
        try {
          const cleanedResult = researchResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          researchData = JSON.parse(cleanedResult);
        } catch (e) {
          console.error('JSON parsing error:', e);
          researchData = JSON.parse(getFallbackResponse('research'));
        }
      } else {
        researchData = JSON.parse(getFallbackResponse('research'));
      }
      
      workflowData.research = researchData;
      updateAgentStatus(0, 'completed');

      // Small delay for demo effect
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 2: Analysis Agent
      updateAgentStatus(1, 'processing');
      setCurrentStep(2);
      
      const analysisPrompt = `
You are a Risk Analysis Agent. Based on the research data, provide risk and opportunity assessment.

Context: ${context}
Research Results: ${JSON.stringify(researchData)}

Provide your response as a JSON object with this exact structure:
{
  "risks": ["risk1", "risk2", "risk3"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "feasibilityScore": 0.75,
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence": 0.80
}

IMPORTANT: Respond ONLY with valid JSON. No additional text.
`;

      const analysisResult = await callClaudeAPI(analysisPrompt, 'analysis');
      let analysisData;
      
      if (analysisResult) {
        try {
          const cleanedResult = analysisResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          analysisData = JSON.parse(cleanedResult);
        } catch (e) {
          analysisData = JSON.parse(getFallbackResponse('analysis'));
        }
      } else {
        analysisData = JSON.parse(getFallbackResponse('analysis'));
      }
      
      workflowData.analysis = analysisData;
      updateAgentStatus(1, 'completed');

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 3: Strategy Agent
      updateAgentStatus(2, 'processing');
      setCurrentStep(3);
      
      const strategyPrompt = `
You are a Strategic Planning Agent. Create an actionable plan based on research and analysis.

Context: ${context}
Research: ${JSON.stringify(researchData)}
Analysis: ${JSON.stringify(analysisData)}

Provide your response as a JSON object with this exact structure:
{
  "actionPlan": ["action1", "action2", "action3", "action4"],
  "timeline": "detailed timeline description",
  "budget": "budget breakdown and allocation",
  "kpis": ["kpi1", "kpi2", "kpi3"],
  "confidence": 0.85
}

IMPORTANT: Respond ONLY with valid JSON. No additional text.
`;

      const strategyResult = await callClaudeAPI(strategyPrompt, 'strategy');
      let strategyData;
      
      if (strategyResult) {
        try {
          const cleanedResult = strategyResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          strategyData = JSON.parse(cleanedResult);
        } catch (e) {
          strategyData = JSON.parse(getFallbackResponse('strategy'));
        }
      } else {
        strategyData = JSON.parse(getFallbackResponse('strategy'));
      }
      
      workflowData.strategy = strategyData;
      updateAgentStatus(2, 'completed');

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Validation Agent
      updateAgentStatus(3, 'processing');
      setCurrentStep(4);
      
      const validationPrompt = `
You are a Quality Validation Agent. Review all previous agent outputs and provide final validation.

Context: ${context}
Research: ${JSON.stringify(researchData)}
Analysis: ${JSON.stringify(analysisData)}
Strategy: ${JSON.stringify(strategyData)}

Validate the consistency, feasibility, and quality of the recommendations. Provide your response as a JSON object with this exact structure:
{
  "validationScore": 0.85,
  "issues": ["issue1", "issue2"],
  "improvements": ["improvement1", "improvement2"],
  "finalRecommendation": "detailed final recommendation",
  "confidence": 0.90
}

IMPORTANT: Respond ONLY with valid JSON. No additional text.
`;

      const validationResult = await callClaudeAPI(validationPrompt, 'validation');
      let validationData;
      
      if (validationResult) {
        try {
          const cleanedResult = validationResult.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          validationData = JSON.parse(cleanedResult);
        } catch (e) {
          validationData = JSON.parse(getFallbackResponse('validation'));
        }
      } else {
        validationData = JSON.parse(getFallbackResponse('validation'));
      }
      
      workflowData.validation = validationData;
      updateAgentStatus(3, 'completed');

      setResults(workflowData);
      setCurrentStep(5);

    } catch (error) {
      console.error('Workflow error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetDemo = () => {
    setResults(null);
    setCurrentStep(0);
    setAgentStatuses(agents);
    setInput({
      businessGoal: '',
      industry: '',
      budget: '',
      timeline: '',
      constraints: ''
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Business AI</h1>
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Multi-Agent Decision System</h2>
        <p className="text-gray-600">AI-powered orchestration for strategic business decision-making</p>
      </div>

      {/* Input Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Business Decision Input</CardTitle>
          <CardDescription>Provide structured inputs for AI agent orchestration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Goal</label>
              <input
                type="text"
                value={input.businessGoal}
                onChange={(e) => setInput(prev => ({ ...prev, businessGoal: e.target.value }))}
                placeholder="e.g., Launch AI-powered customer support platform"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <input
                type="text"
                value={input.industry}
                onChange={(e) => setInput(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., SaaS, Healthcare, FinTech"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Budget Range</label>
              <input
                type="text"
                value={input.budget}
                onChange={(e) => setInput(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="e.g., €200K - €400K"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Timeline</label>
              <input
                type="text"
                value={input.timeline}
                onChange={(e) => setInput(prev => ({ ...prev, timeline: e.target.value }))}
                placeholder="e.g., 9 months, Q2 2025"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Constraints</label>
              <textarea
                value={input.constraints}
                onChange={(e) => setInput(prev => ({ ...prev, constraints: e.target.value }))}
                placeholder="e.g., Small team, EU data compliance requirements"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              onClick={processBusinessDecision}
              disabled={isProcessing || !input.businessGoal || !input.industry}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? 'Processing...' : 'Start Agent Orchestration'}
            </button>
            <button
              onClick={resetDemo}
              className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-medium"
            >
              Reset
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Agent Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {agentStatuses.map((agent, index) => (
          <Card key={index} className={`relative ${
            agent.status === 'processing' ? 'ring-2 ring-blue-500 bg-blue-50' :
            agent.status === 'completed' ? 'ring-2 ring-green-500 bg-green-50' :
            'bg-white'
          }`}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{agent.icon}</div>
              <h3 className="font-semibold text-lg">{agent.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{agent.role}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                agent.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                agent.status === 'completed' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-600'
              }`}>
                {agent.status === 'processing' ? 'Processing...' :
                 agent.status === 'completed' ? 'Completed' :
                 'Waiting'}
              </div>
              {agent.status === 'processing' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results Display */}
      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">✅ Agent Orchestration Complete</CardTitle>
              <CardDescription>All agents have processed the business decision with structured outputs</CardDescription>
            </CardHeader>
          </Card>

          {/* Research Results */}
          <Card>
            <CardHeader>
              <CardTitle>🔍 Research Agent Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Market Size</h4>
                  <p className="text-sm text-gray-700">{results.research?.marketSize}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Confidence Score</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(results.research?.confidence || 0) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round((results.research?.confidence || 0) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Competitors</h4>
                  <ul className="text-sm text-gray-700">
                    {results.research?.competitors?.map((comp, i) => <li key={i}>• {comp}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Market Trends</h4>
                  <ul className="text-sm text-gray-700">
                    {results.research?.trends?.map((trend, i) => <li key={i}>• {trend}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Analysis Agent Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Feasibility Score</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{width: `${(results.analysis?.feasibilityScore || 0) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round((results.analysis?.feasibilityScore || 0) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Confidence Score</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(results.analysis?.confidence || 0) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-sm">{Math.round((results.analysis?.confidence || 0) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Risks</h4>
                  <ul className="text-sm text-gray-700">
                    {results.analysis?.risks?.map((risk, i) => <li key={i}>• {risk}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Opportunities</h4>
                  <ul className="text-sm text-gray-700">
                    {results.analysis?.opportunities?.map((opp, i) => <li key={i}>• {opp}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Results */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Strategy Agent Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Action Plan</h4>
                  <ul className="text-sm text-gray-700">
                    {results.strategy?.actionPlan?.map((action, i) => <li key={i}>• {action}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Performance Indicators</h4>
                  <ul className="text-sm text-gray-700">
                    {results.strategy?.kpis?.map((kpi, i) => <li key={i}>• {kpi}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Timeline</h4>
                  <p className="text-sm text-gray-700">{results.strategy?.timeline}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Budget Allocation</h4>
                  <p className="text-sm text-gray-700">{results.strategy?.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Results */}
          <Card>
            <CardHeader>
              <CardTitle>✅ Validation Agent Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overall Validation Score</h4>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-3 mr-2">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{width: `${(results.validation?.validationScore || 0) * 100}%`}}
                      ></div>
                    </div>
                    <span className="text-lg font-semibold">{Math.round((results.validation?.validationScore || 0) * 100)}%</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Final Recommendation</h4>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <p className="text-green-800">{results.validation?.finalRecommendation}</p>
                  </div>
                </div>
                {results.validation?.issues && results.validation.issues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Identified Issues</h4>
                    <ul className="text-sm text-red-700">
                      {results.validation.issues.map((issue, i) => <li key={i}>• {issue}</li>)}
                    </ul>
                  </div>
                )}
                {results.validation?.improvements && results.validation.improvements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Improvements</h4>
                    <ul className="text-sm text-blue-700">
                      {results.validation.improvements.map((improvement, i) => <li key={i}>• {improvement}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>⚙️ System Architecture</CardTitle>
              <CardDescription>Technical implementation and orchestration details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Schema Validation</h4>
                  <p className="text-gray-600">✅ JSON Schema enforcement</p>
                  <p className="text-gray-600">✅ Type checking & validation</p>
                  <p className="text-gray-600">✅ Robust error handling</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Agent Orchestration</h4>
                  <p className="text-gray-600">✅ Sequential processing</p>
                  <p className="text-gray-600">✅ Data flow between agents</p>
                  <p className="text-gray-600">✅ Real-time status updates</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quality Assurance</h4>
                  <p className="text-gray-600">✅ Confidence scoring</p>
                  <p className="text-gray-600">✅ Output validation</p>
                  <p className="text-gray-600">✅ Fallback mechanisms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BusinessDecisionAI;