'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fileToUploadData, validateImageFile } from '@/lib/image-upload';
import { sanitizeRichHtml } from '@/lib/rich-text';
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

    const sanitized = sanitizeRichHtml(value);
    if (editor.innerHTML !== sanitized) {
      editor.innerHTML = sanitized;
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
    const html = editorRef.current?.innerHTML || '';
    onChange(sanitizeRichHtml(html));
    saveSelection();
  };

  const runCommand = (command: string, valueArg?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, valueArg);
    syncValue();
  };

  const setBlock = (tag: 'h2' | 'h3' | 'p' | 'blockquote') => {
    runCommand('formatBlock', tag);
  };

  const addLink = () => {
    const url = window.prompt('Masukkan URL link');
    if (!url) return;
    runCommand('createLink', url);
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
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileData = await fileToUploadData(file);
      const { url } = await uploadContentMedia(uploadFolder, fileData);
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      insertHtml(
        `<figure><img src="${url}" alt="${alt}" loading="lazy" /><figcaption>${alt}</figcaption></figure><p><br></p>`
      );
    } catch (caught) {
      console.error('Rich text image upload error:', caught);
      setError(caught instanceof Error ? caught.message : 'Gagal upload gambar.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-[1.5rem] border border-border bg-background">
      <div className="flex flex-wrap gap-2 border-b border-border p-2">
        <ToolbarButton label="Bold" onClick={() => runCommand('bold')}>
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => runCommand('italic')}>
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Heading 2" onClick={() => setBlock('h2')}>
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => setBlock('blockquote')}>
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Bullet list" onClick={() => runCommand('insertUnorderedList')}>
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => runCommand('insertOrderedList')}>
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={addLink}>
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label={uploading ? 'Uploading image' : 'Upload image'}
          onClick={() => {
            saveSelection();
            fileInputRef.current?.click();
          }}
          disabled={uploading}
        >
          <ImagePlus className="size-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
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
          'rich-content prose-editor w-full max-w-none overflow-y-auto rounded-b-[1.5rem] bg-surface p-5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
          minHeightClassName
        )}
        suppressContentEditableWarning
      />

      {(uploading || error) && (
        <div className="border-t border-border px-4 py-3 text-xs font-semibold">
          {uploading && <span className="text-primary">Uploading gambar...</span>}
          {error && <span className="text-destructive">{error}</span>}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 rounded-full"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
