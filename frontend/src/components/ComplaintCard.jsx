import React from 'react';
import ApiService from '../services/api';
import { useComplaintStore } from '../store/ComplaintStore';

const ComplaintCard = ({ complaint }) => {
  const { dispatch } = useComplaintStore();

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await ApiService.updateComplaintStatus(complaint.id, newStatus);
      dispatch({ type: 'UPDATE_COMPLAINT', payload: response.complaint });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#27ae60'
    };
    return colors[priority] || '#95a5a6';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#3498db',
      in_progress: '#f39c12',
      resolved: '#27ae60',
      closed: '#95a5a6'
    };
    return colors[status] || '#95a5a6';
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    border: '1px solid #e8e9ea',
    borderLeft: `4px solid ${getPriorityColor(complaint.priority_id)}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    lineHeight: '1.4'
  };

  const badgeStyle = {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  const descriptionStyle = {
    marginBottom: '20px',
    color: '#5a6c7d',
    fontSize: '14px',
    lineHeight: '1.6',
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e9ecef'
  };

  const metaStyle = {
    fontSize: '13px',
    color: '#6c757d',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const selectStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#495057',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categoryDisplayNames = {
    water_supply: 'Water Supply',
    road_maintenance: 'Road Maintenance',
    waste_management: 'Waste Management',
    electrical: 'Electrical Issues',
    general: 'General'
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={headerStyle}>
        <h3 style={titleStyle}>{complaint.title}</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              ...badgeStyle, 
              backgroundColor: getPriorityColor(complaint.priority_id) 
            }}
          >
            {complaint.priority_id} Priority
          </span>
          <span 
            style={{ 
              ...badgeStyle, 
              backgroundColor: getStatusColor(complaint.status) 
            }}
          >
            {complaint.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div style={descriptionStyle}>
        <strong style={{ color: '#2c3e50', fontSize: '13px' }}>Description:</strong>
        <p style={{ margin: '8px 0 0 0' }}>{complaint.description}</p>
      </div>

      <div style={footerStyle}>
        <div style={metaStyle}>
          <span>
            <strong>Category:</strong> {categoryDisplayNames[complaint.category_id] || complaint.category_id}
          </span>
          <span>
            <strong>ID:</strong> {complaint.id.substring(0, 8)}...
          </span>
          <span>
            <strong>Created:</strong> {formatDate(complaint.created_at)}
          </span>
          {complaint.updated_at !== complaint.created_at && (
            <span>
              <strong>Updated:</strong> {formatDate(complaint.updated_at)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label htmlFor={`status-${complaint.id}`} style={{ fontSize: '14px', fontWeight: '500', color: '#495057' }}>
            Status:
          </label>
          <select
            id={`status-${complaint.id}`}
            value={complaint.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ced4da'}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
