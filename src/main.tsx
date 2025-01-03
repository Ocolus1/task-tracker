import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthWrapper } from '@/components/AuthWrapper';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthWrapper>
      <App />
    </AuthWrapper>
  </StrictMode>
);