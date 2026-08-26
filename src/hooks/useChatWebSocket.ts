'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WSPayload } from '@/types/support';
import { WS_BASE_HOST } from '@/lib/constants';
import { apiClient } from '@/lib/api-client';

interface UseChatWebSocketProps {
  conversationId: number | null;
  agentId: number | null;
  onMessageReceived: (message: WSPayload) => void;
}

export function useChatWebSocket({
  conversationId,
  agentId,
  onMessageReceived,
}: UseChatWebSocketProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep latest callback ref to avoid stale closures inside onmessage listener
  const onMessageReceivedRef = useRef(onMessageReceived);
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  useEffect(() => {
    if (!conversationId || !agentId) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    const wsProtocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${WS_BASE_HOST}/api/v1/ws/chat/${conversationId}?agent_id=${agentId}`;

    console.log(`[WS Connecting] Ticket #${conversationId} as Agent #${agentId} -> ${wsUrl}`);
    setConnectionError(null);

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(`[WS Connected] Ticket #${conversationId}`);
      setIsConnected(true);
      setConnectionError(null);
    };

    socket.onmessage = (event) => {
      try {
        const payload: WSPayload = JSON.parse(event.data);
        onMessageReceivedRef.current(payload);
      } catch (err) {
        console.error('Error parsing WebSocket frame:', err, event.data);
      }
    };

    socket.onclose = (event) => {
      console.log(`[WS Disconnected] Ticket #${conversationId} (Code: ${event.code})`);
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('[WS Error]', error);
      setConnectionError('WebSocket connection error');
    };

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socket.close();
      socketRef.current = null;
    };
  }, [conversationId, agentId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return false;

      // 1. Send via WebSocket if connected
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ content }));
        return true;
      } else {
        // 2. Fallback to REST API POST /conversations/{id}/messages
        console.warn('WebSocket not active. Dispatching via REST API fallback...');
        try {
          const res = await apiClient.post(`/conversations/${conversationId}/messages`, { content });
          if (res.data.success && agentId) {
            onMessageReceivedRef.current({
              conversationId,
              senderRole: 'AGENT',
              senderId: agentId,
              content,
              timestamp: new Date().toISOString(),
            });
            return true;
          }
        } catch (err) {
          console.error('Failed to send message via REST fallback:', err);
        }
      }
      return false;
    },
    [conversationId, agentId]
  );

  return { isConnected, connectionError, sendMessage };
}
