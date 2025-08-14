import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './main.scss';
import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from '@itwin/itwinui-react';

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <ThemeProvider includeCss={false}>
    <App />
  </ThemeProvider>
);
