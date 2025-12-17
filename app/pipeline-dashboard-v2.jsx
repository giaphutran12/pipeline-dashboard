import React, { useState, useMemo } from 'react';

// Cohort funnel data - how many deals from each cohort reached each stage
const cohortFunnelData = {
  '2024-10': { total: 340, docs: 118, appraisal: 0, submitted: 76, approved: 42, commitment: 38, lawyer: 45, payment: 52, closed: 51, inProgress: 10 },
  '2024-11': { total: 527, docs: 99, appraisal: 1, submitted: 96, approved: 54, commitment: 36, lawyer: 46, payment: 44, closed: 45, inProgress: 225 },
  '2024-12': { total: 684, docs: 69, appraisal: 4, submitted: 65, approved: 42, commitment: 26, lawyer: 29, payment: 33, closed: 32, inProgress: 422 },
  '2025-01': { total: 393, docs: 123, appraisal: 15, submitted: 96, approved: 70, commitment: 43, lawyer: 44, payment: 47, closed: 47, inProgress: 52 },
  '2025-02': { total: 336, docs: 114, appraisal: 31, submitted: 84, approved: 61, commitment: 43, lawyer: 34, payment: 31, closed: 32, inProgress: 39 },
  '2025-03': { total: 642, docs: 136, appraisal: 35, submitted: 110, approved: 62, commitment: 51, lawyer: 53, payment: 60, closed: 60, inProgress: 63 },
  '2025-04': { total: 569, docs: 112, appraisal: 38, submitted: 79, approved: 48, commitment: 33, lawyer: 28, payment: 35, closed: 33, inProgress: 209 },
  '2025-05': { total: 391, docs: 124, appraisal: 31, submitted: 82, approved: 56, commitment: 44, lawyer: 42, payment: 41, closed: 39, inProgress: 65 },
  '2025-06': { total: 386, docs: 139, appraisal: 38, submitted: 113, approved: 77, commitment: 72, lawyer: 63, payment: 61, closed: 61, inProgress: 38 },
  '2025-07': { total: 386, docs: 146, appraisal: 52, submitted: 91, approved: 64, commitment: 57, lawyer: 49, payment: 45, closed: 46, inProgress: 57 },
  '2025-08': { total: 370, docs: 137, appraisal: 53, submitted: 98, approved: 59, commitment: 49, lawyer: 37, payment: 39, closed: 34, inProgress: 42 },
  '2025-09': { total: 347, docs: 152, appraisal: 55, submitted: 84, approved: 45, commitment: 41, lawyer: 37, payment: 29, closed: 23, inProgress: 62 },
  '2025-10': { total: 401, docs: 146, appraisal: 64, submitted: 95, approved: 62, commitment: 46, lawyer: 39, payment: 24, closed: 13, inProgress: 97 },
  '2025-11': { total: 240, docs: 113, appraisal: 34, submitted: 57, approved: 34, commitment: 22, lawyer: 7, payment: 2, closed: 2, inProgress: 103 },
  '2025-12': { total: 32, docs: 20, appraisal: 3, submitted: 5, approved: 1, commitment: 0, lawyer: 0, payment: 0, closed: 0, inProgress: 23 },
};

