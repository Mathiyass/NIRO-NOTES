
import React from 'react';

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center py-20 flex flex-col items-center">
      <i className="fas fa-sticky-note text-6xl text-slate-300 dark:text-slate-600 mb-6"></i>
      <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No Notes Yet</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        It looks like your notebook is empty. Click the button below to create your first note and start organizing your thoughts.
      </p>
      <button 
        onClick={onAddNew}
        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
      >
        <i className="fas fa-plus mr-2"></i>
        Create First Note
      </button>
    </div>
  );
};

export default EmptyState;
