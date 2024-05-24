// src/components/PredictionResult/PredictionResult.js
import React from 'react';
import './PredictionResult.css';

const PredictionResult = ({ data }) => {
  return (
    <div className="prediction-result">
      <h2>Detection Result</h2>
      <p>Disease: {data.class}</p>
      <p>Confidence: {data.confidence}%</p>
    </div>
  );
};

export default PredictionResult;
