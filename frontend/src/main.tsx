import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css'; 
import App from './App.tsx';
import { store } from './stores';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const document: any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);