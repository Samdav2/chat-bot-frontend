'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api-client';
import { TokenSchema, ApiResponse, Agent } from '@/types/support';
import {
  Headset,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Send,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('agent@support.com');
  const [password, setPassword] = useState('SecretPassword123!');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regTelegramChatId, setRegTelegramChatId] = useState('');
  const [regTelegramUsername, setRegTelegramUsername] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.post<TokenSchema>('/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });

      const { access_token, agent } = response.data;
      if (access_token && agent) {
        login(access_token, agent);
        router.push('/support');
      } else {
        setErrorMessage('Invalid authentication response from server.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Authentication failed. Please verify credentials.';
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        full_name: regFullName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        telegram_chat_id: regTelegramChatId.trim() || undefined,
        telegram_username: regTelegramUsername.trim().replace(/^@/, '') || undefined,
      };

      const response = await apiClient.post<ApiResponse<Agent>>('/auth/register', payload);

      if (response.data.success) {
        setSuccessMessage('Agent account registered successfully! Logging you in...');
        // Auto-login after registration
        try {
          const loginRes = await apiClient.post<TokenSchema>('/auth/login', {
            email: regEmail.trim(),
            password: regPassword.trim(),
          });
          const { access_token, agent } = loginRes.data;
          if (access_token && agent) {
            login(access_token, agent);
            router.push('/support');
          }
        } catch (loginErr) {
          setMode('login');
          setEmail(regEmail.trim());
          setPassword('');
          setSuccessMessage('Registration completed! Please sign in with your credentials.');
        }
      } else {
        setErrorMessage(response.data.message || 'Registration failed.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Failed to register account. Check if email already exists.';
      setErrorMessage(detail);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('agent@support.com');
    setPassword('SecretPassword123!');
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30 ring-4 ring-indigo-500/10">
            <Headset className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Support Agent Desk</h1>
          <p className="text-xs text-slate-400">
            Hybrid Telegram Bot & Live Customer Support System
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          {/*** 
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
          ***/}
        </div>

        {/* Status Notifications */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Agent Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agent@support.com"
                  required
                  className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-10 py-3 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full shadow-indigo-600/30"
            >
              <span>Authenticate & Access Desk</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Register Account Form */}
        {/*** 
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jane@support.com"
                  required
                  className="w-full bg-slate-950 text-slate-100 text-sm placeholder-slate-600 rounded-xl pl-10 pr-4 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950 text-slate-100 text-xs placeholder-slate-600 rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950 text-slate-100 text-xs placeholder-slate-600 rounded-xl pl-9 pr-3 py-2.5 border border-slate-800 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <p className="text-[11px] font-semibold text-indigo-400 mb-1.5 flex items-center gap-1">
                <Send className="w-3 h-3" /> Telegram Notification Alert Settings (Optional)
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={regTelegramChatId}
                  onChange={(e) => setRegTelegramChatId(e.target.value)}
                  placeholder="Telegram Chat ID"
                  className="bg-slate-950 text-slate-100 text-xs placeholder-slate-600 rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 outline-none"
                />
                <input
                  type="text"
                  value={regTelegramUsername}
                  onChange={(e) => setRegTelegramUsername(e.target.value)}
                  placeholder="@telegram_handle"
                  className="bg-slate-950 text-slate-100 text-xs placeholder-slate-600 rounded-xl px-3 py-2 border border-slate-800 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
              className="w-full shadow-indigo-600/30 mt-2"
            >
              <span>Register Agent Account</span>
              <UserPlus className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}
          **/}

        {/* Demo Quick Fill Helper */}
        {mode === 'login' && (
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
            >
              Auto-fill Default Admin Demo Credentials
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            End-to-End Encrypted & Secure Agent Workspace
          </p>
        </div>
      </div>
    </div>
  );
}
