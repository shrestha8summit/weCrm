import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8888/api/logIn", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await res.json();
      console.log(data);
  
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('loggedIn', true);
        localStorage.setItem('userType', data.userType); // Assuming userType is returned from the server
      }
  
      // Redirect based on user type
      if (data.userType === 'admin') {
        navigate('/dashboard'); // Redirect admin to dashboard
      } else {
        navigate('/userProfile'); // Redirect regular user to user profile
      }
    } catch (e) {
      console.error("Error while logging in:", e);
      alert(e.message);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5 rounded-lg shadow-md">
    <h2 className="mb-5 text-2xl text-gray-800">Login</h2>
    <form onSubmit={handleSubmit} className="flex flex-col w-72">
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
        className="mb-4 p-2.5 rounded border border-gray-300 text-base"
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
        className="mb-4 p-2.5 rounded border border-gray-300 text-base"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        className="mb-4 p-2.5 rounded border border-gray-300 text-base"
      />

      <p className="mb-4">
        <a href="/forgetPassword" className="text-blue-600 hover:text-blue-800">
          Forget password
        </a>
      </p>

      <button
        type="submit"
        className="p-2.5 rounded bg-blue-600 text-white text-base cursor-pointer hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </form>
  </div>
  );
};

export default Login;
