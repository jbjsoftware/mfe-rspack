import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import './styles.css';
import { RepoUiProvider } from '@repo/ui';

import '@repo/ui/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <StrictMode>
    <BrowserRouter>
      <RepoUiProvider>
        <App />
      </RepoUiProvider>
    </BrowserRouter>
  </StrictMode>
);
