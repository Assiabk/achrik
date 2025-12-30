// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (storedToken && userData) {
      setToken(storedToken);
      setUser(JSON.parse(userData));
      
      // Validate token with backend
      validateToken(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Token is invalid, clear everything
        clearAuth();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        // Store token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        
        navigate('/dashboard');
        return { success: true, user: data.user };
      } else {
        return { 
          success: false, 
          error: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      const currentToken = localStorage.getItem('authToken');
      
      if (currentToken) {
        // Call server logout endpoint
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
          },
        });
      }
      
      // Clear local storage and state
      clearAuth();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if server call fails
      clearAuth();
      return false;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    updateUser,
    isAuthenticated: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};