
import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  // 'useState' will store the message we get from the backend.
  const [backendMessage, setBackendMessage] = useState('');
  

  
  useEffect(() => {
    const user1= {name:"rahul"};
    // We use the fetch API to make a GET request to our backend endpoint.
    fetch('http://localhost:8080/api/health')
      .then(response => response.json()) // Parse the JSON response
      .then(data => {
        // Update our state with the message from the backend
        setBackendMessage(data.message);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setBackendMessage('Could not connect to backend.');
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <h2>Backend Connection Status</h2>
        <p>
          {/* Display the message from the backend, or a loading message */}
          {backendMessage ? <strong>{backendMessage}</strong> : 'Loading...'}
        </p>
      </div>
    </>
  );
}

export default App;