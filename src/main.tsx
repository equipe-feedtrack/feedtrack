import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx'; // ✅ importa o provider

createRoot(document.getElementById("root")!).render(
  <AuthProvider> 
    <App />
  </AuthProvider>
);
