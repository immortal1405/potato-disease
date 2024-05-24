// src/App.js
import React, { useState } from 'react';
import FileUpload from './components/FileUpload/FileUpload';
import PredictionResult from './components/PredictionResult/PredictionResult';
import './App.css';

const App = () => {
  const [predictionData, setPredictionData] = useState(null);

  const handleUpload = (data) => {
    setPredictionData(data);
  };

  const resetState = () => {
    setPredictionData(null);
  };

  return (
    <div className="App">
      <h1>Potato Disease Detector</h1>
      {!predictionData && <FileUpload onUpload={handleUpload} />}
      {predictionData && <PredictionResult data={predictionData} />}
      {predictionData && (
        <button className="reset-button" onClick={resetState}>
          Reset
        </button>
      )}
    </div>
  );
};

export default App;
