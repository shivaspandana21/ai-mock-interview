import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onNavigate }) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = user?.id || 1; // fallback to 1 for demo
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
    fetchDashboardData();
  }, [user]);

  const avgScore = interviews.length > 0
    ? Math.round(interviews.reduce((acc, i) => acc + i.score, 0) / interviews.length)
    : '--';
  const bestScore = interviews.length > 0
    ? Math.max(...interviews.map(i => i.score))
    : '--';

  return (
    <div className="page active" id="page-dashboard">
      <div className="page-header">
        <h2>Welcome back, <span>{user?.name || 'Candidate'}</span> 👋</h2>
        <p>Here's your interview readiness overview</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        <div className="stat-card purple">
          <div className="stat-icon purple">🎯</div>
          <div className="stat-val">{interviews.length}</div>
          <div className="stat-lbl">Interviews Taken</div>
          <div className="stat-change up">↑ Keep practicing!</div>
        </div>
        <div className="stat-card teal">
          <div className="stat-icon teal">⭐</div>
          <div className="stat-val">{avgScore}</div>
          <div className="stat-lbl">Avg Score</div>
          <div className="stat-change up">↑ Improving</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">💬</div>
          <div className="stat-val">{interviews.length * 5}</div>
          <div className="stat-lbl">Questions Answered</div>
          <div className="stat-change up">↑ Great effort</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">🏆</div>
          <div className="stat-val">{bestScore}</div>
          <div className="stat-lbl">Best Score</div>
          <div className="stat-change up">↑ Personal best</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="section-title">📈 Recent Performance</div>
          <div>
            <svg width="100%" height="160" viewBox="0 0 400 160">
              {interviews.length === 0 ? (
                <text x="10" y="80" fill="#5c6380" fontSize="13">No data yet — take your first interview!</text>
              ) : (
                <g>
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4"/>
                  <line x1="0" y1="80" x2="400" y2="80" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4"/>
                  <text x="0" y="15" fill="var(--text3)" fontSize="10">100</text>
                  <text x="0" y="75" fill="var(--text3)" fontSize="10">50</text>
                  
                  {/* Bars */}
                  {[...interviews].reverse().slice(0, 10).reverse().map((iv, idx, arr) => {
                    const totalBars = arr.length;
                    const spacing = 400 / totalBars;
                    const x = (idx * spacing) + (spacing / 2) - 10;
                     // Height out of 100 max mapped to 120px max height
                    const h = (iv.score / 100) * 120; 
                    const y = 140 - h;
                    return (
                      <g key={idx}>
                        <rect x={x} y={y} width="20" height={h} fill="var(--accent)" rx="4" />
                        <text x={x+10} y={y-5} fill="var(--text2)" fontSize="10" textAnchor="middle">{iv.score}</text>
                      </g>
                    );
                  })}
                </g>
              )}
              <line x1="0" y1="140" x2="400" y2="140" stroke="var(--border)" strokeWidth="1"/>
            </svg>
          </div>
        </div>
        <div className="card">
          <div className="section-title">⚡ Quick Start</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-accent" onClick={() => onNavigate('stream')}>🎓 Start Stream Interview</button>
            <button className="btn btn-teal" onClick={() => onNavigate('company')}>🏢 Company Mock Interview</button>
            <button className="btn btn-orange" onClick={() => onNavigate('resume')}>📄 Upload & Score Resume</button>
            <button className="btn btn-outline" onClick={() => onNavigate('questions')}>❓ Browse Question Bank</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">📋 Recent Interviews</div>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : interviews.length === 0 ? (
            <div className="empty-state">No interviews yet. Start your first mock interview!</div>
          ) : (
             interviews.map(interview => (
               <div key={interview.id} className="card2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                 <div>
                   <div style={{ fontWeight: 'bold', color: 'var(--text)' }}>{interview.title}</div>
                   <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{new Date(interview.created_at).toLocaleDateString()} • {interview.stream}</div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                   <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{interview.score}/100</div>
                   <button 
                     className="btn btn-outline btn-sm" 
                     onClick={() => setActiveReview(interview)}
                   >
                     Review
                   </button>
                 </div>
               </div>
             ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {activeReview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '600px', maxWidth: '100%', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>🔍 Detailed Review</div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setActiveReview(null)}>✕</button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{activeReview.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text2)' }}>{new Date(activeReview.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>
                {activeReview.score}
                <span style={{ fontSize: '14px', color: 'var(--text3)' }}>/100</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--text)' }}>Your Pre-recorded Answer:</h4>
              <p style={{ color: 'var(--text2)', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                {(() => {
                  try {
                    const parsed = JSON.parse(activeReview.results);
                    return parsed.answer ? `"${parsed.answer}"` : "No raw answer text recorded for this session.";
                  } catch (e) {
                    return "No raw answer text recorded.";
                  }
                })()}
              </p>
            </div>

            <button className="btn btn-primary" style={{ marginTop: '8px', width: '100%' }} onClick={() => setActiveReview(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
