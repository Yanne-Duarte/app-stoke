import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../api/api.service';
import { ChatDTO, MessageDTO, UserDTO } from '../../api/models.dto';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-mensagens',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.scss'],
})
export class MensagensComponent implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({
    mensagem: new FormControl(''),
  });

  chats: ChatDTO[] = [];
  selectedChat: ChatDTO | null = null;
  messages: MessageDTO[] = [];
  currentUser: UserDTO | null = null;
  currentUserId: number | null = null;
  private refreshSubscription?: Subscription;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCurrentUser();
    // Refresh messages every 10 seconds
    this.refreshSubscription = interval(10000).subscribe(() => {
      if (this.currentUser?.perfil === 'TECHNICAL') {
        this.loadChats();
        if (this.selectedChat) {
          this.loadMessages(this.selectedChat.id);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadCurrentUser() {
    this.apiService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.currentUserId = user.id || null;
      if (user.perfil === 'TECHNICAL') {
        this.loadChats();
      }
    });
  }

  loadChats() {
    this.apiService.getUserChats().subscribe(chats => {
      // Filter chats where the technical is the recipient
      this.chats = chats.filter(chat => 
        chat.technicalId === this.currentUserId
      );
    });
  }

  selectChat(chat: ChatDTO) {
    this.selectedChat = chat;
    this.loadMessages(chat.id);
  }

  loadMessages(chatId: number) {
    this.apiService.getChatMessages(chatId).subscribe(messages => {
      this.messages = messages;
      this.markMessagesAsRead();
    });
  }

  markMessagesAsRead() {
    this.apiService.markAllMessagesAsRead().subscribe();
  }

  enviarMensagem() {
    if (!this.selectedChat || !this.form.value.mensagem?.trim()) {
      return;
    }

    this.apiService.sendMessage(
      this.form.value.mensagem,
      this.selectedChat.userId
    ).subscribe(() => {
      this.form.reset();
      this.loadMessages(this.selectedChat!.id);
    });
  }
}
