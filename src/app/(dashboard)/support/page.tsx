'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useConversations } from '@/hooks/useConversations';
import { useChatWebSocket } from '@/hooks/useChatWebSocket';
import { TicketList } from '@/components/support/TicketList';
import { ChatWindow } from '@/components/support/ChatWindow';
import { CustomerDetails } from '@/components/support/CustomerDetails';

export default function SupportPage() {
  const { agent } = useAuth();
  const {
    conversations,
    activeConversation,
    activeFilter,
    searchQuery,
    isLoadingList,
    isLoadingDetail,
    isActionLoading,
    setActiveFilter,
    setSearchQuery,
    selectConversation,
    claimTicket,
    closeTicket,
    handleIncomingWSMessage,
  } = useConversations();

  // Initialize Real-time WebSocket hook for active conversation & agent ID
  const { isConnected, sendMessage } = useChatWebSocket({
    conversationId: activeConversation?.id || null,
    agentId: agent?.id || null,
    onMessageReceived: handleIncomingWSMessage,
  });

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950">
      {/* Column 1: Ticket Queue Sidebar */}
      <TicketList
        conversations={conversations}
        activeTicketId={activeConversation?.id || null}
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        isLoading={isLoadingList}
        onSelectTicket={selectConversation}
        onFilterChange={setActiveFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Column 2: Center Live Chat Viewport */}
      <ChatWindow
        conversation={activeConversation}
        currentAgentId={agent?.id || 0}
        isConnected={isConnected}
        isLoading={isLoadingDetail}
        onClaimTicket={claimTicket}
        onCloseTicket={closeTicket}
        onSendMessage={sendMessage}
        isActionLoading={isActionLoading}
      />

      {/* Column 3: Right Customer Profile & Internal Notes Drawer */}
      <CustomerDetails conversation={activeConversation} />
    </div>
  );
}
