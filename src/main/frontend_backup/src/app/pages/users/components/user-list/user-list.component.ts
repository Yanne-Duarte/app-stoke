import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDTO, UserFilterDTO } from '../../../../api/models.dto';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  imports: [CommonModule, NgbCollapse, ReactiveFormsModule],
  standalone: true,
})
export class UserListComponent {
  @Input() users: UserDTO[] = [];
  @Output() onEdit = new EventEmitter<UserDTO>();
  @Output() onView = new EventEmitter<UserDTO>();
  @Output() onDelete = new EventEmitter<UserDTO>();
  @Output() onStatus = new EventEmitter<UserDTO>();
  @Output() onFilter = new EventEmitter<UserFilterDTO>();
  @Input() loading = false;

  filterForm: FormGroup;
  isCollapsed = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.filterForm = this.fb.group({
      fullName: [''],
      username: [''],
      perfil: [''],
      birthdate: [''],
      plano: [''],
      fisioterapeuta: [''],
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loading = true;
    this.apiService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.onFilter.emit({});
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    this.loading = true;

    this.apiService.getAllUsers(filters).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        this.onFilter.emit(filters);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
