'use client';

import { useState, useRef, useCallback } from 'react';

interface ResumeUploadProps {
  onUpload: (file: File | null, text: string | null) => void;
}

type Tab = 'file' | 'paste';

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
  const [activeTab, setActiveTab] = useState<Tab>('file');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasteText, setPasteText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or DOCX file.');
        return;
      }
      setFileName(file.name);
      onUpload(file, null);
    },
    [onUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  const handlePasteSubmit = useCallback(() => {
    if (pasteText.trim()) {
      setFileName(null);
      onUpload(null, pasteText.trim());
    }
  }, [pasteText, onUpload]);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Tabs */}
      <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('file')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'file'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'paste'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Paste Text
        </button>
      </div>

      {activeTab === 'file' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50'
              : fileName
              ? 'border-green-300 bg-green-50'
              : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleChange}
            className="hidden"
          />

          {fileName ? (
            <>
              <svg className="mb-3 h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-700">{fileName}</p>
              <p className="mt-1 text-xs text-green-600">Click or drag to replace</p>
            </>
          ) : (
            <>
              <svg className="mb-3 h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-slate-700">
                Drop your resume here, or{' '}
                <span className="text-indigo-600">browse</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">PDF or DOCX up to 10MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your resume text here..."
            rows={10}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Use This Text
          </button>
        </div>
      )}
    </div>
  );
}
