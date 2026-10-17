import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css'; // shared styles first, section styles (imported by the sections) override them
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
