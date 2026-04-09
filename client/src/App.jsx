import { useState, useEffect } from 'react';
import './App.css';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Resume from './components/Resume';
import StreamInterview from './components/StreamInterview';
import CompanyInterview from './components/CompanyInterview';
import QuestionBank from './components/QuestionBank';
import VideoInterview from './components/VideoInterview';
import { Reports, Comparison, Predictor, Improvement, WeakAreas, Recordings } from './components/AnalyticsComponents';

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('Checking...');

  useEffect(() => {
    // Check backend connection quietly
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/test`)
      .then(res => res.json())
      .then(data => {
        console.log("Backend Connected:", data);
        setBackendStatus(data.db_status || 'Connected');
      })
      .catch(err => {
        console.error("Backend Error:", err);
        setBackendStatus('Disconnected');
      });
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    // Future: React Router logic can go here
  };

  // If user isn't logged in, show Auth Screen
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Once logged in, show standard layout
  return (
    <>
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate} 
        onLogout={handleLogout} 
        user={user}
      />
      <div className="main-content">
        <div style={{ paddingBottom: '16px', fontSize: '12px', color: 'var(--text2)', textAlign: 'right' }}>
          Backend DB: {backendStatus}
        </div>
        {activePage === 'dashboard' && <Dashboard user={user} onNavigate={handleNavigate} />}
        {activePage === 'resume' && <Resume user={user} />}
        {activePage === 'stream' && <StreamInterview user={user} />}
        {activePage === 'company' && <CompanyInterview user={user} />}
        {activePage === 'questions' && <QuestionBank user={user} />}
        {activePage === 'video' && <VideoInterview />}
        {activePage === 'reports' && <Reports user={user} />}
        {activePage === 'comparison' && <Comparison user={user} />}
        {activePage === 'predictor' && <Predictor user={user} />}
        {activePage === 'improvement' && <Improvement user={user} />}
        {activePage === 'weakareas' && <WeakAreas user={user} />}
        {activePage === 'recordings' && <Recordings user={user} />}
      </div>
    </>
  );
}

export default App;
