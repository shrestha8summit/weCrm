import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
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
      body: JSON.stringify({
        email: formData.email,
        username: formData.username, 
        password: formData.password
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    console.log("Login success:", data);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('loggedIn', true);
      const userType = data.userType || data.user?.role;
      localStorage.setItem('userType', userType);
      
      if (userType === 'admin') {
        navigate('/dashboard');
        window.location.reload(); 
      } else {
        navigate('/userProfile');
        window.location.reload(); 
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Login failed. Please check your credentials.");
  }
};

  return (
    <>
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
      <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
           

      <p className="mb-4 mt-4">
        <a href="/forgetPassword" className="text-[#ff8633] hover:text-blue-800">
          Forget password
        </a>
      </p>

      <button
        type="submit"
        className="p-2.5 rounded-xl bg-[#ff8633] text-white text-base cursor-pointer hover:bg-blue-700 transition-colors"
      >
        Login
      </button>
    </form>
  </div>
  </>
  );
};


export default Login;