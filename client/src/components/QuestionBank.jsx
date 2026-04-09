import React, { useState, useEffect } from 'react';

const QuestionBank = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streamFilter, setStreamFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);

  // practice state
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      let url = `${apiUrl}/api/questions?`;
      if (streamFilter) url += `stream=${streamFilter}&`;
      if (difficultyFilter) url += `difficulty=${difficultyFilter}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [streamFilter, difficultyFilter]);

  const handleGenerate = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/api/questions/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      if (res.ok) {
        const newQuestion = await res.json();
        setQuestions([newQuestion, ...questions]);
        setModalOpen(false);
        setTopic('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePractice = (q) => {
    setActiveQuestion(q);
    setAnswer('');
    setScoreResult(null);
  };

  const handleSubmitAnswer = () => {
    if (!answer) return;
    setSubmitting(true);
    // Simulate AI grading based on text
    setTimeout(() => {
      let scoreResultObject = { score: 0, feedback: "" };
      const text = answer.toLowerCase();
      
      if (text.length < 15) {
        scoreResultObject = { score: Math.floor(Math.random() * 15) + 10, feedback: "Response is too brief. Please elaborate with more specific details." };
      } else if (text.length < 40) {
        scoreResultObject = { score: Math.floor(Math.random() * 20) + 30, feedback: "A bit short. Try expanding on the 'why' and 'how'." };
      } else {
        const keywords = ['because', 'example', 'performance', 'system', 'design', 'scalable', 'team', 'experience', 'architecture', 'solution', 'implemented', 'optimized', 'concept', 'complexity'];
        let count = 0;
        keywords.forEach(kw => { if (text.includes(kw)) count++; });
        
        if (count >= 2) {
          scoreResultObject = { score: Math.floor(Math.random() * 15) + 85, feedback: "Excellent response! Strongly articulated with relevant terminology." };
        } else if (count >= 1) {
          scoreResultObject = { score: Math.floor(Math.random() * 15) + 65, feedback: "Solid response. Covered main points, but could be more precise." };
        } else {
          scoreResultObject = { score: Math.floor(Math.random() * 15) + 40, feedback: "Your answer seems slightly off-topic or generic. Ground it in specifics." };
        }
      }
      
      setScoreResult(scoreResultObject);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="page active" id="page-questions">
      <div className="page-header">
        <h2>❓ Question Bank — 60+ Real Questions</h2>
        <p>Browse, filter, and practice individual questions</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <select 
          className="form-select" 
          style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}
          value={streamFilter}
          onChange={(e) => setStreamFilter(e.target.value)}
        >
          <option value="">All Streams</option>
          <option value="SDE">SDE</option>
          <option value="AI/ML">AI/ML</option>
          <option value="Core">Core</option>
        </select>
        <select 
          className="form-select" 
          style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)' }}
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button className="btn btn-accent" onClick={() => setModalOpen(true)}>🤖 Auto Generate</button>
      </div>

      <div className="qn-list">
        {loading ? (
          <p>Loading questions...</p>
        ) : questions.length === 0 ? (
          <p>No questions found.</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="card2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{q.text}</div>
                <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{q.category} • {q.difficulty} • {q.stream}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => handlePractice(q)}>Practice</button>
            </div>
          ))
        )}
      </div>

      {activeQuestion && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '600px', maxWidth: '100%', background: 'var(--card)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold' }}>✍️ Practice Question</div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setActiveQuestion(null)}>✕</button>
            </div>
            
            <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <strong>Q: {activeQuestion.text}</strong>
            </div>

            {scoreResult ? (
              <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                <h3 style={{ color: 'var(--accent)', marginBottom: '8px' }}>Score: {scoreResult.score}/100</h3>
                <p style={{ marginBottom: '16px' }}>{scoreResult.feedback}</p>
                
                <div style={{ padding: '12px', background: 'var(--bg3)', borderRadius: '6px', borderLeft: '4px solid var(--accent2)' }}>
                  <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text)' }}>💡 Sample Expert Answer:</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', fontStyle: 'italic' }}>
                    {(() => {
                      const q = activeQuestion?.text?.toLowerCase() || '';
                      if (q.includes('conflict')) return '"In my last project, two senior engineers disagreed on the tech stack. I set up a timeboxed sync where both presented pros/cons objectively against our deadlines. I then built a quick prototype comparing performance. Data proved Team A\'s approach was 20% faster, so we aligned on that and shipped on time."';
                      if (q.includes('threads')) return '"A process is an executing program with its own isolated memory space. A thread is a lightweight unit of execution within a process that shares the same memory. Threads are faster to create and context switch, but require careful synchronization (e.g., mutexes) to avoid race conditions since they share data."';
                      if (q.includes('quicksort')) return '"The worst-case time complexity of quicksort is O(n^2), which happens when the pivot chosen is consistently the smallest or largest element (like in an already sorted array). To avoid this, you can use randomized pivot selection or the median-of-three method, which helps guarantee the O(n log n) average case."';
                      if (q.includes('overfitting')) return '"Overfitting occurs when an ML model learns the training data too well, including its noise, resulting in poor generalization to new data. To prevent this, I typically use techniques like cross-validation, applying regularization (L1/L2), utilizing dropout layers in neural networks, or simplifying the model architecture."';
                      if (q.includes('twitter')) return '"A system like Twitter requires a highly scalable read-heavy architecture. I would use load balancers distributing traffic to stateless API servers. For the feed, I would implement a fan-out-on-write approach using Redis clusters to pre-compute timelines for active users. Cassandra would be ideal for storing the massive volume of tweets due to its high write throughput."';
                      return '"A strong answer structurally defines the core concept, explains its trade-offs, and provides a direct, metric-driven example of how you have personally applied it to solve a business problem."';
                    })()}
                  </p>
                </div>
                
                <button className="btn btn-primary" style={{ marginTop: '16px', width: '100%' }} onClick={() => setActiveQuestion(null)}>Done</button>
              </div>
            ) : (
              <>
                <textarea 
                  className="form-input" 
                  style={{ minHeight: '150px', resize: 'vertical' }} 
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                />
                <button 
                  className="btn btn-teal" 
                  style={{ width: '100%', opacity: submitting ? 0.7 : 1 }}
                  onClick={handleSubmitAnswer}
                  disabled={submitting}
                >
                  {submitting ? 'AI is grading...' : 'Submit Answer'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '400px', background: 'var(--card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ fontWeight: 'bold' }}>🤖 Auto Question Generator</div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }} onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <div className="form-group">
              <label>Topic / Subject</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Machine Learning..." 
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-accent" 
              style={{ width: '100%', opacity: generating ? 0.7 : 1 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Questions'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
