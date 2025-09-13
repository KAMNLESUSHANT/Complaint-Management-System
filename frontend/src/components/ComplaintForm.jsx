import React, { useState, useEffect } from 'react';
import { useComplaintStore } from '../store/ComplaintStore';
import ApiService from '../services/api';

const ComplaintForm = ({ onComplaintCreated }) => {
  const { state, dispatch } = useComplaintStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_id: 'user123' // In real app, this would come from auth
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: response.categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await ApiService.createComplaint(formData);
      dispatch({ type: 'ADD_COMPLAINT', payload: response.complaint });
      setFormData({ title: '', description: '', user_id: 'user123' });
      if (onComplaintCreated) {
        onComplaintCreated(response.complaint);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    disabled: submitting
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Submit a Complaint</h2>
      
      <div>
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          style={inputStyle}
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          style={{ ...inputStyle, resize: 'vertical' }}
          required
        />
      </div>

      <button
        type="submit"
        style={buttonStyle}
        disabled={submitting}
      >
        {submitting ? 'Submitting...' : 'Submit Complaint'}
      </button>
    </form>
  );
};

export default ComplaintForm;