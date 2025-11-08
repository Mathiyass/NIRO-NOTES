
export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  lastModified: number;
}

export enum SortOption {
  LAST_MODIFIED = 'lastModified',
  TITLE = 'title',
  CREATED_AT = 'createdAt',
}
