'use client';

import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  colorScheme?: 'indigo' | 'slate' | 'blue';
}

const colorMap = {
  indigo: {
    chip: 'bg-indigo-100 text-indigo-800',
    remove: 'text-indigo-500 hover:text-indigo-700 hover:bg-indigo-200',
    ring: 'focus-within:ring-indigo-500 focus-within:border-indigo-500',
  },
  slate: {
    chip: 'bg-slate-100 text-slate-800',
    remove: 'text-slate-500 hover:text-slate-700 hover:bg-slate-200',
    ring: 'focus-within:ring-slate-500 focus-within:border-slate-500',
  },
  blue: {
    chip: 'bg-blue-100 text-blue-800',
    remove: 'text-blue-500 hover:text-blue-700 hover:bg-blue-200',
    ring: 'focus-within:ring-blue-500 focus-within:border-blue-500',
  },
};

export default function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = 'Add a tag...',
  maxTags,
  disabled = false,
  colorScheme = 'indigo',
}: TagInputProps) {
  const [input, setInput] = useState('');
  const colors = colorMap[colorScheme];
  const limitReached = maxTags !== undefined && tags.length >= maxTags;

  function addTag(raw: string) {
    const tag = raw.trim();
    if (!tag) return;
    if (tags.includes(tag)) {
      setInput('');
      return;
    }
    if (limitReached) return;
    onAdd(tag);
    setInput('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    // Allow backspace to remove the last tag when input is empty
    if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  }

  function handleChange(value: string) {
    // If the user pastes or types a comma, split and add everything before it
    if (value.includes(',')) {
      const parts = value.split(',');
      // Add all complete segments (everything before the last comma)
      parts.slice(0, -1).forEach((part) => addTag(part));
      // Keep whatever is after the last comma in the input
      setInput(parts[parts.length - 1]);
    } else {
      setInput(value);
    }
  }

  const isInputDisabled = disabled || limitReached;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 transition ${colors.ring} ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      {/* Tag chips */}
      {tags.map((tag) => (
        <span
          key={tag}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium ${colors.chip}`}
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => onRemove(tag)}
              className={`ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full transition-colors ${colors.remove}`}
              aria-label={`Remove ${tag}`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </span>
      ))}

      {/* Input or limit message */}
      {limitReached && !disabled ? (
        <span className="text-xs text-slate-400 italic">Limit reached</span>
      ) : (
        <input
          type="text"
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          disabled={isInputDisabled}
          className="min-w-[120px] flex-1 border-none bg-transparent py-0.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed"
        />
      )}
    </div>
  );
}
