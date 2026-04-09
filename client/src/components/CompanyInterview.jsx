import React, { useState } from 'react';

const CompanyInterview = ({ user }) => {
  const [activeInterview, setActiveInterview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [scoreResult, setScoreResult] = useState(null);

  const companies = [
    { title: 'Google', icon: 'G', color: '#ea4335', stream: 'SDE' },
    { title: 'Meta', icon: 'M', color: '#1877f2', stream: 'Frontend' },
    { title: 'Amazon', icon: 'A', color: '#ff9900', stream: 'Core' },
    { title: 'Apple', icon: '', color: '#000000', stream: 'SDE' },
    { title: 'Netflix', icon: 'N', color: '#E50914', stream: 'SDE' },
    { title: 'Microsoft', icon: 'M', color: '#00a4ef', stream: 'Cloud' },
    { title: 'Stripe', icon: 'S', color: '#6366f1', stream: 'Backend' },
    { title: 'Uber', icon: 'U', color: '#000000', stream: 'SDE' },
    { title: 'Tesla', icon: 'T', color: '#cc0000', stream: 'Core' }
  ];

  const handleStart = async (company) => {
    setActiveInterview(company);
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
          const keywords = ['because', 'value', 'culture', 'experience', 'growth', 'impact', 'team', 'product', 'vision'];
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
            title: `${activeInterview.title} Mock Interview`,
            stream: activeInterview.stream,
            score: finalScore,
            results: { strengths: ['Communication'], weaknesses: ['Detail orientation'], answer: text }
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
    <div className="page active" id="page-company">
      <div className="page-header">
        <h2>🏢 Company Mock Interview</h2>
        <p>Practice with real company-specific questions</p>
      </div>
      <div className="grid-3" id="company-cards-grid">
        {companies.map((c, i) => (
          <div key={i} className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', margin: '0 auto 16px',
              borderRadius: '16px', background: c.color, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 'bold'
            }}>
              {c.icon}
            </div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)', marginBottom: '8px' }}>
              {c.title}
            </h3>
            <button 
              className="btn btn-teal" 
              style={{ width: '100%', marginTop: '12px' }}
              onClick={() => handleStart(c)}
            >
              Start Interview
            </button>
          </div>
        ))}
      </div>

      {activeInterview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '600px', maxWidth: '100%', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold' }}>🏢 {activeInterview.title} Interview Simulation</div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setActiveInterview(null)}>✕</button>
            </div>
            
            {!scoreResult ? (
              <>
                <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <strong>{activeInterview.title} Recruiter:</strong> "Why do you want to work at {activeInterview.title}, and what unique value would you bring to our {activeInterview.stream} team?"
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
                <p style={{ marginBottom: '16px' }}>Your performance has been recorded. You can view the details safely on your Dashboard.</p>
                
                <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: '6px', borderLeft: '4px solid var(--accent2)' }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text)' }}>💡 Sample Expert Answer:</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', fontStyle: 'italic' }}>
                    {(() => {
                      const name = activeInterview?.title?.toLowerCase() || '';
                      if (name === 'google') return `"I'm deeply inspired by Google's massive global scale and their pioneering work in algorithms and MapReduce. As a Software Engineering specialist, I want to contribute to systems that impact billions of users daily. In my previous role, I optimized a distributed pipeline that reduced latency by 20%, heavily utilizing Golang and Kubernetes, which aligns perfectly with GCP's ecosystem."`;
                      if (name === 'meta') return `"Meta's focus on connecting people and pushing the boundaries of React and open-source tech is why I want to join. I thrive in fast-moving, high-impact environments. I previously rebuilt a frontend monolithic app into micro-frontends reducing bundle size by 40%, and I'm eager to bring that performance-driven mindset to the Frontend Development team."`;
                      if (name === 'amazon') return `"Amazon's 'Customer Obsession' principle strongly resonates with me. As a Cloud Architect, I admire AWS's industry dominance. I recently designed an auto-scaling AWS architecture using EC2 and Lambda that cut our server costs by 30%. I want to bring that frugal, customer-first scalability into Amazon's direct product lines."`;
                      if (name === 'netflix') return `"Netflix's culture of 'Freedom and Responsibility' and unparalleled chaos engineering is what attracts me. As a Backend Engineering specialist, I specialize in high-availability streaming infrastructure. I led a team to migrate our monolith to a microservices architecture that achieved 99.99% uptime, aligning directly with Netflix's core engineering goals."`;
                      if (name === 'apple') return `"Apple's rigorous dedication to privacy, hardware-software integration, and perfect UI design is unparalleled. As an iOS Development expert, I focus heavily on pixel-perfect implementations and memory management. I recently shipped an app utilizing CoreData that minimized battery drain by 15%, reflecting Apple's stringent optimization standards."`;
                      if (name === 'stripe') return `"Stripe's developer-first approach and flawlessly documented APIs are the gold standard. As a FinTech Engineering specialist, I am passionate about secure, scalable payment rails. I recently implemented a PCI-compliant payment gateway integrating Webhooks that processed $5M+ in secure volume without a single dropped transaction."`;
                      if (name === 'tesla') return `"Tesla's mission to accelerate sustainable energy through cutting-edge engineering is the most important challenge of our generation. In my Systems Engineering background, I focus heavily on real-time hardware telemetry. I previously built an embedded sensor logging system via C++ that processed millions of data points with zero frame drops."`;
                      if (name === 'uber') return `"Uber's complex geospatial challenges and real-time dispatch systems are fascinating. As a Data Engineering expert, I love working with highly concurrent data streams. I orchestrated a Kafka-based real-time event pipeline that reduced driver-matching latency by 200ms, which I directly want to leverage on your mobility teams."`;
                      if (name === 'microsoft') return `"Microsoft's massive enterprise reach and commitment to AI integration via Azure is incredible. I want to build robust enterprise tools that empower developers. I recently led a migration to Azure DevOps that accelerated our team's CI/CD deployment cycle by 50%."`;
                      return `"I have always admired ${activeInterview.title}'s commitment to engineering excellence and user satisfaction. As a ${activeInterview.stream} specialist with 3 years of experience building scalable systems, I can bring immediate value by optimizing your backend microservices. At my previous role, I reduced latency by 20% using similar cloud infrastructure, and I'm eager to bring that same data-driven optimization to help drive ${activeInterview.title}'s mission forward."`;
                    })()}
                  </p>
                </div>
                
                <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }} onClick={() => setActiveInterview(null)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInterview;
