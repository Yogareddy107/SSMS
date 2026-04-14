import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import App from './App.tsx';
import './index.css';

const ThemeProviderWrapper = ThemeProvider as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderWrapper attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProviderWrapper>
  </StrictMode>,
);
