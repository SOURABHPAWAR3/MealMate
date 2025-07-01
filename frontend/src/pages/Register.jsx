import { useState } from 'react';

const Register = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      setMessage('Please provide both name and image');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const res = await fetch('http://localhost:5000/register_user', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message);
        setName('');
        setImage(null);
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (error) {
      setMessage('Something went wrong!');
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Register Face</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>

        {message && <p className="text-center mt-2 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
