// src/components/AddCustomer.jsx
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const AddCustomer = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subscription_count: "",
    image: null,
  });

  const [useWebcam, setUseWebcam] = useState(false);
  const [message, setMessage] = useState("");
  const [captureMessage, setCaptureMessage] = useState("");
  const [preview, setPreview] = useState(null);
  const webcamRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      setCaptureMessage("");
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreview(imageSrc);

    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File(
          [blob],
          `${form.name || "customer"}_webcam.jpg`,
          { type: "image/jpeg" }
        );
        setForm({ ...form, image: file });
        setUseWebcam(false);
        setCaptureMessage("✅ Image Captured Successfully");
      });
  };

  const retakePhoto = () => {
    setUseWebcam(true);
    setPreview(null);
    setForm(prev => ({ ...prev, image: null }));
    setCaptureMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subscription_count || !form.image) {
      return setMessage("⚠️ All fields are required including image.");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("subscription_count", form.subscription_count);
    formData.append("image", form.image);

    try {
      const res = await axios.post("http://localhost:5000/admin/add-customer", formData);
      setMessage(res.data.message);
      setForm({ name: "", email: "", subscription_count: "", image: null });
      setPreview(null);
      setCaptureMessage("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-black">
      <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">Add New Customer</h2>

      {preview && (
        <div className="flex flex-col items-center mb-4">
          <img
            src={preview}
            alt="Captured Preview"
            className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-gray-300 mb-2"
          />
          <button
            onClick={retakePhoto}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1 px-4 rounded-full text-sm"
          >
            Retake Photo
          </button>
        </div>
      )}

      {captureMessage && (
        <p className="text-green-600 text-center mb-4 font-medium">{captureMessage}</p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="number"
          name="subscription_count"
          placeholder="Subscription Count"
          value={form.subscription_count}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        {useWebcam ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="mb-4 w-full rounded"
            />
            <button
              type="button"
              onClick={handleCapture}
              className="w-full bg-purple-600 text-white py-2 rounded mb-3"
            >
              📸 Capture
            </button>
          </>
        ) : (
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
          />
        )}

        <button
          type="button"
          onClick={() => {
            setUseWebcam(!useWebcam);
            setCaptureMessage("");
            setPreview(null);
          }}
          className="w-full bg-gray-200 py-2 rounded mb-3"
        >
          {useWebcam ? "Cancel Webcam" : "Use Webcam Instead"}
        </button>

        {/* ✅ Submit Button with Disabled State and Tooltip */}
        <div title={!form.image ? "Capture or select an image first" : ""}>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${
              form.image
                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!form.image}
          >
            Add Customer
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-purple-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default AddCustomer;
