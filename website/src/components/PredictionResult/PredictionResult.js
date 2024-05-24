// src/components/PredictionResult/PredictionResult.js
import React from 'react';
import './PredictionResult.css';

const PredictionResult = ({ data }) => {
  return (
    <div className="prediction-result">
      <h2>Prediction Result</h2>
      <p>Class: {data.class}</p>
      <p>Confidence: {data.confidence}%</p>
    </div>
  );
};

export default PredictionResult;
