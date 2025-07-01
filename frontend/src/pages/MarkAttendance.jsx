// src/pages/MarkAttendance.jsx
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MarkAttendance = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const [imageSrc, setImageSrc] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [reason, setReason] = useState('');

  // Fetch all customers for manual dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(res => setCustomers(res.data))
      .catch(err => console.error(err));
  }, []);

  // 🔆 Check lighting before capture
  const isLowLight = (imageData) => {
    const data = imageData.data;
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    const brightness = total / (data.length / 4);
    return brightness < 60;
  };

  // 📸 Capture
  const capture = () => {
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (isLowLight(imageData)) {
      setMessage('⚠️ Low Light Detected. Please improve lighting or use manual option.');
      return;
    }

    const image = canvas.toDataURL('image/jpeg');
    setImageSrc(image);
    setMessage('✅ Image Captured Successfully');
  };

  const retake = () => {
    setImageSrc(null);
    setMessage('');
  };

  // ✅ Submit to backend
  const handleSubmit = async () => {
    setLoading(true);
    setMessage('');

    try {
      const blob = await fetch(imageSrc).then(res => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      const res = await axios.post('http://localhost:5000/verify', formData);

      setMessage(
        `✅ ${res.data.message}\nName: ${res.data.name}\nRemaining Meals: ${res.data.remaining_meals}`
      );

      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error) {
      console.error(error);
      setMessage('❌ Face not recognized or Server Error');
    }

    setLoading(false);
  };

  const handleManualSubmit = async () => {
    if (!selectedCustomer || !reason) {
      setMessage('⚠️ Please select a customer and provide a reason.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/manual-log', {
        name: selectedCustomer,
        reason,
      });

      setMessage(`✅ Meal logged manually for ${selectedCustomer}`);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to log manually');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Mark Attendance via Face Recognition</h2>

      {manualMode ? (
        <div className="bg-white text-black p-6 rounded-xl shadow-md w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Manual Attendance</h3>
          <select
            className="w-full mb-4 p-2 border rounded"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- Select Customer --</option>
            {customers.map((user, index) => (
              <option key={index} value={user.name}>{user.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Reason (e.g. Low Light)"
            className="w-full mb-4 p-2 border rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <button
            onClick={handleManualSubmit}
            className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold text-white w-full"
          >
            Submit Manually
          </button>
        </div>
      ) : (
        <>
          {imageSrc ? (
            <>
              <img
                src={imageSrc}
                alt="Captured"
                className="w-64 h-64 rounded-xl mb-4 border-4 border-white shadow-lg"
              />
              <div className="flex gap-4">
                <button
                  onClick={retake}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold"
                >
                  Retake
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-semibold"
                >
                  {loading ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </>
          ) : (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
                className="rounded-xl mb-4 shadow-lg"
              />
              <button
                onClick={capture}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg font-semibold"
              >
                📸 Capture
              </button>
            </>
          )}
        </>
      )}

      <button
        onClick={() => setManualMode(!manualMode)}
        className="mt-6 text-sm underline hover:text-yellow-300"
      >
        {manualMode ? '🔙 Back to Face Recognition' : `❓ Can't Recognize? Mark Manually`}
      </button>

      {message && (
        <p className="mt-4 text-lg font-medium text-center whitespace-pre-line">{message}</p>
      )}
    </div>
  );
};

export default MarkAttendance;