// Broker data
const brokerData = [
  { broker: 'Broker1', opps: 223, closed: 49, closeRate: 22.0, backward: 37, backwardRate: 16.6 },
  { broker: 'Broker2', opps: 268, closed: 28, closeRate: 10.4, backward: 120, backwardRate: 44.8 },
  { broker: 'Broker3', opps: 263, closed: 22, closeRate: 8.4, backward: 11, backwardRate: 4.2 },
  { broker: 'Broker4', opps: 296, closed: 39, closeRate: 13.2, backward: 45, backwardRate: 15.2 },
  { broker: 'Broker5', opps: 146, closed: 21, closeRate: 14.4, backward: 42, backwardRate: 28.8 },
  { broker: 'Broker7', opps: 238, closed: 15, closeRate: 6.3, backward: 34, backwardRate: 14.3 },
  { broker: 'Broker8', opps: 155, closed: 9, closeRate: 5.8, backward: 3, backwardRate: 1.9 },
  { broker: 'Broker10', opps: 213, closed: 19, closeRate: 8.9, backward: 22, backwardRate: 10.3 },
  { broker: 'Broker11', opps: 156, closed: 16, closeRate: 10.3, backward: 25, backwardRate: 16.0 },
  { broker: 'Broker12', opps: 352, closed: 24, closeRate: 6.8, backward: 32, backwardRate: 9.1 },
  { broker: 'Broker13', opps: 186, closed: 38, closeRate: 20.4, backward: 33, backwardRate: 17.7 },
  { broker: 'Broker14', opps: 148, closed: 27, closeRate: 18.2, backward: 28, backwardRate: 18.9 },
  { broker: 'Broker16', opps: 235, closed: 46, closeRate: 19.6, backward: 7, backwardRate: 3.0 },
  { broker: 'Broker17', opps: 435, closed: 48, closeRate: 11.0, backward: 12, backwardRate: 2.8 },
  { broker: 'Broker18', opps: 177, closed: 18, closeRate: 10.2, backward: 17, backwardRate: 9.6 },
  { broker: 'Broker22', opps: 196, closed: 10, closeRate: 5.1, backward: 91, backwardRate: 46.4 },
  { broker: 'Broker25', opps: 56, closed: 5, closeRate: 8.9, backward: 22, backwardRate: 39.3 },
  { broker: 'Broker34', opps: 119, closed: 16, closeRate: 13.4, backward: 55, backwardRate: 46.2 },
];

// Backward movement data
const backwardData = [
  { from: 'Submitted to Lender', to: 'Application Taken', count: 204, topBroker: 'Broker22', topCount: 57 },
  { from: 'Documents Received', to: 'Application Taken', count: 100, topBroker: 'Broker2', topCount: 26 },
  { from: 'Approved', to: 'Submitted to Lender', count: 87, topBroker: 'Broker2', topCount: 34 },
  { from: 'Closed Won', to: 'Awaiting Payment(s)', count: 84, topBroker: 'Broker1', topCount: 9 },
  { from: 'Instructed to Lawyer', to: 'Signed Commitment', count: 48, topBroker: 'Broker2', topCount: 11 },
  { from: 'Signed Commitment', to: 'Approved', count: 46, topBroker: 'Broker2', topCount: 8 },
];

// Suspicious deals
const suspiciousDeals = [
  { broker: 'Broker5', oppId: '006N300000t4WJNIA2', submissions: 7, months: 'Aug, Sep, Oct', finalState: 'Submitted', suspicion: 'HIGH' },
  { broker: 'Broker2', oppId: '006N300000SoGmDIAV', submissions: 6, months: 'Nov, Jan, Feb', finalState: 'TUD', suspicion: 'HIGH' },
  { broker: 'Broker34', oppId: '006N300000oECKgIAO', submissions: 6, months: 'Aug, Sep', finalState: 'Parked', suspicion: 'HIGH' },
  { broker: 'Broker14', oppId: '006N300000vOIz5IAG', submissions: 6, months: 'Sep, Oct, Nov', finalState: 'Approved', suspicion: 'HIGH' },
  { broker: 'Broker2', oppId: '006N300000hFwqvIAC', submissions: 6, months: 'Apr, May, Aug', finalState: 'Closed Won', suspicion: 'MEDIUM' },
];

const stages = ['total', 'docs', 'submitted', 'approved', 'commitment', 'lawyer', 'payment', 'closed'];
const stageLabels = {
  total: 'Created',
  docs: 'Docs Received',
  appraisal: 'Appraisal',
  submitted: 'Submitted',
  approved: 'Approved',
  commitment: 'Commitment',
  lawyer: 'To Lawyer',
  payment: 'Awaiting Pmt',
  closed: 'Closed Won'
};

