import React from 'react';
import './App.css';
import World from './components/World';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <World/>
        <a
          className="App-link"
          href="http://localhost:3000/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
