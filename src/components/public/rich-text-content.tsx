import { sanitizeRichHtml } from '@/lib/rich-text';

export function RichTextContent({ html }: { html: string }) {
  return (
    <div
      className="rich-content"
      dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(html) }}
    />
  );
}
