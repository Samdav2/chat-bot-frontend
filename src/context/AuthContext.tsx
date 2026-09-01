'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Agent, ApiResponse } from '@/types/support';
import { apiClient } from '@/lib/api-client';

interface AuthContextType {
  agent: Agent | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, agent: Agent) => void;
  logout: () => void;
  updateAgent: (updatedAgent: Agent) => void;
  toggleOnlineStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('agent_token');
        const storedAgent = localStorage.getItem('agent_user');

        if (storedToken && storedAgent) {
          setToken(storedToken);
          setAgent(JSON.parse(storedAgent));

          // Fetch fresh profile from /auth/me
          try {
            const response = await apiClient.get<ApiResponse<Agent>>('/auth/me');
            if (response.data.success && response.data.data) {
              setAgent(response.data.data);
              localStorage.setItem('agent_user', JSON.stringify(response.data.data));
            }
          } catch (err) {
            console.warn('Failed to refresh profile from server, using cached agent');
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth from storage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback((newToken: string, newAgent: Agent) => {
    setToken(newToken);
    setAgent(newAgent);
    localStorage.setItem('agent_token', newToken);
    localStorage.setItem('agent_user', JSON.stringify(newAgent));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAgent(null);
    localStorage.removeItem('agent_token');
    localStorage.removeItem('agent_user');
    window.location.href = '/login';
  }, []);

  const updateAgent = useCallback((updatedAgent: Agent) => {
    setAgent(updatedAgent);
    localStorage.setItem('agent_user', JSON.stringify(updatedAgent));
  }, []);

  const toggleOnlineStatus = useCallback(async () => {
    if (!agent) return;
    const updatedStatus = !agent.is_online;
    // Optimistic update
    setAgent((prev) => (prev ? { ...prev, is_online: updatedStatus } : null));
    try {
      localStorage.setItem('agent_user', JSON.stringify({ ...agent, is_online: updatedStatus }));
    } catch (e) {
      console.error(e);
    }
  }, [agent]);

  return (
    <AuthContext.Provider
      value={{
        agent,
        token,
        isAuthenticated: !!token && !!agent,
        isLoading,
        login,
        logout,
        updateAgent,
        toggleOnlineStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
