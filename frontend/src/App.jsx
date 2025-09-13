import './styles/App.css';
import React, { useState } from 'react';
import { ComplaintProvider } from './store/ComplaintStore';
import ComplaintForm from './components/ComplaintForm';
import ComplaintList from './components/ComplaintList';

const App = () => {
  const [activeTab, setActiveTab] = useState('list');

  const appStyles = {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '3rem 1rem',
    textAlign: 'center',
    marginBottom: '0',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  };

  const headerTitleStyle = {
    margin: '0 0 0.5rem 0',
    fontSize: '2.5rem',
    fontWeight: '700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  const headerSubtitleStyle = {
    margin: '0',
    fontSize: '1.2rem',
    opacity: '0.9',
    fontWeight: '300'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };

  const navStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  };

  const tabStyle = {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#6c757d',
    transition: 'all 0.3s ease',
    position: 'relative'
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#007bff',
    backgroundColor: '#f8f9ff',
    fontWeight: '600'
  };

  const tabIndicatorStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '3px',
    backgroundColor: '#007bff',
    borderRadius: '3px 3px 0 0'
  };

  const contentStyle = {
    animation: 'fadeIn 0.3s ease-in'
  };

  // Add CSS animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .tab-button:hover {
        background-color: #f8f9fa !important;
        color: #495057 !important;
      }
      
      .container-shadow {
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  return (
    <ComplaintProvider>
      <div style={appStyles}>
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>Complaint Management System</h1>
          <p style={headerSubtitleStyle}>Submit and track complaints efficiently with AI-powered categorization</p>
        </div>

        <div style={containerStyle}>
          <nav style={navStyle}>
            <button
              className="tab-button"
              style={activeTab === 'list' ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab('list')}
            >
              📋 All Complaints
              {activeTab === 'list' && <div style={tabIndicatorStyle}></div>}
            </button>
            <button
              className="tab-button"
              style={activeTab === 'create' ? activeTabStyle : tabStyle}
              onClick={() => setActiveTab('create')}
            >
              ➕ Submit Complaint
              {activeTab === 'create' && <div style={tabIndicatorStyle}></div>}
            </button>
          </nav>

          <div style={contentStyle}>
            {activeTab === 'create' && (
              <div className="container-shadow">
                <ComplaintForm onComplaintCreated={() => setActiveTab('list')} />
              </div>
            )}

            {activeTab === 'list' && (
              <div className="container-shadow">
                <ComplaintList />
              </div>
            )}
          </div>
        </div>
      </div>
    </ComplaintProvider>
  );
};

export default App;