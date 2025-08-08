import * as React from 'react';
import { Suspense, lazy } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Separator, Skeleton } from '@repo/ui';

// Dynamically import remote modules with proper shared configuration
const Dashboard = lazy(() => import('dashboard/Module'));
const Connections = lazy(() => import('connections/Module'));

const About = () => {
  return <div>About</div>;
};

export function App() {
  return (
    <div className="p-8 h-screen">
      <h1>🎉 Module Federation Host</h1>
      <p>Welcome to the Module Federation host application!</p>
      <p>Environment: {process.env.NODE_ENV || 'development'}</p>

      <Button variant="default">Click me</Button>

      <Separator className="my-4" />

      <Skeleton className="w-full h-10" />

      {/* Navigation */}
      <nav style={{ margin: '20px 0' }}>
        <Link
          to="/"
          className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="bg-green-500 text-white rounded-md px-4 py-2 mr-2"
        >
          Dashboard
        </Link>
        <Link
          to="/connections"
          className="bg-red-500 text-white rounded-md px-4 py-2"
        >
          Connections
        </Link>
        <Link
          to="/about"
          className="bg-yellow-500 text-white rounded-md px-4 py-2"
        >
          About
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
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
