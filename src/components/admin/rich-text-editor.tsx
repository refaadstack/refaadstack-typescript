'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Code,
  CodeBlock,
  ImageSquare,
  Link as LinkIcon,
  Minus,
  Quotes,
  TextStrikethrough,
  TextB,
  TextH,
  TextHThree,
import { getErrorMessage } from '@/lib/error-utils';
  TextItalic,
  TextUnderline,
  VideoCamera,
  ListBullets,
  ListNumbers,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { fileToUploadData, validateImageFile } from '@/lib/image-upload';
import { uploadContentMedia } from '@/lib/crud';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  uploadFolder: string;
  placeholder?: string;
  minHeightClassName?: string;
}

export function RichTextEditor({
  value,
  onChange,
  uploadFolder,
  placeholder = 'Tulis konten di sini...',
  minHeightClassName = 'min-h-[360px]',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (document.activeElement === editor) return;
    if (editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    selectionRef.current = selection.getRangeAt(0);
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    const range = selectionRef.current;
    if (!selection || !range) return;
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const syncValue = () => {
    onChange(editorRef.current?.innerHTML || '');
    saveSelection();
  };

  const runCommand = (command: string, valueArg?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, valueArg);
    syncValue();
  };

  const setBlock = (tag: 'h2' | 'h3' | 'h4' | 'p' | 'pre' | 'blockquote') => {
    runCommand('formatBlock', tag);
  };

  const addLink = () => {
    const url = window.prompt('Masukkan URL link');
    if (!url) return;
    runCommand('createLink', url);
  };

  const addYoutube = () => {
    const url = window.prompt('Paste URL YouTube (contoh: https://www.youtube.com/watch?v=xxx)');
    if (!url) return;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
    if (!match) {
      setError('URL YouTube tidak valid. Gunakan format https://www.youtube.com/watch?v=xxx');
      return;
    }
    const videoId = match[1];
    const embed = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%"><iframe src="https://www.youtube.com/embed/${videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="YouTube video"></iframe></div>`;
    insertHtml(embed);
  };

  const addCode = () => {
    const lang = window.prompt('Bahasa kode (opsional):') || '';
    const codeText = window.prompt('Paste kode di sini:');
    if (!codeText) return;
    const label = lang ? `<small>${lang}</small>` : '';
    const code = label + `<pre><code>${codeText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    insertHtml(code);
  };

  const addHr = () => {
    insertHtml('<hr>');
  };

  const removeFormat = () => {
    runCommand('removeFormat');
  };

  const insertHtml = (html: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand('insertHTML', false, html);
    syncValue();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); return; }

    setUploading(true); setError('');
    try {
      const fileData = await fileToUploadData(file);
      const { url } = await uploadContentMedia(uploadFolder, fileData);
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      insertHtml(`<figure><img src="${url}" alt="${alt}" loading="lazy" /><figcaption>${alt}</figcaption></figure><p><br></p>`);
    } catch (caught) {
      console.error('Rich text image upload error:', caught);
      setError(getErrorMessage(caught, 'Gagal upload gambar. Maks 2MB.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-1.5">
        <BtnGroup>
          <Tb label="Bold (Ctrl+B)" onClick={() => runCommand('bold')}><TextB className="size-4" /></Tb>
          <Tb label="Italic (Ctrl+I)" onClick={() => runCommand('italic')}><TextItalic className="size-4" /></Tb>
          <Tb label="Underline (Ctrl+U)" onClick={() => runCommand('underline')}><TextUnderline className="size-4" /></Tb>
          <Tb label="Strikethrough" onClick={() => runCommand('strikeThrough')}><TextStrikethrough className="size-4" /></Tb>
        </BtnGroup>
        <BtnDivider />
        <BtnGroup>
          <Tb label="Heading 2" onClick={() => setBlock('h2')}><TextH className="size-4" /></Tb>
          <Tb label="Heading 3" onClick={() => setBlock('h3')}><TextHThree className="size-4" /></Tb>
          <Tb label="Quote" onClick={() => setBlock('blockquote')}><Quotes className="size-4" /></Tb>
          <Tb label="Code block" onClick={addCode}><CodeBlock className="size-4" /></Tb>
        </BtnGroup>
        <BtnDivider />
        <BtnGroup>
          <Tb label="Bullet list" onClick={() => runCommand('insertUnorderedList')}><ListBullets className="size-4" /></Tb>
          <Tb label="Numbered list" onClick={() => runCommand('insertOrderedList')}><ListNumbers className="size-4" /></Tb>
        </BtnGroup>
        <BtnDivider />
        <BtnGroup>
          <Tb label="Link" onClick={addLink}><LinkIcon className="size-4" /></Tb>
          <Tb label="YouTube embed" onClick={addYoutube}><VideoCamera className="size-4" /></Tb>
          <Tb label="Horizontal line" onClick={addHr}><Minus className="size-4" /></Tb>
          <Tb label="Upload image" onClick={() => { saveSelection(); fileInputRef.current?.click(); }} disabled={uploading}><ImageSquare className="size-4" /></Tb>
        </BtnGroup>
        <BtnDivider />
        <BtnGroup>
          <Tb label="Undo (Ctrl+Z)" onClick={() => runCommand('undo')}><ArrowCounterClockwise className="size-4" /></Tb>
          <Tb label="Redo (Ctrl+Y)" onClick={() => runCommand('redo')}><ArrowClockwise className="size-4" /></Tb>
          <Tb label="Remove format" onClick={removeFormat}><Code className="size-4" /></Tb>
        </BtnGroup>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      <div
        ref={editorRef}
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={syncValue}
        onBlur={syncValue}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        className={cn(
          'rich-content prose-editor w-full max-w-none overflow-y-auto bg-surface p-5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
          minHeightClassName
        )}
        suppressContentEditableWarning
      />

      {(uploading || error) && (
        <div className="border-t border-border px-4 py-2 text-xs font-semibold">
          {uploading && <span className="text-primary">Uploading gambar...</span>}
          {error && <span className="text-destructive">{error}</span>}
        </div>
      )}
    </div>
  );
}

function BtnGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function BtnDivider() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}

function Tb({ label, children, onClick, disabled }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8 rounded-md"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
