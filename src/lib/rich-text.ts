const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

export function isRichHtml(value: unknown) {
  return typeof value === 'string' && HTML_TAG_PATTERN.test(value);
}

export function sanitizeRichHtml(value: unknown) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '')
    .replace(/\s(href|src)\s*=\s*javascript:[^\s>]+/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .trim();
}

export function plainTextFromRichHtml(value: unknown) {
  if (typeof value !== 'string') return '';

  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function richHtmlToExcerpt(value: unknown, maxLength = 160) {
  const text = plainTextFromRichHtml(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function markdownLiteToRichHtml(value: unknown) {
  if (typeof value !== 'string') return '';
  if (isRichHtml(value)) return sanitizeRichHtml(value);

  const blocks = value
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (block.startsWith('### ')) {
        return `<h3>${escapeHtml(block.replace(/^###\s+/, ''))}</h3>`;
      }

      if (block.startsWith('## ')) {
        return `<h2>${escapeHtml(block.replace(/^##\s+/, ''))}</h2>`;
      }

      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
      const isList = lines.every((line) => /^[-*]\s+/.test(line));

      if (isList) {
        return `<ul>${lines
          .map((line) => `<li>${escapeHtml(line.replace(/^[-*]\s+/, ''))}</li>`)
          .join('')}</ul>`;
      }

      return `<p>${escapeHtml(lines.join(' '))}</p>`;
    })
    .join('');
}
