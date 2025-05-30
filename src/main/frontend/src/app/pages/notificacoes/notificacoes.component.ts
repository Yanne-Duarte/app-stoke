import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificacaoDeleteComponent } from './components/notificacao-delete/notificacao-delete.component';
import { ApiService } from '../../api/api.service';
import { NotificationDTO } from '../../api/models.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchResultsComponent } from '../../core/layout/components/search-results/search-results.component';
import {
  FilterField,
  TableHeader,
} from '../../core/layout/components/search-results/search.model';
import { ModalGlobalComponent } from 'src/app/core/layout/components/modal-global/modal-global.component';
import { ModalComponent } from 'src/app/core/layout';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss'],
  standalone: true,
  imports: [CommonModule, SearchResultsComponent, RouterModule],
})
export class NotificacoesComponent implements OnInit {
  notificacoes: NotificationDTO[] = [];
  loading = false;

  filterFields: FilterField[] = [
    {
      name: 'startDate',
      label: 'Data Início',
      type: 'date',
    },
    {
      name: 'endDate',
      label: 'Data Fim',
      type: 'date',
    },
    {
      name: 'readStatus',
      label: 'Status',
      type: 'select',
      options: [
        { id: '', descricao: 'Todos' },
        { id: 'lida', descricao: 'Lida' },
        { id: 'nao_lida', descricao: 'Não Lida' },
      ],
    },
  ];

  tableHeaders: TableHeader[] = [
    { key: 'senderName', label: 'Remetente' },
    { key: 'title', label: 'Título' },
    { key: 'message', label: 'Mensagem', useTemplate: true },
    {
      key: 'createdAt',
      label: 'Data',
      useTemplate: true,
    },
    {
      key: 'read',
      label: 'Estado',
      useTemplate: true,
    },
  ];
  error: string | null = null;

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.apiService.getNotifications().subscribe({
      next: (notifications) => {
        this.notificacoes = notifications;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.error = 'Error loading notifications: ' + error;
        this.loading = false;
      },
    });
  }

  toggleReadStatus(notificacao: NotificationDTO) {
    if (notificacao.read) {
      // Se estiver marcada como lida, marcar como não lida
      this.apiService.markAsUnread(notificacao.id).subscribe({
        next: () => {
          this.loadNotifications(); // Recarrega a lista após a alteração
        },
        error: (error: HttpErrorResponse) => {
          this.error = 'Error marking notification as unread: ' + error;
        },
      });
    } else {
      // Se estiver marcada como não lida, marcar como lida
      this.apiService.markAsRead(notificacao.id).subscribe({
        next: () => {
          this.loadNotifications(); // Recarrega a lista após a alteração
        },
        error: (error: HttpErrorResponse) => {
          this.error = 'Error marking notification as read: ' + error;
        },
      });
    }
  }

  openDeleteModal(notificacao: NotificationDTO) {
    const modalRef = this.modalService.open(NotificacaoDeleteComponent);
    modalRef.componentInstance.notificacao = notificacao;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.apiService.deleteNotification(notificacao.id).subscribe({
            next: () => {
              this.loadNotifications(); // Refresh list after deletion
            },
            error: (error: HttpErrorResponse) => {
              this.error = 'Error deleting notification: ' + error;
            },
          });
        }
      },
      () => {}
    );
  }

  navigateToCreate() {
    this.router.navigate(['/notificacoes/criar']);
  }

  openView(notificacao: NotificationDTO) {
    const modalRef = this.modalService.open(ModalComponent, { size: 'lg', centered: true });
     
    modalRef.componentInstance.title = 'Detalhes da Notificação';
    modalRef.componentInstance.message = notificacao.message;
    modalRef.componentInstance.buttonCancelLabel = 'Fechar'; 
    modalRef.componentInstance.showConfirmButton = false;
    modalRef.result.then(
      (result) => {
        if (result) {
          //this.loadNotifications(); // Refresh list after deletion
        }
      },
      () => {}
    );
  }
}
