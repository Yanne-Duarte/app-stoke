import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { UserDTO } from '../../api/models.dto';
import { SearchResultsComponent } from 'src/app/core/layout/components/search-results/search-results.component';
import { FilterField, TableHeader } from 'src/app/core/layout/components/search-results/search.model';
import { ModalComponent } from 'src/app/core/layout/components/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserFilterDTO } from '../../api/models.dto';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteConfirmationComponent } from '../news/components/delete-confirmation/delete-confirmation.component';
import { ChangeStatusConfirmationComponent } from './components/change-status-confirmation/change-status-confirmation.component';

type ActionType = 'view' | 'edit' | 'status' | 'delete';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchResultsComponent],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: UserDTO[] = [];
  loading = false;
  error = '';
  canCreateUser = false;
  availableActions: ActionType[] = [];
  currentUser: UserDTO | null = null;
  filterFields: FilterField[] = [
    { name: 'fullName', label: 'Nome', type: 'text' },
    { name: 'username', label: 'Username', type: 'text' },
    {
      name: 'perfil',
      label: 'Perfil',
      type: 'select',
      options: [
        { id: 'USER', descricao: 'Utilizador' },
        { id: 'ADMIN', descricao: 'Administrador' },
        { id: 'TECHNICAL', descricao: 'Técnico' },
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
  ];

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.currentUser = JSON.parse(localStorage.getItem('user') ?? 'null');
    
    const perfil = this.currentUser?.perfil || '';
    
    const profilePermissions: Record<string, { canCreate: boolean; actions: ActionType[] }> = {
      'ADMIN': { canCreate: true, actions: ['view', 'edit', 'status', 'delete'] },
      'TECHNICAL': { canCreate: false, actions: ['view', 'edit', 'status'] },
      'USER': { canCreate: false, actions: ['view'] }
    };

    const permissions = profilePermissions[perfil] || profilePermissions['USER'];
    this.canCreateUser = permissions.canCreate;
    this.availableActions = permissions.actions;
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
      return;
    } else {
      const modalRef = this.modalService.open(ModalComponent, {
        size: 'md',
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });

      modalRef.componentInstance.title = `Utilizador inativar: ${user.fullName}`;
      modalRef.componentInstance.message = `Tem certeza que deseja inativar o utilizador?`;
      modalRef.componentInstance.buttonConfirmLabel = 'Confirmar';
      modalRef.componentInstance.buttonCancelLabel = 'Cancelar';
      modalRef.componentInstance.showConfirmButton = true;
      modalRef.componentInstance.showCancelButton = true;

      modalRef.result.then(
        (result: boolean) => {
          if (result) {
            this.apiService.deleteUser(user.id!).subscribe({
              next: () => {
                this.loadUsers();
              },
              error: (error) => {
                console.warn('Erro ao apagar o utilizador:', error);
              },
            });
          }
        },
        () => {
          // Modal foi fechado sem confirmação
        }
      );
    }
  }

  handleStatus(user: UserDTO) {
    const modalRef = this.modalService.open(ChangeStatusConfirmationComponent);
    modalRef.componentInstance.user = user;
    modalRef.result.then(
      (result) => {
        if (result) {
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
