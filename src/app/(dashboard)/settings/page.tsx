'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuickResponses } from '@/hooks/useQuickResponses';
import { apiClient } from '@/lib/api-client';
import { Agent, ApiResponse } from '@/types/support';
import {
  Settings,
  User,
  Mail,
  Lock,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Radio,
  HelpCircle,
  Eye,
  EyeOff,
  Bell,
  Check,
  MessageSquarePlus,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { agent, updateAgent, toggleOnlineStatus } = useAuth();
  const { quickResponses, isLoading: isSnippetsLoading, addQuickResponse, deleteQuickResponse } = useQuickResponses();

  // Profile form state
  const [fullName, setFullName] = useState(agent?.full_name || '');
  const [email, setEmail] = useState(agent?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState(agent?.telegram_chat_id || '');
  const [telegramUsername, setTelegramUsername] = useState(agent?.telegram_username || '');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New Quick Response form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAddingSnippet, setIsAddingSnippet] = useState(false);

  // Sync state if agent object updates from context
  useEffect(() => {
    if (agent) {
      setFullName(agent.full_name || '');
      setEmail(agent.email || '');
      setTelegramChatId(agent.telegram_chat_id || '');
      setTelegramUsername(agent.telegram_username || '');
    }
  }, [agent]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage('Full name and email address are required.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: Record<string, any> = {
        full_name: fullName.trim(),
        email: email.trim(),
        telegram_chat_id: telegramChatId.trim() || null,
        telegram_username: telegramUsername.trim().replace(/^@/, '') || null,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const response = await apiClient.put<ApiResponse<Agent>>('/auth/me', payload);

      if (response.data.success && response.data.data) {
        updateAgent(response.data.data);
        setPassword('');
        setSuccessMessage('Profile and notification preferences saved successfully!');
      } else {
        setErrorMessage(response.data.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      console.error('Failed to update agent profile:', err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Error saving settings. Please check credentials.';
      setErrorMessage(detail);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || isAddingSnippet) return;

    setIsAddingSnippet(true);
    const success = await addQuickResponse(newTitle.trim(), newContent.trim());
    if (success) {
      setNewTitle('');
      setNewContent('');
      setSuccessMessage('New quick response snippet saved!');
    } else {
      setErrorMessage('Failed to save quick response snippet.');
    }
    setIsAddingSnippet(false);
  };

  const handleDeleteSnippet = async (id: number) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      await deleteQuickResponse(id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Agent Account & Quick Response Settings</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal profile, saved canned snippets, and alert notifications.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Card 1: Account Information */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" /> Personal Account Details
                </h2>
                <span className="text-[10px] text-slate-500 font-mono">AGENT ID #{agent?.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agent@support.com"
                      required
                      className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-300">
                  Update Password (Leave blank to keep current password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-10 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Telegram Escalation Integration */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sky-400" /> Instant Mobile Alert Notifications
                </h2>
                <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-semibold rounded-md">
                  Active Alerts
                </span>
              </div>

              <p className="text-xs text-slate-400">
                When a customer requests assistance from a support agent, an alert is dispatched directly to your mobile device via Telegram.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Telegram Chat ID</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. 123456789"
                    className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl px-4 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Telegram Username</label>
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="e.g. support_agent"
                    className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl px-4 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Instructions Helper */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1.5">
                <p className="font-semibold text-indigo-400 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" /> How to find your Telegram Chat ID:
                </p>
                <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px]">
                  <li>Open Telegram and search for <strong>@userinfobot</strong> or <strong>@RawDataBot</strong>.</li>
                  <li>Click <strong>Start</strong> or send any message.</li>
                  <li>Copy your numerical ID and paste it into the Telegram Chat ID field above.</li>
                </ol>
              </div>
            </div>

            {/* Save Profile Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={isSaving}
                variant="primary"
                size="lg"
                className="px-8 shadow-indigo-600/30"
              >
                <Save className="w-4 h-4 mr-2" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>

          {/* Card 3: Quick Responses Management */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <MessageSquarePlus className="w-4 h-4 text-indigo-400" /> Saved Quick Responses & Snippets
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">{quickResponses.length} Saved</span>
            </div>

            <p className="text-xs text-slate-400">
              Create reusable message templates for your support chat. You can select these directly from the chat window.
            </p>

            {/* Form to create new snippet */}
            <form onSubmit={handleAddSnippet} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Snippet Title</label>
                <input
                  type="text"
                  placeholder="e.g. Order Refund Guide"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-900 text-slate-100 placeholder-slate-600 border border-slate-800 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Snippet Message Content</label>
                <textarea
                  rows={3}
                  placeholder="Enter standard reply message text..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full text-xs bg-slate-900 text-slate-100 placeholder-slate-600 border border-slate-800 rounded-lg px-3 py-2 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingSnippet || !newTitle.trim() || !newContent.trim()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isAddingSnippet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Save Quick Response</span>
                </button>
              </div>
            </form>

            {/* List of saved snippets */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-300">Your Saved Snippets</h3>
              {isSnippetsLoading ? (
                <div className="flex items-center gap-2 text-xs text-slate-400 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Loading quick responses...</span>
                </div>
              ) : quickResponses.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No custom quick responses saved yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {quickResponses.map((snippet) => (
                    <div
                      key={snippet.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3 group hover:border-indigo-900/60 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-xs font-bold text-indigo-300 truncate">{snippet.title}</p>
                        <p className="text-xs text-slate-300 break-words">{snippet.content}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteSnippet(snippet.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete snippet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Support Agent Presence & Status Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" /> Availability & Status
              </h2>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  agent?.is_online ? 'bg-emerald-500 animate-ping' : 'bg-slate-600'
                }`}
              />
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-200">Online Status</p>
                  <p className="text-[11px] text-slate-400">
                    {agent?.is_online ? 'Ready to accept user tickets' : 'Offline / Away mode'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={toggleOnlineStatus}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    agent?.is_online
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {agent?.is_online ? '● Online' : '○ Offline'}
                </button>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" /> Account Security Standard
                </span>
                <p className="text-xs text-slate-400">
                  Your session is active and verified. Notifications are delivered securely to your account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
