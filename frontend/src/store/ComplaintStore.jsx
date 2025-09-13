import React, { createContext, useContext, useReducer } from 'react';

const ComplaintContext = createContext();

const initialState = {
  complaints: [],
  categories: [],
  priorities: [],
  loading: false,
  error: null,
  filters: {}
};

const complaintReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_COMPLAINTS':
      return { ...state, complaints: action.payload, loading: false };
    case 'ADD_COMPLAINT':
      return { ...state, complaints: [action.payload, ...state.complaints] };
    case 'UPDATE_COMPLAINT':
      return {
        ...state,
        complaints: state.complaints.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_PRIORITIES':
      return { ...state, priorities: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
};

export const ComplaintProvider = ({ children }) => {
  const [state, dispatch] = useReducer(complaintReducer, initialState);

  return (
    <ComplaintContext.Provider value={{ state, dispatch }}>
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaintStore = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaintStore must be used within a ComplaintProvider');
  }
  return context;
};