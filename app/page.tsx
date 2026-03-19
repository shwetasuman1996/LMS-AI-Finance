'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      router.replace('/login');
    } else if (currentUser.role === 'student') {
      router.replace('/student/dashboard');
    } else if (currentUser.role === 'tutor') {
      router.replace('/tutor/dashboard');
    } else if (currentUser.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [currentUser, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
