'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Conversation,
  ConversationDetail,
  TicketFilterType,
  ApiResponse,
  Message,
  WSPayload,
} from '@/types/support';
import { apiClient } from '@/lib/api-client';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDetail | null>(null);
  const [activeFilter, setActiveFilter] = useState<TicketFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch list of conversations
  const fetchConversations = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
      if (activeFilter !== 'ALL') {
        params.status = activeFilter;
      }
      
      const response = await apiClient.get<ApiResponse<Conversation[]>>('/conversations', { params });
      if (response.data.success) {
        setConversations(response.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch conversations:', err);
      setError(err.response?.data?.message || 'Failed to load conversations.');
    } finally {
      setIsLoadingList(false);
    }
  }, [activeFilter]);

  // Initial fetch and polling interval (every 10 seconds for list updates)
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  // Fetch single conversation detail
  const selectConversation = useCallback(async (id: number) => {
    setIsLoadingDetail(true);
    setError(null);
    try {
      const response = await apiClient.get<ApiResponse<ConversationDetail>>(`/conversations/${id}`);
      if (response.data.success) {
        setActiveConversation(response.data.data);
      }
    } catch (err: any) {
      console.error(`Failed to fetch conversation #${id}:`, err);
      setError(err.response?.data?.message || 'Failed to load conversation details.');
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // Claim ticket action
  const claimTicket = useCallback(
    async (id: number) => {
      setIsActionLoading(true);
      try {
        const response = await apiClient.post<ApiResponse<ConversationDetail>>(`/conversations/${id}/claim`);
        if (response.data.success) {
          const updated = response.data.data;
          setActiveConversation(updated);
          
          // Update item in list
          setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: 'HUMAN_ACTIVE', assigned_agent_id: updated.assigned_agent_id } : c))
          );
          return true;
        }
      } catch (err: any) {
        console.error('Failed to claim ticket:', err);
        alert(err.response?.data?.message || 'Could not claim ticket');
      } finally {
        setIsActionLoading(false);
      }
      return false;
    },
    []
  );

  // Close ticket action
  const closeTicket = useCallback(
    async (id: number) => {
      setIsActionLoading(true);
      try {
        const response = await apiClient.post<ApiResponse<ConversationDetail>>(`/conversations/${id}/close`);
        if (response.data.success) {
          const updated = response.data.data;
          setActiveConversation(updated);
          
          // Update item in list
          setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, status: 'CLOSED' } : c))
          );
          return true;
        }
      } catch (err: any) {
        console.error('Failed to close ticket:', err);
        alert(err.response?.data?.message || 'Could not close ticket');
      } finally {
        setIsActionLoading(false);
      }
      return false;
    },
    []
  );

  // Append new incoming or outgoing message from WebSocket frame or API call
  const handleIncomingWSMessage = useCallback((wsPayload: WSPayload) => {
    const newMessage: Message = {
      id: wsPayload.id || Date.now(),
      conversation_id: wsPayload.conversationId,
      sender_role: wsPayload.senderRole,
      sender_id: wsPayload.senderId,
      content: wsPayload.content,
      created_at: wsPayload.timestamp || new Date().toISOString(),
    };

    // Append to active conversation if open
    setActiveConversation((prev) => {
      if (prev && prev.id === wsPayload.conversationId) {
        // Prevent duplicate messages if ID exists
        if (prev.messages.some((m) => m.id === newMessage.id)) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          latest_message: newMessage,
        };
      }
      return prev;
    });

    // Update latest_message in conversations list
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === wsPayload.conversationId) {
          return {
            ...c,
            latest_message: newMessage,
            updated_at: newMessage.created_at,
          };
        }
        return c;
      })
    );
  }, []);

  // Computed filtered list based on search query
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const username = c.user?.username?.toLowerCase() || '';
    const firstName = c.user?.first_name?.toLowerCase() || '';
    const lastName = c.user?.last_name?.toLowerCase() || '';
    const telegramId = c.user?.telegram_id?.toString() || '';
    const id = c.id.toString();

    return (
      username.includes(q) ||
      firstName.includes(q) ||
      lastName.includes(q) ||
      telegramId.includes(q) ||
      id.includes(q)
    );
  });

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    activeConversation,
    activeFilter,
    searchQuery,
    isLoadingList,
    isLoadingDetail,
    isActionLoading,
    error,
    setActiveFilter,
    setSearchQuery,
    fetchConversations,
    selectConversation,
    claimTicket,
    closeTicket,
    handleIncomingWSMessage,
  };
}
