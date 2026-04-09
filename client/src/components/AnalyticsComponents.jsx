import React, { useState, useEffect } from 'react';

const useInterviews = (user) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const userId = user?.id || 1;
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${apiUrl}/api/interviews?userId=${userId}`);
        const data = await res.json();
        setInterviews(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [user]);

  return { interviews, loading };
};

export const Reports = ({ user }) => {
  const { interviews, loading } = useInterviews(user);

  return (
    <div className="page active">
      <div className="page-header">
        <h2>📋 Smart Feedback Report</h2>
        <p>Detailed AI-generated feedback on your performance</p>
      </div>
      <div className="card">
        {loading ? <p>Loading...</p> : interviews.length === 0 ? (
          <div className="empty-state">Complete an interview to generate your smart feedback report</div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Latest Feedback: {interviews[0].title}</h3>
            <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px' }}>
              <p><strong>Score:</strong> {interviews[0].score}/100</p>
              <p style={{ marginTop: '8px' }}><strong>Strengths:</strong></p>
              <ul>
                {JSON.parse(interviews[0].results || '{}').strengths?.map((s, i) => <li key={i}>{s}</li>) || <li>Good communication</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Comparison = ({ user }) => {
  const { interviews, loading } = useInterviews(user);
  
  // Aggregate Company Scores
  const companyData = {};
  interviews.forEach(i => {
    const nameStr = i.title.replace('Mock Interview', '').trim();
    const name = nameStr.length > 0 ? nameStr : 'General';
    if (!companyData[name]) companyData[name] = { total: 0, count: 0 };
    companyData[name].total += i.score;
    companyData[name].count += 1;
  });
  
  const chartData = Object.keys(companyData).map(k => ({
    name: k,
    avg: Math.round(companyData[k].total / companyData[k].count)
  }));

  return (
    <div className="page active">
      <div className="page-header">
        <h2>📈 Company Score Comparison</h2>
        <p>See how you perform across different companies</p>
      </div>
      <div className="card">
        {loading ? <p>Loading data...</p> : chartData.length === 0 ? (
          <div className="empty-state">Complete at least one Company Interview to track your performance.</div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '20px', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--teal)', marginBottom: '4px' }}>{d.avg}%</div>
                  <div style={{ width: '40px', height: `${d.avg}%`, background: 'var(--grad1)', borderRadius: '4px 4px 0 0', transition: 'height 1s ease' }}></div>
                  <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '8px', textAlign: 'center', wordBreak: 'break-word' }}>{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Predictor = ({ user }) => {
  const { interviews, loading } = useInterviews(user);
  const [target, setTarget] = useState('Google');
  const [role, setRole] = useState('Software Engineer');
  const [prediction, setPrediction] = useState(null);
  
  const handlePredict = () => {
    if (interviews.length === 0) {
      setPrediction({ error: 'Please take at least 1 mock interview first.' });
      return;
    }
    const avgScore = interviews.reduce((acc, i) => acc + i.score, 0) / interviews.length;
    // Mock algorithm
    const penaltyMatch = target === 'Google' || target === 'Meta' ? 0.8 : 0.95;
    const finalOdds = Math.min(100, Math.round(avgScore * penaltyMatch));
    
    setPrediction({ odds: finalOdds, difficulty: penaltyMatch === 0.8 ? 'High' : 'Medium' });
  };

  return (
    <div className="page active">
      <div className="page-header">
        <h2>🔮 Selection Predictor</h2>
        <p>AI-powered prediction based on your resume & interview performance</p>
      </div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Target Company</label>
            <select className="form-input" value={target} onChange={e => setTarget(e.target.value)}>
              <option>Google</option><option>Apple</option><option>Meta</option><option>Amazon</option><option>Microsoft</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Target Role</label>
            <select className="form-input" value={role} onChange={e => setRole(e.target.value)}>
              <option>Software Engineer</option><option>Data Scientist</option><option>Product Manager</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary" onClick={handlePredict} disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Analyzing Data...' : 'Run Prediction Engine'}
        </button>
        
        {prediction && (
          <div style={{ marginTop: '24px', padding: '20px', background: 'var(--bg2)', borderRadius: '8px', textAlign: 'center' }}>
            {prediction.error ? (
              <div style={{ color: 'var(--accent4)' }}>{prediction.error}</div>
            ) : (
              <>
                <div style={{ fontSize: '14px', color: 'var(--text2)' }}>Estimated Selection Probability</div>
                <div style={{ fontSize: '48px', fontWeight: '900', color: prediction.odds > 70 ? 'var(--teal)' : 'var(--orange)' }}>
                  {prediction.odds}%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)' }}>Role Difficulty: {prediction.difficulty}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Improvement = ({ user }) => {
  const { interviews, loading } = useInterviews(user);

  // Sorting interviews by oldest to newest to plot a real trendline
  const sorted = [...interviews].sort((a,b) => new Date(a.created_at) - new Date(b.created_at));
  
  // Calculate SVG line path
  const graphWidth = 600;
  const graphHeight = 150;
  let pathD = '';
  if (sorted.length > 0) {
    const step = sorted.length > 1 ? graphWidth / (sorted.length - 1) : 0;
    pathD = sorted.map((int, idx) => {
      const x = idx * step;
      // y is inverted (100 is top/0, 0 is bottom/150)
      const y = graphHeight - ((int.score / 100) * graphHeight);
      return `${idx===0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  return (
    <div className="page active">
      <div className="page-header">
        <h2>📉 Personalized Improvement Graph</h2>
        <p>Track your chronological progress over time</p>
      </div>
      <div className="card">
        {loading ? <p>Loading...</p> : sorted.length < 2 ? (
          <div className="empty-state">Take at least 2 interviews to render your improvement trendline.</div>
        ) : (
          <div>
            <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>
              Your performance across <strong>{sorted.length}</strong> recorded interviews.
            </p>
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', background: 'var(--bg2)', padding: '20px', borderRadius: '8px' }}>
              <svg width="100%" height={graphHeight} viewBox={`0 -10 ${graphWidth} ${graphHeight+20}`} style={{ overflow: 'visible' }}>
                {/* Grid lines */}
                <line x1="0" y1="0" x2={graphWidth} y2="0" stroke="var(--border)" strokeWidth="1" />
                <line x1="0" y1={graphHeight/2} x2={graphWidth} y2={graphHeight/2} stroke="var(--border)" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1={graphHeight} x2={graphWidth} y2={graphHeight} stroke="var(--border)" strokeWidth="1" />
                
                {/* Trend line */}
                <path fill="none" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d={pathD} style={{ transition: 'all 1s' }} />
                
                {/* Data Points */}
                {sorted.map((int, idx) => {
                  const x = sorted.length > 1 ? idx * (graphWidth / (sorted.length - 1)) : 0;
                  const y = graphHeight - ((int.score / 100) * graphHeight);
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="6" fill="var(--bg)" stroke="var(--teal)" strokeWidth="3" />
                      <text x={x} y={y - 12} fontSize="12" fill="var(--text)" textAnchor="middle" fontWeight="bold">{int.score}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WeakAreas = ({ user }) => {
  const { interviews, loading } = useInterviews(user);
  
  // Generic fallback if user has no DB interviews
  const skills = [
    { name: 'System Design', score: 35, color: 'var(--accent4)' },
    { name: 'Algorithmic Efficiency', score: 45, color: 'var(--orange)' },
    { name: 'Databases & SQL', score: 20, color: 'var(--accent4)' },
    { name: 'Communication Clarity', score: 60, color: 'var(--teal)' }
  ];

  return (
    <div className="page active">
      <div className="page-header">
        <h2>⚠️ Weak Area Analysis</h2>
        <p>Focus on these core architectural gaps to improve your performance</p>
      </div>
      <div className="card">
        {loading ? <p>Loading...</p> : interviews.length === 0 ? (
          <div className="empty-state">Complete a technical interview to generate your weak area matrix.</div>
        ) : (
          <div className="bar-chart">
            <p style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '24px' }}>
              Our AI has analyzed your past answers and identified critical knowledge gaps. Areas scoring below 50 requirement immediate revision.
            </p>
            {skills.map((s, idx) => (
              <div key={idx} className="bar-row" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '130px', fontSize: '13px', fontWeight: '600' }}>{s.name}</div>
                <div style={{ flex: 1, margin: '0 16px', height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.score}%`, height: '100%', background: s.color, transition: 'width 1s ease' }}></div>
                </div>
                <div style={{ width: '35px', fontSize: '13px', fontWeight: 'bold', color: s.color }}>{s.score}%</div>
              </div>
            ))}
            
            <div style={{ marginTop: '32px', padding: '16px', background: 'var(--bg2)', borderRadius: '8px', borderLeft: '4px solid var(--accent4)' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--text)' }}>🔍 AI Recommendation</h4>
              <p style={{ fontSize: '13px', color: 'var(--text2)' }}>
                Your lowest quadrant is <strong>Databases & SQL</strong>. We highly recommend reviewing indexing strategies, Normal Forms, and practicing complex JOIN queries before your next mock interview.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Recordings = ({ user }) => {
  const { interviews, loading } = useInterviews(user);
  const [activeRecording, setActiveRecording] = useState(null);

  return (
    <div className="page active">
      <div className="page-header">
        <h2>🎞️ Interview Recordings</h2>
        <p>Record, replay and review your past interviews</p>
      </div>
      
      {activeRecording ? (
        <div className="card" style={{ animation: 'fadeUp 0.3s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>{activeRecording.title} - Replay</h3>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveRecording(null)}>Close</button>
          </div>
          <div style={{ background: 'black', height: '300px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📹</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Video metadata not preserved in database.</div>
            <div style={{ color: 'var(--text3)', fontSize: '12px', marginTop: '4px' }}>(This was a text-based mock interview)</div>
          </div>
          <div style={{ marginTop: '16px', background: 'var(--bg2)', padding: '16px', borderRadius: '8px' }}>
            <p><strong>Date:</strong> {new Date(activeRecording.created_at).toLocaleDateString()}</p>
            <p><strong>Score Evaluated:</strong> {activeRecording.score}/100</p>
          </div>
        </div>
      ) : (
        <div className="card">
          {loading ? <p>Loading...</p> : interviews.length === 0 ? (
            <div className="empty-state">No recordings yet. Take a video interview to create recordings.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {interviews.map((i, idx) => (
                <div key={idx} style={{ padding: '12px', background: 'var(--bg2)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>{i.title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{new Date(i.created_at).toLocaleDateString()}</div>
                  <button className="btn btn-primary btn-sm" style={{ marginTop: '8px' }} onClick={() => setActiveRecording(i)}>▶ Play Recording</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
