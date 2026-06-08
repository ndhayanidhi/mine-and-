/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';

interface HighlightedEditorProps {
  value: string;
  onChange: (val: string) => void;
  language: string;
  placeholder?: string;
}

export default function HighlightedEditor({ value, onChange, language, placeholder }: HighlightedEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const preRef = useRef<HTMLPreElement | null>(null);

  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [value]);

  const highlight = (text: string, lang: string): string => {
    if (!text) return "";

    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (lang !== 'python' && lang !== 'javascript' && lang !== 'sql') {
      return escaped;
    }

    let tokenRegex: RegExp;
    if (lang === 'python') {
      tokenRegex = /(#[^\n]*)|("(?:\\"|[^"])*")|('(?:\\'|[^'])*')|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([^\s\w]+)/g;
    } else if (lang === 'javascript') {
      tokenRegex = /(\/\/[^\n]*)|("(?:\\"|[^"])*")|('(?:\\'|[^'])*')|(`(?:\\`|[^`])*`)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([^\s\w]+)/g;
    } else { // sql
      tokenRegex = /(--[^\n]*)|("(?:\\"|[^"])*")|('(?:\\'|[^'])*')|(\b\d+\b)|(\b[a-zA-Z_]\w*\b)|([^\s\w]+)/g;
    }

    const pyKeywords = new Set([
      'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'import', 'from', 'as', 
      'try', 'except', 'print', 'lambda', 'and', 'or', 'not', 'is', 'pass', 'raise', 'with', 'assert', 'break', 'continue'
    ]);

    const jsKeywords = new Set([
      'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 
      'case', 'break', 'continue', 'import', 'export', 'from', 'default', 'class', 'extends', 'new', 
      'this', 'throw', 'try', 'catch', 'finally', 'console', 'log'
    ]);

    const sqlKeywords = new Set([
      'select', 'from', 'where', 'insert', 'update', 'delete', 'join', 'left', 'right', 'inner', 
      'on', 'group', 'by', 'order', 'having', 'limit', 'and', 'or', 'not', 'as', 'in', 'like', 'is', 'null'
    ]);

    if (lang === 'python') {
      return escaped.replace(tokenRegex, (match, comment, dstr, sstr, num, word) => {
        if (comment) return `<span class="token-comment">${match}</span>`;
        if (dstr || sstr) return `<span class="token-string">${match}</span>`;
        if (num) return `<span class="token-number">${match}</span>`;
        if (word) {
          if (pyKeywords.has(word)) return `<span class="token-keyword">${word}</span>`;
          if (word === 'print') return `<span class="token-function">${word}</span>`;
          return word;
        }
        return match;
      });
    } else if (lang === 'javascript') {
      return escaped.replace(tokenRegex, (match, comment, dstr, sstr, tstr, num, word) => {
        if (comment) return `<span class="token-comment">${match}</span>`;
        if (dstr || sstr || tstr) return `<span class="token-string">${match}</span>`;
        if (num) return `<span class="token-number">${match}</span>`;
        if (word) {
          if (jsKeywords.has(word)) return `<span class="token-keyword">${word}</span>`;
          return word;
        }
        return match;
      });
    } else { // sql
      return escaped.replace(tokenRegex, (match, comment, dstr, sstr, num, word) => {
        if (comment) return `<span class="token-comment">${match}</span>`;
        if (dstr || sstr) return `<span class="token-string">${match}</span>`;
        if (num) return `<span class="token-number">${match}</span>`;
        if (word) {
          if (sqlKeywords.has(word.toLowerCase())) return `<span class="token-keyword">${word}</span>`;
          return word;
        }
        return match;
      });
    }
  };

  const linesCount = value.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(12, linesCount) }).map((_, i) => i + 1);

  return (
    <div className="relative font-mono text-xs flex w-full border border-slate-800 rounded-lg overflow-hidden bg-slate-950/20">
      {/* Line Numbers */}
      <div className="w-11 bg-slate-950 border-r border-slate-800 text-slate-500 text-right pr-2.5 py-4 select-none leading-relaxed shrink-0">
        {lineNumbers.map((num) => (
          <div key={num} className="h-[21px]">{num}</div>
        ))}
      </div>

      {/* Editor area */}
      <div className="relative flex-1 h-[220px] overflow-hidden">
        {/* Highlighted text layer underneath */}
        <pre 
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 m-0 p-4 leading-relaxed font-mono text-xs whitespace-pre overflow-auto pointer-events-none select-none text-slate-350"
          style={{ 
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: '21px',
            scrollbarWidth: 'none'
          }}
        >
          <code 
            dangerouslySetInnerHTML={{ __html: highlight(value, language) }}
            className="block h-full w-full whitespace-pre" 
          />
        </pre>

        {/* Textarea layer on top */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-cyan-400 p-4 leading-relaxed resize-none focus:outline-none overflow-auto whitespace-pre z-10"
          placeholder={placeholder || "# Write your code here..."}
          style={{ 
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: '21px',
            WebkitTextFillColor: 'transparent',
          }}
          spellCheck="false"
        />
      </div>
    </div>
  );
}
