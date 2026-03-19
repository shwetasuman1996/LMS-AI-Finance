'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getUserByEmail } from '@/lib/mock-data';

export default function LoginPage() {
  const { login, currentUser, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!isLoading && currentUser) {
      if (currentUser.role === 'student') router.replace('/student/dashboard');
      else if (currentUser.role === 'tutor') router.replace('/tutor/dashboard');
      else if (currentUser.role === 'admin') router.replace('/admin/dashboard');
    }
  }, [currentUser, isLoading, router]);

  useEffect(() => {
    if (email) {
      const user = getUserByEmail(email);
      if (user) {
        setFailedAttempts(user.failedLoginAttempts);
        setIsLocked(user.isLocked);
      } else {
        setFailedAttempts(0);
        setIsLocked(false);
      }
    }
  }, [email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error ?? 'Login failed.');
      const user = getUserByEmail(email);
      if (user) {
        setFailedAttempts(user.failedLoginAttempts);
        setIsLocked(user.isLocked);
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">📊</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">CA Finance LMS</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {isLocked && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">Account locked. Please reset your password.</p>
            <Link href="/forgot-password" className="text-red-600 underline text-sm mt-1 inline-block">
              Reset Password
            </Link>
          </div>
        )}

        {error && !isLocked && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {failedAttempts > 0 && !isLocked && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-700 text-sm">{failedAttempts} of 3 attempts used</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLocked}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 disabled:bg-gray-100"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLocked}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 disabled:bg-gray-100"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={submitting || isLocked}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-xs text-gray-500">
          <p className="font-semibold mb-1">Demo Accounts:</p>
          <p>Student: student1@test.com / password123</p>
          <p>Tutor: tutor1@test.com / password123</p>
          <p>Admin: admin@test.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
