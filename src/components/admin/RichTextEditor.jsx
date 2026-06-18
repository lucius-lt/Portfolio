import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
        bulletList: true,
        orderedList: true,
      }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { target: "_blank" } }),
      TextStyle,
      Color,
      Underline,
    ],
    content: value || '',
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange && onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-full focus:outline-none min-h-[150px] p-4 text-heading',
        placeholder: placeholder || "Write your formatted case study here...",
      },
    },
  });

  // Keep editor content in sync when external value changes
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-surface shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
      <div className="bg-surface border-b border-border px-4 py-2 text-xs font-semibold text-body flex justify-between items-center">
        <span>Rich Text Editor</span>
        <span>HTML Output</span>
      </div>
      <div className="p-2 bg-surface/50 flex space-x-2 border-b border-border">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="p-1.5 hover:bg-bg rounded text-body hover:text-primary transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="p-1.5 hover:bg-bg rounded text-body hover:text-primary transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-1.5 hover:bg-bg rounded text-body hover:text-primary transition-colors" title="Bullet List"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-1.5 hover:bg-bg rounded text-body hover:text-primary transition-colors" title="Ordered List"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="p-1.5 hover:bg-bg rounded text-body hover:text-primary transition-colors" title="Heading 3"><span className="text-sm font-bold">H3</span></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className="p-1.5 hover:bg-bg rounded text-body hover:text-primary transition-colors" title="Heading 4"><span className="text-sm font-bold">H4</span></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
