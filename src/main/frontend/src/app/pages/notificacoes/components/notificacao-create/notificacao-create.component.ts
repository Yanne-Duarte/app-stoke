import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { UserDTO } from '../../../../api/models.dto';
import { SelectComponent } from '../../../../core/layout/components/select/select.component';

@Component({
  selector: 'app-notificacao-create',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectComponent],
  templateUrl: './notificacao-create.component.html',
  styleUrls: ['./notificacao-create.component.scss']
})
export class NotificacaoCreateComponent implements OnInit {
  notification = {
    title: '',
    message: '',
    recipientUserId: null as number | null
  };

  recipients: { id: number; descricao: string }[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() { 
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true; 
    this.apiService.getAllUsers({}).subscribe({
      next: (users: UserDTO[]) => { 
        if (users && users.length > 0) {
          this.recipients = users.map(user => ({
            id: user.id!,
            descricao: user.fullName
            })); 
        } else {
          this.error = 'No users received from API';
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading users: ' + error;
        this.loading = false;
      }
    });
  }

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
         this.error = 'Error creating notification: ' + error;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/notificacoes']);
  }
} 