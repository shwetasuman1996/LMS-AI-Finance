'use client';

import { useState, useRef } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { addUser, getUserByEmail } from '@/lib/mock-data';

interface ParsedRow {
  name: string;
  email: string;
  batch: string;
  enrollmentNumber: string;
  phone: string;
  valid: boolean;
  errors: string[];
}

export default function AdminUpload() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [imported, setImported] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setImported(null);
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  }

  function parseCSV(text: string) {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) { setRows([]); return; }
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const parsed: ParsedRow[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
      const errs: string[] = [];
      if (!obj['name']?.trim()) errs.push('Name is required');
      if (!obj['email']?.trim()) errs.push('Email is required');
      else if (!/\S+@\S+\.\S+/.test(obj['email'])) errs.push('Invalid email');
      if (!obj['batch']?.trim()) errs.push('Batch is required');
      if (!obj['enrollmentnumber']?.trim() && !obj['enrollmentNumber']?.trim()) errs.push('Enrollment number is required');
      return {
        name: obj['name'] ?? '',
        email: obj['email'] ?? '',
        batch: obj['batch'] ?? '',
        enrollmentNumber: obj['enrollmentnumber'] ?? obj['enrollmentNumber'] ?? '',
        phone: obj['phone'] ?? '',
        valid: errs.length === 0,
        errors: errs,
      };
    });
    setRows(parsed);
  }

  function handleImport() {
    const valid = rows.filter(r => r.valid);
    let count = 0;
    valid.forEach(r => {
      if (getUserByEmail(r.email)) return;
      addUser({
        id: `u${Date.now()}_${count}`,
        email: r.email,
        password: 'password123',
        name: r.name,
        role: 'student',
        enrollmentNumber: r.enrollmentNumber,
        batch: r.batch,
        phone: r.phone || undefined,
        failedLoginAttempts: 0,
        isLocked: false,
      });
      count++;
    });
    setImported(count);
    setRows([]);
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
  }

  const validCount = rows.filter(r => r.valid).length;
  const errorCount = rows.filter(r => !r.valid).length;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Student Data</h1>

        {/* Upload Box */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Import Students via CSV</h2>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800 font-medium mb-1">Expected CSV columns:</p>
            <code className="text-xs text-blue-700">name, email, batch, enrollmentNumber (required), phone (optional)</code>
          </div>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
              <p className="text-4xl mb-3">📤</p>
              <p className="font-medium text-gray-700">{fileName || 'Click to select a CSV file'}</p>
              <p className="text-sm text-gray-400 mt-1">Only .csv files are accepted</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Success message */}
        {imported !== null && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <p className="text-green-800 font-medium">{imported} student{imported !== 1 ? 's' : ''} imported successfully!</p>
          </div>
        )}

        {/* Preview */}
        {rows.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-gray-800">Preview ({rows.length} rows)</h2>
                <span className="text-sm text-green-600 font-medium">✓ {validCount} valid</span>
                {errorCount > 0 && <span className="text-sm text-red-600 font-medium">✗ {errorCount} invalid</span>}
              </div>
              <button
                onClick={handleImport}
                disabled={validCount === 0}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Import {validCount} Valid Rows
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Batch</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enrollment</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((r, i) => (
                    <tr key={i} className={r.valid ? '' : 'bg-red-50'}>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${r.valid ? 'text-green-600' : 'text-red-600'}`}>
                          {r.valid ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{r.name || <span className="text-gray-400 italic">empty</span>}</td>
                      <td className="px-4 py-3 text-gray-600">{r.email || <span className="text-gray-400 italic">empty</span>}</td>
                      <td className="px-4 py-3 text-gray-600">{r.batch || <span className="text-gray-400 italic">empty</span>}</td>
                      <td className="px-4 py-3 text-gray-600">{r.enrollmentNumber || <span className="text-gray-400 italic">empty</span>}</td>
                      <td className="px-4 py-3 text-xs text-red-600">{r.errors.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
