import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { ThemeProvider } from 'next-themes';
import App from './App.tsx';
import { FirebaseErrorBoundary } from './components/FirebaseErrorBoundary';
import './index.css';

const ThemeProviderWrapper = ThemeProvider as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProviderWrapper attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <FirebaseErrorBoundary>
        <App />
      </FirebaseErrorBoundary>
    </ThemeProviderWrapper>
  </StrictMode>,
);
