import React, { useState } from 'react';

const Sign = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
     role: 'user',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:8888/api/signUp",{
        method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        });
    }
    catch(e)
    {
      console.log("Error in sending data",e)
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <label htmlFor="firstName" className="block mb-2 font-semibold">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter your first name"
        />

        <label htmlFor="lastName" className="block mb-2 font-semibold">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter your last name"
        />

{/* 2. *Username Generation*:
   - Use email addresses as usernames (most common approach)
   - Alternatively: firstname.lastname + number if needed */}

        <label htmlFor="email" className="block mb-2 font-semibold">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter your email"
        />

<div className="mb-6">
  <label className="block mb-2 font-semibold text-center">Role</label>
  <div className="flex justify-center items-center space-x-4">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="role"
        value="user"
        checked={formData.role === 'user'}
        onChange={handleChange}
        className="text-green-600"
      />
      <span className="ml-2">User</span>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="role"
        value="admin"
        checked={formData.role === 'admin'}
        onChange={handleChange}
        className="text-green-600"
      />
      <span className="ml-2">Admin</span>
    </label>
  </div>
</div>

        <label htmlFor="username" className="block mb-2 font-semibold">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Enter your username"
        />

        <label htmlFor="password" className="block mb-2 font-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 mb-6 border border-gray-300 rounded"
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Sign;
