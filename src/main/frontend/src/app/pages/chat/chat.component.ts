import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { MessageDTO, UserDTO } from 'src/app/api/models.dto';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isOpen = false;
  form: FormGroup;
  currentUser: UserDTO | null = null;
  messages: MessageDTO[] = [];
  currentUserId: number | null = null;
  private refreshSubscription?: Subscription;
  private shouldScrollToBottom = false;
  recipientId: any;

  constructor(private apiService: ApiService) {
    this.form = new FormGroup({
      mensagem: new FormControl(''),
    });
  }

  ngOnInit() {
    this.loadCurrentUser();
    this.setupAutoRefresh();

    localStorage.getItem('user');
    const fisioterapeuta = JSON.parse(
      localStorage.getItem('user') || '{}'
    ).fisioterapeuta;
    this.recipientId = fisioterapeuta?.id;
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private setupAutoRefresh() {
    this.refreshSubscription = interval(10000).subscribe(() => {
      if (this.isOpen && this.currentUser?.fisioterapeuta) {
        this.loadMessages();
      }
    });
  }

  private scrollToBottom() {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {}
  }

  loadCurrentUser() {
    this.apiService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.currentUserId = user.id || null;
        if (user.perfil === 'USER' && user.fisioterapeuta) {
          this.loadMessages();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar usuário:', error);
      },
    });
  }

  loadMessages() {
    if (!this.currentUser?.fisioterapeuta) return;

    this.apiService.getUserChats().subscribe({
      next: (chats) => {
        const userChat = chats.find(
          (chat) =>
            chat.technicalId === Number(this.currentUser?.fisioterapeuta)
        );

        if (userChat) {
          this.apiService.getChatMessages(userChat.id).subscribe({
            next: (messages) => {
              const hadMessages = this.messages.length > 0;
              this.messages = messages;

              if (!hadMessages || this.messages.length > 0) {
                this.shouldScrollToBottom = true;
              }

              if (this.isOpen) {
                this.markMessagesAsRead();
              }
            },
            error: (error) => {
              console.error('Erro ao carregar mensagens:', error);
            },
          });
        }
      },
      error: (error) => {
        console.error('Erro ao carregar chats:', error);
      },
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadMessages();
      this.markMessagesAsRead();
      this.shouldScrollToBottom = true;
    }
  }

  markMessagesAsRead() {
    this.apiService.markAllMessagesAsRead().subscribe({
      error: (error) => {
        console.error('Erro ao marcar mensagens como lidas:', error);
      },
    });
  }

  sendMessage() {
    if (!this.form.value.mensagem?.trim()) {
      return;
    }

    const message = this.form.value.mensagem.trim();
    this.form.reset();

    this.apiService.sendMessage(message, this.recipientId).subscribe({
      next: () => {
        this.loadMessages();
        this.shouldScrollToBottom = true;
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);
        // Restaura a mensagem no formulário em caso de erro
        this.form.patchValue({ mensagem: message });
      },
    });
  }
}
