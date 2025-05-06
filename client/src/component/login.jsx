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
      }

      //sth is wrong here need to fixthis... arent we suppose to dothisusing clerk ??
      navigate('/dashboard'); 
    } catch (e) {
      console.error("Error while logging in:", e);
      alert(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" onChange={handleChange} required />
      <input type="text" name="username" onChange={handleChange} required />
      <input type="password" name="password" onChange={handleChange} required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
