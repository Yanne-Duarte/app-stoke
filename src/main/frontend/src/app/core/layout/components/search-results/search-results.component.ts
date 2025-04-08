import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ContentChild,
  TemplateRef,
  computed,
  inject,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FilterField, TableHeader, ActionType } from './search.model';
import { PlatformService } from 'src/app/api/platform.service';
import { DatepickerComponent } from '../datepicker/datepicker.component';
@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatepickerComponent],
})
export class SearchResultsComponent implements OnInit, OnChanges {
  private platformService = inject(PlatformService);
  @Input() title = '';
  @Input() subtitle = '';
  @Input() newButtonLabel = '';
  @Input() newButtonIcon = '';
  @Input() btnClass = '';
  @Input() filterFields: FilterField[] = [];
  @Input() tableHeaders: TableHeader[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() perfil: any;
  @Input() availableActions: ActionType[] = [];
  @Input() statusField = 'status'; // Campo que contém o status do item
  @Input() checkStatusRow = false; // Controla se a verificação de status deve ser feita

  @Input() canCreate = false;

  @Output() onNew = new EventEmitter<void>();
  @Output() onFilter = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onPlay = new EventEmitter<any>();
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onStatus = new EventEmitter<any>();

  @ContentChild('customCell') customCell!: TemplateRef<any>;

  isMobile = computed(() => this.platformService.isMobile());

  filterForm: FormGroup;
  isCollapsed = true;

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
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterFields'] && !changes['filterFields'].firstChange) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    // Clear existing form
    this.filterForm = this.fb.group({});
    
    // Add controls for each filter field
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

  handleUpdate(row: any) {
    this.onUpdate.emit(row);
  }

  handleStatus(row: any) {
    this.onStatus.emit(row);
  }

  shouldShowAction(actionType: ActionType): boolean {
    // Lógica padrão para mostrar/ocultar ações
    if (actionType === 'play' && (this.title === 'Gravações' || this.title !== 'Progresso')) {
      return true;
    }
    
    if (actionType === 'view' && this.title !== 'Gravações') {
      return true;
    }
    
    if ((actionType === 'edit' || actionType === 'update') && this.title !== 'Gravações' && this.title !== 'Progresso') {
      return true;
    }
    
    if (actionType === 'delete' && this.title !== 'Progresso') {
      return true;
    }
    
    if (actionType === 'status') {
      return true;
    }
    
    return false;
  }

  getActionIcon(actionType: ActionType): string {
    switch (actionType) {
      case 'view': return 'fas fa-eye';
      case 'edit': return 'fas fa-pencil-alt';
      case 'delete': return 'fas fa-trash';
      case 'play': return 'fas fa-play';
      case 'update': return 'fas fa-sync';
      case 'create': return 'fas fa-plus';
      case 'status': return 'fas fa-user-check'; // Ícone mais sugestivo para alterar status
      default: return '';
    }
  }

  getActionClass(actionType: ActionType, item?: any): string {
    // Se for o botão de status, checkStatusRow for true e tiver um item, verifica o status
    if (actionType === 'status' && this.checkStatusRow && item) {
      const status = item[this.statusField];
      return status === true ? 'btn-outline-success' : 'btn-outline-danger';
    }
    
    // Para outros tipos de ação, usa a classe padrão
    switch (actionType) {
      case 'view': return 'btn-outline-secondary';
      case 'edit': return 'btn-outline-primary';
      case 'delete': return 'btn-outline-danger';
      case 'play': return 'btn-outline-success';
      case 'update': return 'btn-outline-info';
      case 'create': return 'btn-outline-success';
      case 'status': return 'btn-outline-warning'; // Classe padrão caso não tenha item ou checkStatusRow seja false
      default: return 'btn-outline-secondary';
    }
  }

  getActionTitle(actionType: ActionType, item?: any): string {
    // Se for o botão de status, checkStatusRow for true e tiver um item, personaliza o título
    if (actionType === 'status' && this.checkStatusRow && item) {
      const status = item[this.statusField];
      return status === true ? 'Desativar' : 'Ativar';
    }
    
    // Para outros tipos de ação, usa o título padrão
    switch (actionType) {
      case 'view': return 'Ver';
      case 'edit': return 'Editar';
      case 'delete': return 'Apagar';
      case 'play': return 'Reproduzir';
      case 'update': return 'Atualizar';
      case 'create': return 'Criar';
      case 'status': return 'Alterar Status';
      default: return actionType;
    }
  }
}
