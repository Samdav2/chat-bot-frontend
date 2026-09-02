export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'http://localhost:8000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_HOST = process.env.NEXT_PUBLIC_WS_HOST || 'localhost:8000';
export const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/chat';


export const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PENDING_AGENT: {
    label: 'Pending Agent',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400 animate-pulse',
  },
  HUMAN_ACTIVE: {
    label: 'Human Active',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  BOT_ACTIVE: {
    label: 'Bot Active',
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    dot: 'bg-sky-400',
  },
  CLOSED: {
    label: 'Closed',
    bg: 'bg-slate-800',
    text: 'text-slate-400',
    border: 'border-slate-700',
    dot: 'bg-slate-500',
  },
};

export const CANNED_RESPONSES = [
  "Hello! Thank you for contacting support. How can I assist you today?",
  "I am looking into your request right now. Please give me a moment.",
  "Could you please share more details or a transaction screenshot?",
  "Your issue has been resolved. Is there anything else I can help you with?",
  "Thank you for reaching out to support! Have a fantastic day.",
];
