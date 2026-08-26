export type ConversationStatus = 'BOT_ACTIVE' | 'PENDING_AGENT' | 'HUMAN_ACTIVE' | 'CLOSED';
export type SenderRole = 'USER' | 'BOT' | 'AGENT';

export interface Agent {
  id: number;
  email: string;
  full_name: string;
  is_online: boolean;
  created_at: string;
}

export interface AgentCreateSchema {
  email: string;
  password: string;
  full_name: string;
}

export interface User {
  id: number;
  telegram_id: number;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  created_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_role: SenderRole;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  assigned_agent_id?: number | null;
  status: ConversationStatus;
  created_at: string;
  updated_at: string;
  user?: User;
  assigned_agent?: Agent | null;
  latest_message?: Message | null;
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TokenSchema {
  access_token: string;
  token_type: string;
  agent: Agent;
}

export interface WSPayload {
  id?: number;
  conversationId: number;
  senderRole: SenderRole;
  senderId: number;
  content: string;
  timestamp?: string;
}

export interface MessageCreateSchema {
  content: string;
}

export type TicketFilterType = 'ALL' | ConversationStatus;

export interface FilterTabOption {
  key: TicketFilterType;
  label: string;
  count?: number;
}
