import React from 'react';
import { Note } from '../types';
import NoteItem from './NoteItem';

interface NoteListProps {
  notes: Note[];
  onEdit: (id: string) => void;
  onDelete: (note: Note) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {notes.map((note, index) => (
        <NoteItem key={note.id} note={note} onEdit={onEdit} onDelete={onDelete} index={index} />
      ))}
    </div>
  );
};

export default NoteList;