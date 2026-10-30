import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

// Lấy Google Client ID từ biến môi trường (hoặc chuỗi rỗng an toàn nếu chưa cấu hình)
const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || 'sqlearn-placeholder.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
