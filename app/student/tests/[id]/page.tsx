'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StudentLayout from '@/components/Layout/StudentLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizById, addQuizAttempt, getAttemptsByStudent, type Quiz } from '@/lib/mock-data';

export default function TakeTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentUser } = useAuth();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitQuiz = useCallback((finalAnswers: number[]) => {
    if (!quiz || !currentUser || submitted) return;
    setSubmitted(true);
    sessionStorage.removeItem(`test_start_${quiz.id}`);
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (finalAnswers[i] === q.correctAnswer) score += q.marks;
    });
    const totalMarks = quiz.questions.reduce((s, q) => s + q.marks, 0);
    const attemptId = `qa${Date.now()}`;
    addQuizAttempt({
      id: attemptId,
      studentId: currentUser.id,
      quizId: quiz.id,
      answers: finalAnswers,
      score,
      totalMarks,
      submittedAt: new Date().toISOString(),
    });
    router.push(`/student/tests/results/${attemptId}`);
  }, [quiz, currentUser, submitted, router]);

  useEffect(() => {
    const q = getQuizById(id);
    if (!q) { router.replace('/student/tests'); return; }
    if (currentUser) {
      const existing = getAttemptsByStudent(currentUser.id).find(a => a.quizId === id);
      if (existing) { setAlreadyAttempted(true); return; }
    }
    setQuiz(q);
    setAnswers(new Array(q.questions.length).fill(-1));
    // Use sessionStorage to persist start time across remounts
    const storageKey = `test_start_${id}`;
    const stored = sessionStorage.getItem(storageKey);
    const startTime = stored ? parseInt(stored, 10) : Date.now();
    if (!stored) sessionStorage.setItem(storageKey, String(startTime));
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, q.duration * 60 - elapsed);
    setTimeLeft(remaining);
  }, [id, currentUser, router]);

  useEffect(() => {
    if (!quiz || alreadyAttempted || submitted) return;
    if (timeLeft <= 0) { submitQuiz(answers); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz, alreadyAttempted, submitted, answers, submitQuiz]);

  if (alreadyAttempted) {
    return (
      <StudentLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Already Attempted</h2>
          <p className="text-gray-500 mb-6">You have already taken this test.</p>
          <button onClick={() => router.push('/student/tests')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Back to Tests</button>
        </div>
      </StudentLayout>
    );
  }

  if (!quiz) {
    return (
      <StudentLayout>
        <div className="min-h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
        </div>
      </StudentLayout>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 120;
  const answeredCount = answers.filter(a => a >= 0).length;

  return (
    <StudentLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} questions · {quiz.questions.reduce((s, q) => s + q.marks, 0)} marks</p>
          </div>
          <div className={`text-2xl font-bold px-4 py-2 rounded-xl ${isLowTime ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-indigo-100 text-indigo-700'}`}>
            ⏱ {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {quiz.questions.map((q, qi) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="font-medium text-gray-900 mb-1">Q{qi + 1}. {q.text}</p>
              <p className="text-xs text-gray-400 mb-4">{q.marks} mark{q.marks !== 1 ? 's' : ''}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[qi] === oi ? 'bg-indigo-50 border-indigo-300' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={answers[qi] === oi}
                      onChange={() => {
                        const updated = [...answers];
                        updated[qi] = oi;
                        setAnswers(updated);
                      }}
                      className="text-indigo-600"
                    />
                    <span className="text-sm text-gray-700">
                      <span className="font-medium text-gray-500 mr-2">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
          <p className="text-sm text-gray-600">{answeredCount}/{quiz.questions.length} questions answered</p>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            Submit Test
          </button>
        </div>

        {/* Confirm dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Test?</h3>
              <p className="text-gray-600 text-sm mb-1">You have answered {answeredCount} of {quiz.questions.length} questions.</p>
              {answeredCount < quiz.questions.length && (
                <p className="text-amber-600 text-sm mb-4">⚠️ {quiz.questions.length - answeredCount} question(s) unanswered will be marked as wrong.</p>
              )}
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                  Cancel
                </button>
                <button onClick={() => submitQuiz(answers)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold">
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
