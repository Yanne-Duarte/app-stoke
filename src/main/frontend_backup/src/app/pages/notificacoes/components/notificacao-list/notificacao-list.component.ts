import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NotificationDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-notificacao-list',
  standalone: true,
  imports: [CommonModule, NgbCollapse, FormsModule],
  templateUrl: './notificacao-list.component.html',
})
export class NotificacaoListComponent {
  isCollapsed = true;
  @Input() notificacoes: NotificationDTO[] = [];
  @Output() onView = new EventEmitter<NotificationDTO>();
  @Output() onDelete = new EventEmitter<NotificationDTO>();
  @Output() onMarkAllRead = new EventEmitter<void>();
  @Output() onToggleRead = new EventEmitter<NotificationDTO>();

  // Filter properties
  startDate: string = '';
  endDate: string = '';
  readStatus: string = '';

  get filteredNotificacoes(): NotificationDTO[] {
    return this.notificacoes.filter(notificacao => {
      let matches = true;
      
      if (this.startDate) {
        matches = matches && new Date(notificacao.createdAt) >= new Date(this.startDate);
      }
      
      if (this.endDate) {
        matches = matches && new Date(notificacao.createdAt) <= new Date(this.endDate);
      }
      
      if (this.readStatus !== '') {
        matches = matches && notificacao.read === (this.readStatus === 'lida');
      }
      
      return matches;
    });
  }

  handleView(notificacao: NotificationDTO): void {
    this.onView.emit(notificacao);
  }

  handleDelete(notificacao: NotificationDTO): void {
    this.onDelete.emit(notificacao);
  }

  handleMarkAllRead(): void {
    this.onMarkAllRead.emit();
  }

  handleToggleRead(notificacao: NotificationDTO): void {
    this.onToggleRead.emit(notificacao);
  }

  clearFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.readStatus = '';
  }
}
