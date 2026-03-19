'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TutorLayout from '@/components/Layout/TutorLayout';
import { useAuth } from '@/contexts/AuthContext';
import { addQuiz } from '@/lib/mock-data';

interface QuestionForm {
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
  marks: number;
}

const emptyQuestion = (): QuestionForm => ({
  text: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  marks: 1,
});

export default function CreateQuizPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'quiz' | 'exam'>('quiz');
  const [duration, setDuration] = useState(30);
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function updateQuestion(qi: number, field: keyof QuestionForm, value: unknown) {
    setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q));
  }

  function updateOption(qi: number, oi: number, value: string) {
    setQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q;
      const opts: [string, string, string, string] = [...q.options] as [string, string, string, string];
      opts[oi] = value;
      return { ...q, options: opts };
    }));
  }

  function addQuestion() {
    setQuestions(prev => [...prev, emptyQuestion()]);
  }

  function removeQuestion(qi: number) {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== qi));
  }

  function validate(): string[] {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Title is required.');
    if (!subject.trim()) errs.push('Subject is required.');
    if (duration < 1) errs.push('Duration must be at least 1 minute.');
    questions.forEach((q, qi) => {
      if (!q.text.trim()) errs.push(`Question ${qi + 1}: text is required.`);
      q.options.forEach((o, oi) => {
        if (!o.trim()) errs.push(`Question ${qi + 1}: Option ${String.fromCharCode(65 + oi)} is required.`);
      });
    });
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSaving(true);
    const quiz = {
      id: `q${Date.now()}`,
      title: title.trim(),
      type,
      tutorId: currentUser!.id,
      duration,
      subject: subject.trim(),
      createdAt: new Date().toISOString(),
      questions: questions.map((q, qi) => ({
        id: `qq${Math.random().toString(36).slice(2, 10)}_${qi}`,
        text: q.text.trim(),
        options: q.options.map(o => o.trim()),
        correctAnswer: q.correctAnswer,
        marks: q.marks,
      })),
    };
    addQuiz(quiz);
    router.push('/tutor/quizzes');
  }

  return (
    <TutorLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">←</button>
          <h1 className="text-2xl font-bold text-gray-900">Create Quiz</h1>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((e, i) => <li key={i} className="text-red-700 text-sm">{e}</li>)}
            </ul>
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Quiz Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Financial Accounting Quiz 1" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as 'quiz' | 'exam')} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="e.g. Taxation" />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Questions ({questions.length})</h2>
          </div>

          {questions.map((q, qi) => (
            <div key={qi} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-700">Question {qi + 1}</span>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Question Text</label>
                  <textarea value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none" placeholder="Enter the question..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {q.options.map((opt, oi) => (
                    <div key={oi}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Option {String.fromCharCode(65 + oi)}</label>
                      <input value={opt} onChange={e => updateOption(qi, oi, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder={`Option ${String.fromCharCode(65 + oi)}`} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Correct Answer</label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map(oi => (
                        <label key={oi} className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm cursor-pointer border ${q.correctAnswer === oi ? 'bg-green-100 border-green-400 text-green-700 font-medium' : 'border-gray-200 text-gray-600'}`}>
                          <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQuestion(qi, 'correctAnswer', oi)} className="hidden" />
                          {String.fromCharCode(65 + oi)}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Marks</label>
                    <input type="number" min={1} value={q.marks} onChange={e => updateQuestion(qi, 'marks', Number(e.target.value))} className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors text-sm font-medium">
            ➕ Add Question
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.back()} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-semibold transition-colors">
            {saving ? 'Saving...' : 'Save Quiz'}
          </button>
        </div>
      </div>
    </TutorLayout>
  );
}
