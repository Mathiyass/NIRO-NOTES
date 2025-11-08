import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import * as geminiService from '../services/geminiService';
import ConfirmationModal from './ConfirmationModal';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
  onBack: () => void;
}

const noteColors = ['#f87171', '#fbbf24', '#a3e635', '#4ade80', '#38bdf8', '#a78bfa', '#f472b6', '#9ca3af'];

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(noteColors[0]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  
  const originalNoteState = JSON.stringify({
    title: note?.title || '',
    content: note?.content || '',
    color: note?.color || noteColors[0]
  });

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    }
  }, [note]);
  
  const hasChanges = JSON.stringify({ title, content, color }) !== originalNoteState;

  const handleSave = () => {
    if (!title && !content) return; // Don't save empty notes

    const now = Date.now();
    const noteToSave: Note = {
      id: note?.id || `note_${now}`,
      title,
      content,
      color,
      createdAt: note?.createdAt || now,
      lastModified: now,
    };
    onSave(noteToSave);
  };
  
  const handleBackNavigation = () => {
    if (hasChanges) {
      setShowDiscardModal(true);
    } else {
      onBack();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardModal(false);
    onBack();
  };

  const handleSummarize = async () => {
    if (!content) return;
    setIsSummarizing(true);
    try {
      const summary = await geminiService.summarizeWithGemini(content);
      setContent(currentContent => `${currentContent}\n\n--- AI Summary ---\n${summary}`);
    } catch (error) {
      console.error("Failed to summarize:", error);
      alert("Could not generate summary. Please check your API key and try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 animate-fade-in">
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <button onClick={handleBackNavigation} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <i className="fas fa-arrow-left"></i>
            <span className="hidden sm:inline">Back to Notes</span>
          </button>
          <div className="flex items-center gap-2">
            <button
                onClick={handleSummarize}
                disabled={isSummarizing || !content}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 transition disabled:bg-purple-300 dark:disabled:bg-purple-800 disabled:cursor-not-allowed"
              >
                {isSummarizing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-wand-magic-sparkles"></i>
                )}
                <span className="hidden sm:inline">{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
            </button>
            <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition">
              <i className="fas fa-save mr-2"></i>
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:px-6 flex-grow flex flex-col">
        <div className="flex items-center mb-4 gap-4">
          <div className="flex items-center gap-2">
            {noteColors.map(c => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950 ring-primary-500' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={`Set note color to ${c}`}
              />
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold bg-transparent focus:outline-none mb-4 w-full"
        />
        <textarea
          placeholder="Start writing your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-grow bg-transparent focus:outline-none w-full text-lg leading-relaxed resize-none"
        ></textarea>
        {note && <div className="text-right text-sm text-slate-500 dark:text-slate-400 mt-4">Last Modified: {new Date(note.lastModified).toLocaleString()}</div>}
      </main>
       {showDiscardModal && (
        <ConfirmationModal
          title="Discard Changes"
          message="You have unsaved changes. Are you sure you want to discard them and go back?"
          onConfirm={confirmDiscard}
          onCancel={() => setShowDiscardModal(false)}
          confirmText="Discard"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default NoteEditor;