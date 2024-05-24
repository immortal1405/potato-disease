// src/components/FileUpload/FileUpload.js
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import PredictionResult from '../PredictionResult/PredictionResult';
import './FileUpload.css';

const FileUpload = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPredictionData(response.data);
      setShowResetButton(true);
    } catch (error) {
      setError('Error uploading file. Please try again.');
      console.error('Error uploading file: ', error);
    } finally {
      setUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPredictionData(null);
    setError(null);
    setShowResetButton(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/*',
    multiple: false
  });

  return (
    <div className="file-upload">
      {!selectedFile && !predictionData && (
        <div className="dropzone" {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop an image here, or click to select an image</p>
        </div>
      )}
      {selectedFile && (
        <div className="preview">
          <img src={URL.createObjectURL(selectedFile)} alt="Preview" />
        </div>
      )}
      {predictionData && <PredictionResult data={predictionData} />}
      <div className="actions">
        {!predictionData && (
          <button className="predict-button" onClick={handleUpload} disabled={!selectedFile || uploading}>
            {uploading ? 'Predicting...' : 'Predict'}
          </button>
        )}
        {showResetButton && (
          <button className="reset-button" onClick={resetState}>
            Reset
          </button>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileUpload;
