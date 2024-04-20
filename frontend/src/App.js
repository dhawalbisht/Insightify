import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Footer from "./Footer";

function App() {
  const [pdfDocs, setPdfDocs] = useState([]);
  const [summary, setSummary] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleFileUpload = (event) => {
    setPdfDocs(Array.from(event.target.files));
  };

  const handleProcess = async () => {
    const formData = new FormData();
    pdfDocs.forEach((pdf) => {
      formData.append('pdf_docs', pdf);
    });

    try {
      const response = await axios.post('http://localhost:5000/process_pdfs', formData);
      setSummary(response.data.summary);
      setChatHistory(response.data.conversation_chain);
    } catch (error) {
      console.error('Error processing PDFs:', error);
    }
  };

  const handleUserInput = async () => {
    try {
      const response = await axios.post('http://localhost:5000/ask_question', {
        question: userQuestion,
        chat_history: chatHistory,
      });
      // Prepend the new chat history to the existing one
      setChatHistory(prevHistory => [...response.data.chat_history, ...prevHistory]);
      setUserQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <div>
      <header className="navbar">
        <div className="navbar-menu">
        <div className="blob"></div>
          <div className="website-logo"><img src={require("./insightify-white.png")} height="30px" style={{ paddingTop: '10px',marginBottom: '-5px', paddingRight: '15px' }} alt=""/>insightify</div>
        </div>
      </header>
      <div className="page-body">
        <div className="sidebar">
          <h3>Your documents</h3>
          <input type="file" multiple onChange={handleFileUpload} />
          <button onClick={handleProcess}>Process</button>
        </div>
        <div className="main-content">
          <div className="col1">
            <h1>Summary</h1>
            <p>{summary}</p>
          </div>
          <div className="col2">
            <h1>Chat with PDFs</h1>
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
            />
            <button onClick={handleUserInput}>Ask</button>
            <div className="chat-history">
              {chatHistory.map((message, index) => (
                <React.Fragment key={index}>
                  <div>
                    {index % 2 === 0 ? `Question: ${message.content}` : `Answer: ${message.content}`}
                  </div>
                  {/* Conditionally render <hr/> after answers only */}
                  {index % 2 !== 0 && <hr />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default App;