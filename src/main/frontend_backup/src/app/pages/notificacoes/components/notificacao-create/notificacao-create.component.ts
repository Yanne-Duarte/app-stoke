import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-notificacao-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Nova Notificação</h1>
          <p>Criar uma nova notificação no sistema</p>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <form #form="ngForm" (ngSubmit)="save()">
            <div class="mb-3">
              <label class="form-label">Título</label>
              <input type="text" class="form-control" name="title" [(ngModel)]="notification.title" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Mensagem</label>
              <textarea class="form-control" name="message" [(ngModel)]="notification.message" required rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Destinatário</label>
              <select class="form-select" name="recipientUserId" [(ngModel)]="notification.recipientUserId" required>
                <option value="">Selecione um destinatário</option>
                <option *ngFor="let recipient of recipients" [value]="recipient.id">
                  {{ recipient.label }}
                </option>
              </select>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" (click)="cancel()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!form.form.valid">Salvar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class NotificacaoCreateComponent {
  notification = {
    title: '',
    message: '',
    recipientUserId: null as number | null
  };

  recipients = Array.from({length: 10}, (_, i) => ({
    id: i + 1,
    label: `Utilizador ${i + 1}`
  }));

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  save() {
    if (this.notification.recipientUserId !== null) {
      this.apiService.createNotification({
        title: this.notification.title,
        message: this.notification.message,
        recipientUserId: this.notification.recipientUserId
      }).subscribe({
        next: () => {
          this.router.navigate(['/notificacoes']);
        },
        error: (error) => {
          console.error('Error creating notification:', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/notificacoes']);
  }
} 