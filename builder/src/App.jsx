import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy Load Pages for Performance
// Handling named exports by destructuring in the promise chain
const AuthPage = lazy(() => import('./pages/AuthPage').then(module => ({ default: module.AuthPage })));
const EditorPage = lazy(() => import('./pages/EditorPage').then(module => ({ default: module.EditorPage })));

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
