import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificacaoDeleteComponent } from './components/notificacao-delete/notificacao-delete.component';
import { NotificacaoListComponent } from './components/notificacao-list/notificacao-list.component';
import { ApiService } from '../../api/api.service';
import { NotificationDTO } from '../../api/models.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  standalone: true,
  imports: [CommonModule, NotificacaoListComponent, RouterModule],
})
export class NotificacoesComponent implements OnInit {
  isCollapsed = true;
  notificacoes: NotificationDTO[] = [];
  loading = false;

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService
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
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
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
          console.error('Error marking notification as unread:', error);
        }
      });
    } else {
      // Se estiver marcada como não lida, marcar como lida
      this.apiService.markAsRead(notificacao.id).subscribe({
        next: () => {
          this.loadNotifications(); // Recarrega a lista após a alteração
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error marking notification as read:', error);
        }
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
              console.error('Error deleting notification:', error);
            }
          });
        }
      },
      () => {}
    );
  }

  markAllAsRead() {
    this.apiService.markAllAsRead().subscribe({
      next: () => {
        this.loadNotifications(); // Refresh list after marking all as read
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error marking all as read:', error);
      }
    });
  }
}
