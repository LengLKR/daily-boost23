// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Form data:', formData);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>START FOR FREE</h2>
        <h1>Create new account.</h1>
        <p>
          Already A Member? <a href="/login">Log In</a>
        </p>
        <div className="logo">
        <div className="logo-circle"></div>
        <span>Anywhere app.</span>
      </div>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/join">Join</a>
      </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="create-btn">
            Create account
          </button>

          <button type="button" className="change-method">
            Change method
          </button>
        </form>
      </div>
    </div>
  );
}
