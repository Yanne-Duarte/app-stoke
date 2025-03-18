import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormComponent } from './components/user-form/user-form.component';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';
import { UserDTO, UserFilterDTO } from '../../api/models.dto';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DeleteConfirmationComponent } from '../news/components/delete-confirmation/delete-confirmation.component';
import { ChangeStatusConfirmationComponent } from './components/change-status-confirmation/change-status-confirmation.component';
import { SearchResultsComponent } from '../../core/layout/components/search-results/search-results.component';
import {
  FilterField,
  TableHeader,
} from 'src/app/core/layout/components/search-results/search.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchResultsComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  users: UserDTO[] = [];
  loading = false;
  filterFields: FilterField[] = [
    { name: 'fullName', label: 'Nome', type: 'text' },
    { name: 'username', label: 'Username', type: 'text' },
    {
      name: 'perfil',
      label: 'Perfil',
      type: 'select',
      options: [
        { id: 'USER', value: 'Utilizador' },
        { id: 'ADMIN', value: 'Administrador' },
        { id: 'TECHNICAL', value: 'Técnico' },
      ],
    },
    { name: 'birthdate', label: 'Data de Nascimento', type: 'date' },
    { name: 'plano', label: 'Plano de Reabilitação', type: 'text' },
    { name: 'fisioterapeuta', label: 'Fisioterapeuta', type: 'text' },
  ];

  headers: TableHeader[] = [
    { key: 'fullName', label: 'Nome Completo' },
    { key: 'username', label: 'Username' },
    { key: 'perfil', label: 'Perfil', useTemplate: true },
    { key: 'birthdate', label: 'Data de Nascimento' },
    { key: 'plano', label: 'Plano de Reabilitação' },
    { key: 'fisioterapeuta', label: 'Fisioterapeuta', useTemplate: true },
    { key: 'actions', label: 'Ações', useTemplate: true },
  ];

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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

  handleEdit(user: UserDTO) {
    this.router.navigate([user.id, 'edit'], { relativeTo: this.route });
  }

  handleView(user: UserDTO) {
    this.router.navigate([user.id], { relativeTo: this.route });
  }

  handleDelete(user: UserDTO) {
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

  handleStatus(user: UserDTO) {
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

  //____________________________________________________
  isCollapsed = false;

  handleClear() {
    this.getData({});
  }
  handleFilter($event: any) {
    const filters = $event;
    this.getData(filters);
  }
  handleNew() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }
  getData(filters: any) {
    this.loading = true;
    this.apiService.getAllUsers(filters).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
        // this.onFilter.emit(filters);
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
