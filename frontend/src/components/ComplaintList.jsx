import React, { useEffect, useState } from 'react';
import { useComplaintStore } from '../store/ComplaintStore';
import ComplaintCard from './ComplaintCard';
import ApiService from '../services/api';

const ComplaintList = () => {
  const { state, dispatch } = useComplaintStore();
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  });

  useEffect(() => {
    loadComplaints();
    loadCategories();
    loadPriorities();
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [filters]);

  const loadComplaints = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value)
      );
      const response = await ApiService.getComplaints(activeFilters);
      dispatch({ type: 'SET_COMPLAINTS', payload: response.complaints });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: response.categories });
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadPriorities = async () => {
    try {
      const response = await ApiService.getPriorities();
      dispatch({ type: 'SET_PRIORITIES', payload: response.priorities });
    } catch (error) {
      console.error('Failed to load priorities:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filterStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  };

  const selectStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minWidth: '120px'
  };

  if (state.loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (state.error) {
    return (
      <div style={{ 
        color: '#dc3545', 
        textAlign: 'center', 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}>
        Error: {state.error}
      </div>
    );
  }

  return (
    <div>
      <h2>All Complaints ({state.complaints.length})</h2>
      
      {/* Filters */}
      <div style={filterStyle}>
        <div>
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={selectStyle}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={selectStyle}
          >
            <option value="">All Categories</option>
            {state.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority-filter">Priority:</label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={selectStyle}
          >
            <option value="">All Priorities</option>
            {state.priorities.map(priority => (
              <option key={priority.id} value={priority.id}>
                {priority.name}
              </option>
            ))}
          </select>
        </div>

        {(filters.status || filters.category || filters.priority) && (
          <button
            onClick={() => setFilters({ status: '', category: '', priority: '' })}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Complaints List */}
      {state.complaints.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '8px'
        }}>
          <h3>No complaints found</h3>
          <p>Try adjusting your filters or submit a new complaint.</p>
        </div>
      ) : (
        <div>
          {state.complaints.map(complaint => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintList;