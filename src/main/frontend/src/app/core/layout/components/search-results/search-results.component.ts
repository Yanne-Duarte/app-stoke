import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterField, TableHeader } from './search.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class SearchResultsComponent implements OnInit {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() newButtonLabel = '';
  @Input() newButtonIcon = '';
  @Input() btnClass = '';
  @Input() filterFields: FilterField[] = [];
  @Input() tableHeaders: TableHeader[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() actions = false;

  @Output() onNew = new EventEmitter<void>();
  @Output() onFilter = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onPlay = new EventEmitter<any>();

  @ContentChild('customCell') customCell!: TemplateRef<any>;

  filterForm: FormGroup;
  isCollapsed = false;

  // Listas padrão para selects
  readonly lista1 = [
    { id: 1, value: 'label 1' },
    { id: 2, value: 'label 2' },
  ];
  readonly lista2 = [
    { id: 1, value: 'label 1' },
    { id: 2, value: 'label 2' },
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit() {
    // Construir form dinamicamente
    this.filterFields.forEach((field) => {
      this.filterForm.addControl(field.name, this.fb.control(''));
    });
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  clearFilters() {
    this.filterForm.reset();
    this.onClear.emit();
  }

  applyFilters() {
    this.onFilter.emit(this.filterForm.value);
  }

  handleView(row: any) {
    this.onView.emit(row);
  }

  handleEdit(row: any) {
    this.onEdit.emit(row);
  }

  handleDelete(row: any) {
    this.onDelete.emit(row);
  }

  handlePlay(row: any) {
    this.onPlay.emit(row);
  }
}
