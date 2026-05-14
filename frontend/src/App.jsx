import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

/* const API_URL = 'http://localhost:5000/registrations'; */
const API_URL = 'http://3.110.159.83:5000/registrations';

const EMPTY_FORM = { name: '', email: '', phone: '' };

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>
      <span className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</span>
      <span>{toast.message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

function EditModal({ reg, onClose, onSave }) {
  const [form, setForm] = useState({ name: reg.name, email: reg.email, phone: reg.phone });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone must be exactly 10 digits.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/${reg._id}`, form);
      onSave(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update registration.';
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>✏️ Edit Registration</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="edit-name">Full Name</label>
            <input
              id="edit-name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-email">Email Address</label>
            <input
              id="edit-email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="edit-phone">Phone Number</label>
            <input
              id="edit-phone"
              name="phone"
              type="text"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
              maxLength={10}
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
          {errors.server && <p className="server-error-msg">{errors.server}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message, type = 'success') => setToast({ message, type });
  const closeToast = useCallback(() => setToast(null), []);

  const fetchRegistrations = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setRegistrations(res.data);
    } catch {
      showToast('Failed to load registrations.', 'error');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => { fetchRegistrations(); }, [fetchRegistrations]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\d{10}$/.test(form.phone)) e.phone = 'Phone must be exactly 10 digits.';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setSubmitLoading(true);
    try {
      await axios.post(API_URL, form);
      setForm(EMPTY_FORM);
      setErrors({});
      showToast('Registration successful! Welcome aboard 🎉');
      fetchRegistrations();
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRegistrations((prev) => prev.filter((r) => r._id !== id));
      showToast('Registration deleted.');
    } catch {
      showToast('Failed to delete registration.', 'error');
    }
  };

  const handleSaveEdit = (updated) => {
    setRegistrations((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    setEditTarget(null);
    showToast('Registration updated successfully ✨');
  };

  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery)
  );

  return (
    <div className="app">
      <Toast toast={toast} onClose={closeToast} />
      {editTarget && (
        <EditModal
          reg={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">🎟️</div>
          <h1>Event Registration</h1>
          <p>Manage attendees — register, update, or remove participants</p>
        </div>
        <div className="header-stats">
          <div className="stat-chip">
            <span className="stat-value">{registrations.length}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Registration Form */}
        <section className="card form-section">
          <div className="section-header">
            <h2>➕ New Registration</h2>
            <p className="section-sub">Fill in the details to register a participant</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. John Doe"
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
                  placeholder="e.g. john@example.com"
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
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'input-error' : ''}
                  maxLength={10}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-footer">
              <button type="submit" id="btn-register" className="btn-submit" disabled={submitLoading}>
                {submitLoading ? (
                  <><span className="spinner"></span> Registering…</>
                ) : (
                  '🎫 Register Participant'
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Participants List */}
        <section className="card list-section">
          <div className="list-header">
            <div className="section-header">
              <h2>👥 Registered Participants</h2>
              <p className="section-sub">{registrations.length} participant{registrations.length !== 1 ? 's' : ''} registered</p>
            </div>
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                id="search-participants"
                type="text"
                className="search-input"
                placeholder="Search by name, email or phone…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
          </div>

          {fetchLoading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading registrations…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{searchQuery ? '🔎' : '📋'}</div>
              <p>{searchQuery ? 'No results match your search.' : 'No registrations yet. Be the first to register!'}</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="reg-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((reg, index) => (
                    <tr key={reg._id}>
                      <td className="td-index">{index + 1}</td>
                      <td className="td-name">
                        <div className="avatar">{reg.name.charAt(0).toUpperCase()}</div>
                        {reg.name}
                      </td>
                      <td>{reg.email}</td>
                      <td>{reg.phone}</td>
                      <td>{new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-edit"
                            title="Edit"
                            onClick={() => setEditTarget(reg)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-delete"
                            title="Delete"
                            onClick={() => handleDelete(reg._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Event Registration System &bull; Built with MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
