import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormComponent } from './components/user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './components/user-list/user-list.component';
import { ApiService } from '../../api/api.service';
import { UserDTO, UserFilterDTO } from '../../api/models.dto';
import { RouterModule, Router } from '@angular/router';
import { DeleteConfirmationComponent } from '../news/components/delete-confirmation/delete-confirmation.component';
import { ChangeStatusConfirmationComponent } from './components/change-status-confirmation/change-status-confirmation.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UserListComponent, RouterModule],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: UserDTO[] = [];
  loading = false;

  constructor(private modalService: NgbModal, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(filter?: UserFilterDTO) {
    this.loading = true;
    this.apiService.getAllUsers(filter).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
        this.loading = false;
      },
    });
  }

  handleFilter(filter: UserFilterDTO) {
    this.loadUsers(filter);
  }

  openCreateUserModal(): void {
    const modalRef = this.modalService.open(UserFormComponent, { size: 'lg' });
    modalRef.componentInstance.isEditing = false;
    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Novo utilizador:', result);
          this.apiService.registerUser(result).subscribe(() => {
            this.loadUsers();
          });
        }
      },
      () => {}
    );
  }

  openEditUserModal(user: UserDTO): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  openUserDetails(user: UserDTO): void {
    this.router.navigate(['/users', user.id]);
  }

  openDeleteConfirmation(user: UserDTO): void {
    if (!user.id) {
      console.error('ID do usuário não encontrado');
      return;
    } else {
      const modalRef = this.modalService.open(DeleteConfirmationComponent);
      modalRef.componentInstance.user = user;
      modalRef.result.then(
        (result) => {
          if (result) {
            console.log('Utilizador deletado:', user);
            this.apiService.deleteUser(user.id!).subscribe(() => {
              this.loadUsers();
            });
          }
        },
        () => {}
      );
    }
  }

  openStatusConfirmation(user: UserDTO) {
    const modalRef = this.modalService.open(ChangeStatusConfirmationComponent);
    modalRef.componentInstance.user = user;
    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Status alterado:', user);
          this.apiService.toggleUserStatus(user.id!).subscribe(() => {
            this.loadUsers();
          });
        }
      },
      () => {}
    );
  }

  handleEdit(user: UserDTO) {
    // Implement the logic for editing a user
  }

  handleView(user: UserDTO) {
    // Implement the logic for viewing user details
  }

  handleDelete(user: UserDTO) {
    // Implement the logic for deleting a user
  }

  handleStatus(user: UserDTO) {
    // Implement the logic for changing user status
  }
}
