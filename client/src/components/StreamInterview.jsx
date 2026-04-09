import React, { useState } from 'react';

const StreamInterview = ({ user }) => {
  const [activeStream, setActiveStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [scoreResult, setScoreResult] = useState(null);

  const streams = [
    { title: 'Software Engineering', icon: '💻', qCount: '150+' },
    { title: 'Data Science', icon: '📊', qCount: '120+' },
    { title: 'Product Management', icon: '📱', qCount: '85+' },
    { title: 'Cybersecurity', icon: '🔒', qCount: '60+' },
    { title: 'DevOps', icon: '⚙️', qCount: '90+' },
    { title: 'UI/UX Design', icon: '🎨', qCount: '45+' },
    { title: 'Cloud Engineering', icon: '☁️', qCount: '110+' },
    { title: 'Backend Engineering', icon: '🔌', qCount: '135+' },
  ];

  const handleStart = async (stream) => {
    setActiveStream(stream);
    setAnswer('');
    setScoreResult(null);
  };

  const handleSubmit = async () => {
    if (!answer) return;
    setLoading(true);

    setTimeout(async () => {
      try {
        const text = answer.toLowerCase();
        let finalScore = 0;
        
        if (text.length < 15) {
          finalScore = Math.floor(Math.random() * 15) + 10;
        } else if (text.length < 40) {
          finalScore = Math.floor(Math.random() * 20) + 30;
        } else {
          const keywords = ['because', 'designed', 'architecture', 'experience', 'resolved', 'impact', 'algorithm', 'system', 'built'];
          let count = 0;
          keywords.forEach(kw => { if (text.includes(kw)) count++; });
          if (count >= 2) finalScore = Math.floor(Math.random() * 15) + 85;
          else if (count >= 1) finalScore = Math.floor(Math.random() * 15) + 65;
          else finalScore = Math.floor(Math.random() * 15) + 40;
        }

        const apiUrl = import.meta.env.VITE_API_URL || '';
        await fetch(`${apiUrl}/api/interviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id || 1,
            title: `${activeStream.title} Mock Interview`,
            stream: activeStream.title,
            score: finalScore,
            results: { strengths: ['Domain Knowledge'], weaknesses: ['Deep Dive'], answer: text }
          })
        });
        
        setScoreResult(finalScore);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="page active" id="page-stream">
      <div className="page-header">
        <h2>🎓 Stream Mock Interview</h2>
        <p>Choose your stream — minimum 10 questions per interview</p>
      </div>
      <div className="grid-3" id="stream-cards-grid">
        {streams.map((stream, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>{stream.icon}</div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: '8px' }}>
              {stream.title}
            </h3>
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '16px' }}>
              {stream.qCount} Questions Data
            </p>
            <button 
              className="btn btn-accent" 
              style={{ width: '100%' }}
              onClick={() => handleStart(stream)}
            >
              Start Interview
            </button>
          </div>
        ))}
      </div>

      {activeStream && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '600px', maxWidth: '100%', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold' }}>🎓 {activeStream.title} Interview Simulation</div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setActiveStream(null)}>✕</button>
            </div>
            
            {!scoreResult ? (
              <>
                <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <strong>{activeStream.title} Evaluator:</strong> "Let's start with a foundational concept. Can you explain one of the most challenging problems you've faced recently in {activeStream.title} and how you architected a solution?"
                </div>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '150px', resize: 'vertical' }} 
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
                <button 
                  className="btn btn-accent" 
                  style={{ width: '100%', opacity: loading ? 0.7 : 1 }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </>
            ) : (
              <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--teal)' }}>
                <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Interview Complete! Score: {scoreResult}/100</h3>
                <p style={{ marginBottom: '16px' }}>Great job! Your performance has been recorded. Check out your Analytics to see how you stack up.</p>
                
                <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: '6px', borderLeft: '4px solid var(--accent2)' }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text)' }}>💡 Sample Expert Answer:</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', fontStyle: 'italic' }}>
                    {(() => {
                      const name = activeStream?.title?.toLowerCase() || '';
                      if (name === 'frontend engineering') return `"In a recent Frontend project, the main bundle size grew too large, causing 4-second TTI. I architected a solution by implementing Webpack code-splitting, lazy loading non-critical React components, and compressing image assets using WebP. As a result, we reduced the bundle payload by 45% and improved our Lighthouse performance score from 65 to 98."`;
                      if (name === 'backend engineering') return `"In my last Backend role, we faced a critical bottleneck where our SQL queries were timing out under peak load. I architected a solution by introducing a Redis caching layer for frequent read-heavy endpoints and rewriting the primary SQL joins to use proper covering indexes. As a result, we reduced the average API latency from 3 seconds to under 200ms without downtime."`;
                      if (name === 'data engineering') return `"A major challenge was processing 5TB of unorganized daily telemetry logs, which caused analytics delays. I architected an ETL pipeline migrating the process to Apache Spark, utilizing partitioned Parquet files on S3. This distributed approach cut processing time by 80% and allowed the BI team to run near real-time dashboards."`;
                      if (name === 'cloud engineering') return `"We were overspending on AWS EC2 instances due to over-provisioning for traffic spikes. I architected an auto-scaling orchestration migrating our workloads to EKS (Kubernetes) and utilized Spot instances for stateless workers. This elasticity allowed us to maintain 99.99% uptime while slashing our monthly compute bill by 35%."`;
                      if (name === 'devops') return `"Our release cycle was manual and error-prone, taking 3 days to deploy to production. I architected a robust CI/CD pipeline using GitHub Actions integrating Docker builds and automated Terraform infrastructure provisioning. This reduced our deployment friction, allowing us to safely release multiple times a day with zero downtime."`;
                      if (name === 'cybersecurity') return `"During a routine audit, I discovered a critical vulnerability involving JWT token exposure in local storage and lack of CSRF protection. I immediately rotated all secrets, migrated the tokens to secure HTTP-only cookies, and implemented strict CSP headers. This proactively remediated a high-severity OWASP risk before any exploitation."`;
                      if (name === 'ui/ux design') return `"Our onboarding completion rate was extremely low due to a complex, multi-page layout. I architected a solution starting with user testing, tracking drop-off metrics. I redesigned the flow into a single-page, gamified progress-stepper, significantly reducing cognitive load. This direct UX intervention increased our conversion rate by over 40%."`;
                      return `"In a recent ${activeStream.title} project, we faced a critical bottleneck where our system was failing under scale. I architected a solution by analyzing the failure points, introducing a scalable caching layer, and rewriting the core logic to be structurally sound. As a result, we reduced the average response time significantly and handled a 3x traffic spike."`;
                    })()}
                  </p>
                </div>
                
                <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }} onClick={() => setActiveStream(null)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamInterview;
