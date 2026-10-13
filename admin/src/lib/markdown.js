import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: false });

/** Markdown -> sanitised HTML (used for the live preview in the editor). */
export function renderMarkdown(md) {
  return DOMPurify.sanitize(marked.parse(md || ''));
}
