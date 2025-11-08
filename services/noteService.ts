import { Note } from '../types';

const NOTES_KEY = 'niro-notes';

export const getNotes = (): Note[] => {
  try {
    const notesJson = localStorage.getItem(NOTES_KEY);
    return notesJson ? JSON.parse(notesJson) : [];
  } catch (error) {
    console.error("Failed to parse notes from localStorage", error);
    return [];
  }
};

export const saveNote = (note: Note): void => {
  const notes = getNotes();
  const existingIndex = notes.findIndex(n => n.id === note.id);

  if (existingIndex > -1) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }

  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};

export const deleteNote = (id: string): void => {
  let notes = getNotes();
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
};