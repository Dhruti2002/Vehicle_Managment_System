// Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify({ name: result.name, token: result.token }));
            setUser({ name: result.name, token: result.token });
            navigate('/'); // Redirect to the home page
        } else {
            alert('Login failed: ' + result.message || 'Please try again');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
};

  return (
    <form onSubmit={handleSubmit}>
      <div className="dark:bg-black dark:text-white duration-300 min-h-screen flex items-center justify-center">
        <div className="login-form shadow-md rounded-lg bg-white dark:bg-gray-900 p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-5 font-serif text-center">Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-2 p-2 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 p-2 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="w-full p-2 bg-primary text-white rounded-md hover:bg-opacity-90">
              Login
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