// Sankey Chart Component
const SankeyChart = ({ data }) => {
  const width = 800;
  const height = 400;
  const nodeWidth = 20;
  const nodePadding = 40;
  
  // Define nodes and their positions
  const nodes = [
    { id: 'created', label: 'Created', x: 0, value: data.total },
    { id: 'docs', label: 'Docs', x: 1, value: data.docs },
    { id: 'submitted', label: 'Submitted', x: 2, value: data.submitted },
    { id: 'approved', label: 'Approved', x: 3, value: data.approved },
    { id: 'commitment', label: 'Commitment', x: 4, value: data.commitment },
    { id: 'closed', label: 'Closed', x: 5, value: data.closed },
    { id: 'lost_docs', label: 'Lost', x: 1, value: data.total - data.docs, isLoss: true },
    { id: 'lost_submit', label: 'Lost', x: 2, value: data.docs - data.submitted, isLoss: true },
    { id: 'rejected', label: 'Rejected', x: 3, value: data.submitted - data.approved, isLoss: true },
    { id: 'lost_commit', label: 'Lost', x: 4, value: data.approved - data.commitment, isLoss: true },
    { id: 'lost_close', label: 'Lost', x: 5, value: data.commitment - data.closed, isLoss: true },
  ];

  // Define flows between nodes
  const flows = [
    { from: 'created', to: 'docs', value: data.docs },
    { from: 'created', to: 'lost_docs', value: data.total - data.docs },
    { from: 'docs', to: 'submitted', value: data.submitted },
    { from: 'docs', to: 'lost_submit', value: data.docs - data.submitted },
    { from: 'submitted', to: 'approved', value: data.approved },
    { from: 'submitted', to: 'rejected', value: data.submitted - data.approved },
    { from: 'approved', to: 'commitment', value: data.commitment },
    { from: 'approved', to: 'lost_commit', value: data.approved - data.commitment },
    { from: 'commitment', to: 'closed', value: data.closed },
    { from: 'commitment', to: 'lost_close', value: data.commitment - data.closed },
  ].filter(f => f.value > 0);

  // Calculate positions
  const xScale = (width - nodeWidth) / 5;
  const maxValue = data.total;
  const yScale = (height - 100) / maxValue;

  // Position nodes
  const positionedNodes = nodes.map(node => {
    const x = node.x * xScale + 40;
    const nodeHeight = Math.max(node.value * yScale, 4);
    let y;
    
    if (node.isLoss) {
      y = height - nodeHeight - 20;
    } else {
      y = 40;
    }
    
    return { ...node, x, y, height: nodeHeight };
  });

  const getNode = (id) => positionedNodes.find(n => n.id === id);

  // Track vertical offsets for stacking flows
  const nodeOffsets = {};
  nodes.forEach(n => nodeOffsets[n.id] = { out: 0, in: 0 });

  return (
    <div className="bg-slate-700/30 rounded-lg p-4 overflow-x-auto">
      <svg width={width} height={height} className="mx-auto">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lossGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="winGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Draw flows */}
        {flows.map((flow, i) => {
          const fromNode = getNode(flow.from);
          const toNode = getNode(flow.to);
          if (!fromNode || !toNode) return null;
          
          const flowHeight = Math.max(flow.value * yScale, 2);
          
          const x1 = fromNode.x + nodeWidth;
          const y1 = fromNode.y + nodeOffsets[flow.from].out;
          const x2 = toNode.x;
          const y2 = toNode.y + nodeOffsets[flow.to].in;
          
          nodeOffsets[flow.from].out += flowHeight;
          nodeOffsets[flow.to].in += flowHeight;
          
          const midX = (x1 + x2) / 2;
          
          const isLoss = toNode.isLoss;
          const isWin = toNode.id === 'closed';
          
          return (
            <path
              key={i}
              d={`
                M ${x1} ${y1}
                C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}
                L ${x2} ${y2 + flowHeight}
                C ${midX} ${y2 + flowHeight}, ${midX} ${y1 + flowHeight}, ${x1} ${y1 + flowHeight}
                Z
              `}
              fill={isWin ? 'url(#winGradient)' : isLoss ? 'url(#lossGradient)' : 'url(#flowGradient)'}
              className="transition-opacity hover:opacity-80"
            />
          );
        })}

        {/* Draw nodes */}
        {positionedNodes.filter(n => n.value > 0).map((node, i) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={nodeWidth}
              height={node.height}
              fill={node.id === 'closed' ? '#22c55e' : node.isLoss ? '#ef4444' : '#3b82f6'}
              rx={4}
            />
            <text
              x={node.x + nodeWidth / 2}
              y={node.y - 8}
              textAnchor="middle"
              className="fill-slate-300 text-xs font-medium"
            >
              {node.label}
            </text>
            <text
              x={node.x + nodeWidth / 2}
              y={node.y + node.height + 16}
              textAnchor="middle"
              className="fill-slate-400 text-xs"
            >
              {node.value}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-blue-500 rounded"></div>
          <span className="text-slate-400">Pipeline Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-green-500 rounded"></div>
          <span className="text-slate-400">Closed Won</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-red-500 rounded"></div>
          <span className="text-slate-400">Lost/Rejected</span>
        </div>
      </div>
    </div>
  );
};

export default function PipelineDashboard() {
  const [activeTab, setActiveTab] = useState('funnel');
  const [selectedCohort, setSelectedCohort] = useState('2025-06');
  const [compareCohort, setCompareCohort] = useState('2025-04');
  const [chatHistory, setChatHistory] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'closeRate', direction: 'desc' });

  const cohorts = Object.keys(cohortFunnelData).sort();
  
  const selectedData = cohortFunnelData[selectedCohort];
  const compareData = cohortFunnelData[compareCohort];

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedBrokers = useMemo(() => {
    return [...brokerData].sort((a, b) => {
      if (sortConfig.direction === 'asc') return a[sortConfig.key] - b[sortConfig.key];
      return b[sortConfig.key] - a[sortConfig.key];
    });
  }, [sortConfig]);

  // AI Analysis function
  const runAiAnalysis = async (question) => {
    if (!question.trim()) return;
    
    setIsAnalyzing(true);
    setUserQuestion('');
    
    // Add user question to history
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    
    const dataContext = `You are analyzing mortgage pipeline data for Blue Pearl Financial. Here's the data:

COHORT PERFORMANCE (deals created in each month → eventual outcomes):
${cohorts.map(c => {
  const d = cohortFunnelData[c];
  return `${c}: ${d.total} created → ${d.docs} docs (${(d.docs/d.total*100).toFixed(0)}%) → ${d.submitted} submitted (${(d.submitted/d.total*100).toFixed(0)}%) → ${d.approved} approved (${(d.approved/d.total*100).toFixed(0)}%) → ${d.closed} closed (${(d.closed/d.total*100).toFixed(0)}%)`;
}).join('\n')}

BROKER PERFORMANCE:
${brokerData.map(b => `${b.broker}: ${b.opps} opps, ${b.closed} closed (${b.closeRate}%), ${b.backward} backward moves (${b.backwardRate}%)`).join('\n')}

BACKWARD MOVEMENTS (deals moving backward in pipeline):
${backwardData.map(b => `${b.from} → ${b.to}: ${b.count} times (top: ${b.topBroker} with ${b.topCount})`).join('\n')}

SUSPICIOUS DEALS (multiple submissions across months):
${suspiciousDeals.map(d => `${d.broker}: ${d.submissions} submissions across ${d.months}, ended as ${d.finalState}`).join('\n')}

KEY STATS:
- Best month: June 2025 (15.8% close rate)
- Worst month: December 2024 (4.7% close rate)  
- Total opportunities: 6,044
- Overall close rate: 9.1%
- Total backward movements: 707

Answer the following question concisely and specifically. Use the data to support your answer. Be direct and actionable.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [
            { role: 'user', content: dataContext + '\n\nQuestion: ' + question }
          ]
        })
      });
      
      const data = await response.json();
      const aiResponse = data.content[0].text;
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: `I couldn't connect to the API, but here's what I can tell you based on the data:\n\n${getFallbackAnalysis(question)}` 
      }]);
    }
    
    setIsAnalyzing(false);
  };

  // Fallback analysis if API fails
  const getFallbackAnalysis = (question) => {
    const q = question.toLowerCase();
    
    if (q.includes('june') || q.includes('best')) {
      return `**June 2025 Success Factors:**

1. **Higher doc collection rate:** 36% vs 20% average — leads came better prepared
2. **Better submission rate:** 29% reached submission vs 14% in April
3. **Broker1 crushed it:** 47.4% close rate that month (vs 15% in April)
4. **Smaller cohort:** 386 deals vs 569 in April — quality over quantity

The entire funnel performed better, not just one stage. This suggests either better lead quality from marketing or specific broker performance.`;
    }
    
    if (q.includes('broker22') || q.includes('worst broker')) {
      return `**Broker22 Issues:**

- **46.4% backward movement rate** (highest among all brokers)
- **Only 5.1% close rate** (worst among active brokers)
- **57 Submitted→App Taken reversals** — they account for 28% of ALL such reversals

This could be:
1. Gaming submission KPIs by resubmitting same deals
2. Poor lender selection (submit, get rejected, reset, try again)
3. Inadequate upfront qualification

**Recommendation:** Pull their last 10 deals and walk through the journey with them.`;
    }
    
    if (q.includes('december') || q.includes('seasonal')) {
      return `**December Pattern:**

December 2024 had the worst close rate (4.7%) despite high volume (684 opps).

Likely causes:
1. **Holiday slowdown** — Lenders have reduced staff, slower approvals
2. **Year-end rush** — Brokers pushing unqualified deals to hit quotas
3. **Client availability** — Harder to get documents during holidays

The funnel shows only 10% got docs (vs 36% in June) — deals died early.

**Recommendation:** Adjust December targets or focus on deals already in pipeline vs new intake.`;
    }
    
    if (q.includes('gaming') || q.includes('investigate')) {
      return `**Brokers to Investigate for Potential Gaming:**

1. **Broker5** — Deal 006N300000t4WJNIA2 submitted 7 times across 3 months, never closed
2. **Broker2** — 23 multi-month submission deals, 34 Approved→Submitted oscillations
3. **Broker34** — 46.2% backward rate, 11 multi-month deals

**Red flags to look for:**
- Same deal submitted at end of month, then again at start of next month
- Approved→Submitted→Approved cycles on same day
- High submission count but low close rate

**12 deals show clear month-boundary pattern** (backward in last 5 days, resubmit in first 10 days of next month).`;
    }
    
    if (q.includes('action') || q.includes('improve') || q.includes('recommend')) {
      return `**3 Actions to Improve Close Rates:**

1. **Cap monthly intake around 400 deals**
   - Months with 500+ opps have lower close rates (quality degrades)
   - June (386) and Oct (340) had best rates

2. **Implement backward movement controls**
   - Require reason codes for any backward stage change
   - Alert managers on same-day reversals
   - Flag deals with 3+ submissions

3. **Study and replicate Broker1/Broker16's process**
   - Broker1: 22% close rate, had 47% in June
   - Broker16: 19.6% close rate, only 3% backward rate
   - What are they doing differently in qualification and lender selection?`;
    }
    
    return `Based on the data, I can see patterns in cohort performance, broker activity, and backward movements. The best performing month was June 2025 (15.8% close rate) and the most concerning broker is Broker22 (46.4% backward rate). Try asking about specific months, brokers, or for recommendations.`;
  };

  const tabs = [
    { id: 'funnel', label: '🔍 Cohort Funnel' },
    { id: 'sankey', label: '🌊 Flow' },
    { id: 'compare', label: '⚖️ Compare' },
    { id: 'brokers', label: '👥 Brokers' },
    { id: 'issues', label: '⚠️ Issues' },
    { id: 'ai', label: '🤖 AI Insights' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Blue Pearl Pipeline Analytics</h1>
        <p className="text-slate-400 text-sm">Oct 2024 - Dec 2025 • 6,044 Opportunities • Deep Funnel Analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Total Opps</div>
          <div className="text-xl font-bold">6,044</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Closed Won</div>
          <div className="text-xl font-bold text-green-400">518</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Avg Close Rate</div>
          <div className="text-xl font-bold text-blue-400">9.1%</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Best Month</div>
          <div className="text-xl font-bold text-green-400">Jun 25</div>
          <div className="text-xs text-slate-500">15.8%</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <div className="text-slate-400 text-xs">Backward Moves</div>
          <div className="text-xl font-bold text-orange-400">707</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-700 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-t text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-slate-800 rounded-lg p-4">
        
        {/* Funnel Tab */}
        {activeTab === 'funnel' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Cohort Funnel Analysis</h2>
              <select 
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              >
                {cohorts.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <p className="text-slate-400 text-sm mb-4">
              Of {selectedData.total} deals created in {selectedCohort}, how many reached each stage?
            </p>

            {/* Funnel Visualization */}
            <div className="space-y-2 mb-6">
              {stages.map((stage, i) => {
                const count = selectedData[stage];
                const pct = (count / selectedData.total * 100);
                const prevCount = i > 0 ? selectedData[stages[i-1]] : count;
                const dropoff = i > 0 ? ((prevCount - count) / prevCount * 100) : 0;
                
                return (
                  <div key={stage} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-slate-400">{stageLabels[stage]}</div>
                    <div className="flex-1 relative">
                      <div className="bg-slate-700 rounded h-8 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            stage === 'closed' ? 'bg-green-500' : 
                            stage === 'total' ? 'bg-blue-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-20 text-right">
                      <span className="font-semibold">{count}</span>
                      <span className="text-slate-500 text-sm ml-1">({pct.toFixed(0)}%)</span>
                    </div>
                    {i > 0 && dropoff > 0 && (
                      <div className="w-16 text-right text-red-400 text-xs">
                        -{dropoff.toFixed(0)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stage Conversion Rates */}
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium mb-3">Stage-to-Stage Conversion</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Created → Docs</div>
                  <div className="text-xl font-bold">{(selectedData.docs / selectedData.total * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Docs → Submitted</div>
                  <div className="text-xl font-bold">{(selectedData.submitted / selectedData.docs * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Submitted → Approved</div>
                  <div className="text-xl font-bold">{(selectedData.approved / selectedData.submitted * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <div className="text-slate-400">Approved → Closed</div>
                  <div className="text-xl font-bold text-green-400">{(selectedData.closed / selectedData.approved * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sankey Flow Tab */}
        {activeTab === 'sankey' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Pipeline Flow</h2>
                <p className="text-slate-400 text-sm">How deals flow through stages (width = volume)</p>
              </div>
              <select 
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
              >
                {cohorts.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <SankeyChart data={selectedData} />
            
            {/* Flow breakdown */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{selectedData.closed}</div>
                <div className="text-sm text-slate-400">Closed Won</div>
                <div className="text-xs text-green-500">{(selectedData.closed/selectedData.total*100).toFixed(1)}% of created</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-slate-300">{selectedData.inProgress}</div>
                <div className="text-sm text-slate-400">In Progress</div>
                <div className="text-xs text-slate-500">{(selectedData.inProgress/selectedData.total*100).toFixed(1)}% of created</div>
              </div>
              <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-400">{selectedData.total - selectedData.docs}</div>
                <div className="text-sm text-slate-400">Lost at Docs</div>
                <div className="text-xs text-orange-500">{((selectedData.total - selectedData.docs)/selectedData.total*100).toFixed(1)}% of created</div>
              </div>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{selectedData.submitted - selectedData.approved}</div>
                <div className="text-sm text-slate-400">Rejected by Lender</div>
                <div className="text-xs text-red-500">{((selectedData.submitted - selectedData.approved)/selectedData.submitted*100).toFixed(1)}% of submitted</div>
              </div>
            </div>
          </div>
        )}

        {/* Compare Tab */}
        {activeTab === 'compare' && (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Cohort A</label>
                <select 
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                >
                  {cohorts.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="text-2xl text-slate-500">vs</div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Cohort B</label>
                <select 
                  value={compareCohort}
                  onChange={(e) => setCompareCohort(e.target.value)}
                  className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm"
                >
                  {cohorts.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 pr-4">Stage</th>
                    <th className="pb-3 pr-4 text-right">{selectedCohort}</th>
                    <th className="pb-3 pr-4 text-right">{compareCohort}</th>
                    <th className="pb-3 text-right">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {stages.map(stage => {
                    const aCount = selectedData[stage];
                    const bCount = compareData[stage];
                    const aPct = aCount / selectedData.total * 100;
                    const bPct = bCount / compareData.total * 100;
                    const diff = aPct - bPct;
                    
                    return (
                      <tr key={stage} className="border-b border-slate-700/50">
                        <td className="py-3 pr-4 font-medium">{stageLabels[stage]}</td>
                        <td className="py-3 pr-4 text-right">
                          {aCount} <span className="text-slate-500">({aPct.toFixed(1)}%)</span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          {bCount} <span className="text-slate-500">({bPct.toFixed(1)}%)</span>
                        </td>
                        <td className={`py-3 text-right font-semibold ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : ''}`}>
                          {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Comparison */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-blue-400">{selectedCohort}</h3>
                <div className="space-y-2">
                  {stages.map(stage => {
                    const pct = selectedData[stage] / selectedData.total * 100;
                    return (
                      <div key={stage} className="flex items-center gap-2">
                        <div className="w-16 text-xs text-slate-400">{stageLabels[stage].slice(0,8)}</div>
                        <div className="flex-1 bg-slate-600 rounded h-4">
                          <div className="h-full bg-blue-500 rounded" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-10 text-xs text-right">{pct.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="font-medium mb-3 text-purple-400">{compareCohort}</h3>
                <div className="space-y-2">
                  {stages.map(stage => {
                    const pct = compareData[stage] / compareData.total * 100;
                    return (
                      <div key={stage} className="flex items-center gap-2">
                        <div className="w-16 text-xs text-slate-400">{stageLabels[stage].slice(0,8)}</div>
                        <div className="flex-1 bg-slate-600 rounded h-4">
                          <div className="h-full bg-purple-500 rounded" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-10 text-xs text-right">{pct.toFixed(0)}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Brokers Tab */}
        {activeTab === 'brokers' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Broker Performance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-700">
                    <th className="pb-3 pr-4">Broker</th>
                    <th className="pb-3 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('opps')}>Opps</th>
                    <th className="pb-3 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('closed')}>Closed</th>
                    <th className="pb-3 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('closeRate')}>Close Rate</th>
                    <th className="pb-3 pr-4 text-right cursor-pointer hover:text-white" onClick={() => handleSort('backwardRate')}>Backward Rate</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedBrokers.map(b => (
                    <tr key={b.broker} className="border-b border-slate-700/50">
                      <td className="py-3 pr-4 font-medium">{b.broker}</td>
                      <td className="py-3 pr-4 text-right">{b.opps}</td>
                      <td className="py-3 pr-4 text-right text-green-400">{b.closed}</td>
                      <td className="py-3 pr-4 text-right">
                        <span className={b.closeRate >= 15 ? 'text-green-400' : b.closeRate < 8 ? 'text-red-400' : ''}>
                          {b.closeRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <span className={b.backwardRate > 25 ? 'text-red-400' : b.backwardRate < 10 ? 'text-green-400' : ''}>
                          {b.backwardRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {b.backwardRate > 25 && <span title="High backward rate">⚠️</span>}
                        {b.closeRate >= 15 && b.backwardRate < 15 && <span title="Top performer">⭐</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Issues Tab */}
        {activeTab === 'issues' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Backward Movements & Suspicious Activity</h2>
            
            {/* Backward Movements */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-orange-400">↩️ Top Backward Movements</h3>
              <div className="space-y-2">
                {backwardData.map((b, i) => (
                  <div key={i} className="bg-slate-700/50 rounded p-3 flex justify-between items-center">
                    <div>
                      <span className="text-white">{b.from}</span>
                      <span className="text-slate-500 mx-2">→</span>
                      <span className="text-red-400">{b.to}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-400 font-bold">{b.count}</span>
                      <span className="text-slate-500 text-sm ml-2">Top: {b.topBroker} ({b.topCount})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspicious Deals */}
            <div>
              <h3 className="font-medium mb-3 text-red-400">🚨 Deals to Investigate</h3>
              <div className="space-y-2">
                {suspiciousDeals.map((d, i) => (
                  <div key={i} className={`rounded p-3 ${d.suspicion === 'HIGH' ? 'bg-red-900/20 border border-red-800' : 'bg-yellow-900/20 border border-yellow-800'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${d.suspicion === 'HIGH' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                          {d.suspicion}
                        </span>
                        <span className="ml-2 font-medium">{d.broker}</span>
                      </div>
                      <span className="text-2xl font-bold">{d.submissions}x</span>
                    </div>
                    <div className="text-sm text-slate-400 mt-2">
                      Submitted in: {d.months} • Final: {d.finalState}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Tab */}
        {activeTab === 'ai' && (
          <div>
            <h2 className="text-lg font-semibold mb-4">🤖 AI Analysis</h2>
            
            {/* Question Input */}
            <div className="mb-4">
              <label className="text-sm text-slate-400 block mb-2">Ask a question about your pipeline data:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isAnalyzing && runAiAnalysis(userQuestion)}
                  placeholder="e.g., Why did June 2025 perform so well?"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => runAiAnalysis(userQuestion)}
                  disabled={isAnalyzing || !userQuestion.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 px-4 py-2 rounded font-medium transition-colors whitespace-nowrap"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Ask'}
                </button>
              </div>
            </div>

            {/* Quick Questions */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Why did June 2025 have the highest close rate?",
                  "What's wrong with Broker22?",
                  "Why is December always bad?",
                  "Which brokers should I investigate for gaming?",
                  "What's causing the Approved→Submitted oscillations?",
                  "Give me 3 actions to improve close rates",
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setUserQuestion(q);
                      runAiAnalysis(q);
                    }}
                    disabled={isAnalyzing}
                    className="text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation History */}
            <div className="space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`rounded-lg p-4 ${msg.role === 'user' ? 'bg-blue-900/30 border border-blue-800' : 'bg-slate-700/50'}`}>
                  <div className="text-xs text-slate-400 mb-2">
                    {msg.role === 'user' ? '👤 You' : '🤖 Claude'}
                  </div>
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                </div>
              ))}
              
              {isAnalyzing && (
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-xs text-slate-400 mb-2">🤖 Claude</div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="animate-pulse">Analyzing your pipeline data...</div>
                  </div>
                </div>
              )}
            </div>

            {chatHistory.length === 0 && !isAnalyzing && (
              <div className="bg-slate-700/30 rounded-lg p-8 text-center text-slate-500">
                <div className="text-4xl mb-3">🤖</div>
                <p>Ask any question about your pipeline data. Claude has access to all cohort funnels, broker performance, and backward movement patterns.</p>
              </div>
            )}

            {chatHistory.length > 0 && (
              <button
                onClick={() => setChatHistory([])}
                className="mt-4 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear conversation
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-slate-500 text-xs">
        Data: Oct 2024 - Dec 2025 • Built with Claude
      </div>
    </div>
  );
}
