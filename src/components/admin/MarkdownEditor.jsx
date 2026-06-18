import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * MarkdownEditor provides a split-pane or toggleable view to write Markdown
 * and see a live preview of how it will render.
 */
const MarkdownEditor = ({ value, onChange, placeholder }) => {
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
      {/* Toolbar */}
      <div className="flex border-b border-gray-200 bg-gray-50 px-2 py-2 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            activeTab === 'write' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
            activeTab === 'preview' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-[250px] max-h-[500px] overflow-y-auto">
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Write your case study using Markdown..."}
            className="w-full h-full min-h-[250px] p-4 resize-none focus:outline-none text-sm font-mono text-gray-800 leading-relaxed bg-transparent"
          />
        ) : (
          <div className="p-4 prose prose-sm max-w-none text-gray-800 font-sans prose-headings:font-editorial">
            {value ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Footer / Helper */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
        <span>Supports Markdown (e.g. **bold**, # Heading)</span>
        <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Formatting Help</a>
      </div>
    </div>
  );
};

export default MarkdownEditor;
