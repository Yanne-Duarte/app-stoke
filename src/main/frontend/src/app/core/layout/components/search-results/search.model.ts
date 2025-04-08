export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: { id: number | string; value: string }[];
}

export interface TableHeader {
  key: string;
  label: string;
  useTemplate?: boolean;
  transform?: (value: any) => string;
}

export type ActionType = 'view' | 'edit' | 'delete' | 'play' | 'create' | 'update' | 'status';
