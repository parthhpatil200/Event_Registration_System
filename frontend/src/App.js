import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

/* const API_URL = 'http://localhost:5000/registrations'; */
const API_URL = 'http://YOUR_PUBLIC_IP:5000/registrations';

function App() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Fetch all registrations on mount ──────────────────────────────────────
  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(API_URL);
      setRegistrations(res.data);
    } catch (err) {
      console.error('Failed to fetch registrations:', err.message);
    }
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    return newErrors;
  };

  // ── Handle form input change ───────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear the field error as user types
    setErrors({ ...errors, [e.target.name]: '' });
    setServerMessage('');
  };

  // ── Handle form submission ─────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerMessage('');
    try {
      await axios.post(API_URL, form);
      setForm({ name: '', email: '', phone: '' });
      setErrors({});
      setServerMessage('✅ Registration successful!');
      fetchRegistrations();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Try again.';
      setServerMessage(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // ── Handle delete ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this registration?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRegistrations(registrations.filter((r) => r._id !== id));
    } catch (err) {
      alert('Failed to delete registration.');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <h1>🎟️ Event Registration</h1>
        <p>Register for our upcoming event below</p>
      </header>

      <main className="app-main">
        {/* Registration Form */}
        <section className="form-section">
          <h2>Register Now</h2>
          <form onSubmit={handleSubmit} noValidate>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter 10-digit phone number"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
                maxLength={10}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Register'}
            </button>

            {serverMessage && (
              <p className={serverMessage.startsWith('✅') ? 'success-msg' : 'server-error-msg'}>
                {serverMessage}
              </p>
            )}
          </form>
        </section>

        {/* Registered Participants */}
        <section className="list-section">
          <h2>Registered Participants ({registrations.length})</h2>
          {registrations.length === 0 ? (
            <p className="no-data">No registrations yet. Be the first to register!</p>
          ) : (
            <table className="reg-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg, index) => (
                  <tr key={reg._id}>
                    <td>{index + 1}</td>
                    <td>{reg.name}</td>
                    <td>{reg.email}</td>
                    <td>{reg.phone}</td>
                    <td>{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(reg._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
