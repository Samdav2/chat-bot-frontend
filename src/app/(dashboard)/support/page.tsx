'use client';

import React, { useState } from 'react';
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
    uploadMedia,
    handleIncomingWSMessage,
  } = useConversations();

  const [isCustomerDetailsOpenMobile, setIsCustomerDetailsOpenMobile] = useState(false);

  // Initialize Real-time WebSocket hook for active conversation & agent ID
  const { isConnected, sendMessage } = useChatWebSocket({
    conversationId: activeConversation?.id || null,
    agentId: agent?.id || null,
    onMessageReceived: handleIncomingWSMessage,
  });

  const handleBackToListMobile = () => {
    // Clear active conversation on mobile to switch back to Ticket Queue view
    // We pass -1 or custom logic to reset activeConversation selection
    window.dispatchEvent(new CustomEvent('clear-active-conversation'));
    // Select non-existent ID or trigger state clear via selectConversation fallback
    selectConversation(0);
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-950">
      {/* Column 1: Ticket Queue Sidebar (Full width on mobile when no conversation active, hidden on mobile when conversation active) */}
      <div
        className={`h-full ${
          activeConversation ? 'hidden md:flex' : 'flex w-full md:w-auto'
        }`}
      >
        <TicketList
          conversations={conversations}
          activeTicketId={activeConversation?.id || null}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          isLoading={isLoadingList}
          onSelectTicket={(id) => {
            selectConversation(id);
            setIsCustomerDetailsOpenMobile(false);
          }}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Column 2: Center Live Chat Viewport (Full width on mobile when conversation active, hidden on mobile when no conversation active) */}
      <div
        className={`flex-1 h-full ${
          activeConversation ? 'flex w-full' : 'hidden md:flex'
        }`}
      >
        <ChatWindow
          conversation={activeConversation}
          currentAgentId={agent?.id || 0}
          isConnected={isConnected}
          isLoading={isLoadingDetail}
          onClaimTicket={claimTicket}
          onCloseTicket={closeTicket}
          onSendMessage={sendMessage}
          onUploadMedia={uploadMedia}
          onBackToList={() => selectConversation(0)}
          onToggleDetails={() => setIsCustomerDetailsOpenMobile((prev) => !prev)}
          isActionLoading={isActionLoading}
        />
      </div>

      {/* Column 3: Right Customer Profile & Internal Notes Drawer */}
      <CustomerDetails
        conversation={activeConversation}
        isOpenMobile={isCustomerDetailsOpenMobile}
        onCloseMobile={() => setIsCustomerDetailsOpenMobile(false)}
      />
    </div>
  );
}
