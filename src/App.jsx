import React from 'react';
import { Gallery } from './components/Gallery';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <main>
        <Gallery />
      </main>
    </div>
  );
}

export default App;
