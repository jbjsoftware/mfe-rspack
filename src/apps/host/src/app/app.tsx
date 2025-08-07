import * as React from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Dynamically import remote modules with proper shared configuration
const Dashboard = lazy(() => import('dashboard/Module'));
const Connections = lazy(() => import('connections/Module'));

export function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🎉 Module Federation Host</h1>
      <p>Welcome to the Module Federation host application!</p>
      <p>Environment: {process.env.NODE_ENV || 'development'}</p>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f0f8ff',
          border: '1px solid #0066cc',
          borderRadius: '5px',
        }}
      >
        <h3>✅ Status: Working</h3>
        <p>React bootstrap is functioning correctly!</p>
      </div>

      {/* Navigation */}
      <nav style={{ margin: '20px 0' }}>
        <Link
          to="/"
          style={{
            marginRight: '10px',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '4px',
          }}
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          style={{
            marginRight: '10px',
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            borderRadius: '4px',
          }}
        >
          Dashboard
        </Link>
        <Link
          to="/connections"
          style={{
            textDecoration: 'none',
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            borderRadius: '4px',
          }}
        >
          Connections
        </Link>
      </nav>

      {/* Routes */}
      <div
        style={{
          marginTop: '20px',
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <h2>🏠 Home</h2>
                <p>
                  Select a module from the navigation above to see Module
                  Federation in action!
                </p>
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div>🔄 Loading Dashboard module...</div>}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/connections"
            element={
              <Suspense fallback={<div>🔄 Loading Connections module...</div>}>
                <Connections />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
