import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Note, SortOption } from './types';
import * as noteService from './services/noteService';
import Header from './components/Header';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.LAST_MODIFIED);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
    setNotes(noteService.getNotes());
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newIsDark = !prev;
      if (newIsDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newIsDark;
    });
  };

  const handleSaveNote = (noteToSave: Note) => {
    noteService.saveNote(noteToSave);
    setNotes(noteService.getNotes());
    setActiveNoteId(null);
  };

  const handleCreateNewNote = () => {
    setActiveNoteId('new');
  };

  const handleDeleteNote = (note: Note) => {
    setNoteToDelete(note);
  };
  
  const confirmDelete = () => {
    if (noteToDelete) {
      noteService.deleteNote(noteToDelete.id);
      setNotes(noteService.getNotes());
      setNoteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setNoteToDelete(null);
  };

  const filteredAndSortedNotes = useMemo(() => {
    return notes
      .filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === SortOption.TITLE) {
          return a.title.localeCompare(b.title);
        }
        if (sortOption === SortOption.CREATED_AT) {
          return b.createdAt - a.createdAt;
        }
        // Default to LAST_MODIFIED
        return b.lastModified - a.lastModified;
      });
  }, [notes, searchTerm, sortOption]);

  const activeNote = useMemo(() => {
    if (activeNoteId === 'new') {
      return null;
    }
    return notes.find(n => n.id === activeNoteId) || null;
  }, [activeNoteId, notes]);

  const handleBack = () => setActiveNoteId(null);

  if (activeNoteId) {
    return <NoteEditor 
      note={activeNote} 
      onSave={handleSaveNote} 
      onBack={handleBack} 
    />;
  }

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortOption={sortOption}
        onSortChange={setSortOption}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <main className="container mx-auto p-4 md:p-6 animate-fade-in">
        {filteredAndSortedNotes.length > 0 ? (
          <NoteList 
            notes={filteredAndSortedNotes}
            onEdit={setActiveNoteId}
            onDelete={handleDeleteNote}
          />
        ) : (
          <EmptyState onAddNew={handleCreateNewNote} />
        )}
      </main>
      
      <button
        onClick={handleCreateNewNote}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800"
        aria-label="Add new note"
      >
        <i className="fas fa-plus text-2xl"></i>
      </button>

      {noteToDelete && (
        <ConfirmationModal
          title="Delete Note"
          message={`Are you sure you want to delete "${noteToDelete.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
};

export default App;