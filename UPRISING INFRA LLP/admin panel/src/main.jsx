import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UIProvider } from './context/UIContext';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import './styles/admin.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <UIProvider>
        <StoreProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </StoreProvider>
      </UIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
