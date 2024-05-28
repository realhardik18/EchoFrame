import React, { useState, useEffect } from 'react';
import './Navbar.css'; // Import the CSS file

function App() {
    const [buttonText, setButtonText] = useState('Text 1');
    const texts = ['message1', 'message2', 'message3'];
  
    useEffect(() => {
      let index = 0;
      const intervalId = setInterval(() => {
        setButtonText(texts[index]);
        index = (index + 1) % texts.length;
      }, 1000); // Change the text every second
  
      return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="navbar bg-primary text-primary-content">
        <button className="btn btn-ghost text-xl w-36">EchoFrame</button>
        <button className="btn text-xl ml-auto w-36">{buttonText}</button>            
    </div>
  );
}

export default App;
