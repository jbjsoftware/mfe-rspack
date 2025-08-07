import * as React from 'react';
import NxWelcome from './nx-welcome';
import { Link, Route, Routes } from 'react-router-dom';
import { loadRemote } from '@module-federation/enhanced/runtime';

const Dashboard = React.lazy(() => loadRemote('dashboard/Module') as any);
const Connections = React.lazy(() => loadRemote('connections/Module') as any);

export function App() {
  return (
    <React.Suspense fallback={null}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/connections">Connections</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<NxWelcome title="host" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/connections" element={<Connections />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
