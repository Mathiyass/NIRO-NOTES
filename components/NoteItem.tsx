import React from 'react';
import { Note } from '../types';

interface NoteItemProps {
  note: Note;
  onEdit: (id: string) => void;
  onDelete: (note: Note) => void;
  index: number;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onEdit, onDelete, index }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const previewContent = note.content.length > 150 
    ? note.content.substring(0, 150) + '...'
    : note.content;

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group border-l-4 opacity-0 animate-fade-in-up"
      style={{ borderColor: note.color, animationDelay: `${index * 50}ms` }}
      onClick={() => onEdit(note.id)}
    >
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2 truncate">{note.title || "Untitled Note"}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm break-words whitespace-pre-wrap">{previewContent}</p>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg border-t border-slate-200 dark:border-slate-700/50 flex justify-between items-center">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatDate(note.lastModified)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note); }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-colors"
            aria-label="Delete note"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;