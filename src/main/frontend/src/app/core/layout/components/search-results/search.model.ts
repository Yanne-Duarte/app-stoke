import { SelectOption } from '../select/select.component';

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: SelectOption[];
}

export interface TableHeader {
  key: string;
  label: string;
  useTemplate?: boolean;
  transform?: (value: any) => string;
}

export type ActionType = 'view' | 'edit' | 'delete' | 'play' | 'create' | 'update' | 'status' | 'read';
