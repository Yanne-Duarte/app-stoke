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
  ChangeDetectorRef,
} from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { interval, Subscription } from 'rxjs';
import { UserDTO } from 'src/app/api/models.dto';

interface ChatMessage {
  sender: string;
  recipient: string;
  content: string;
  timestamp: Date;
  mensagem: string;
}

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
  messages: ChatMessage[] = [];
  private messageSubscription?: Subscription;
  currentUser: any;
  private chatTopic: string = '';
  patients: UserDTO[] = [];
  selectedPatient: UserDTO | null = null;

  constructor(
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.form = new FormGroup({
      mensagem: new FormControl(''),
      sender: new FormControl(''),
      content: new FormControl(''),
      timestamp: new FormControl(new Date().toISOString()),
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.apiService.connect();
    this.setupUserAndTopic();
    // Inicializa o chat como fechado
    this.isOpen = false;
  }

  private async setupUserAndTopic() {
    try {
      // Get current user
      this.currentUser = await this.apiService.getCurrentUser().toPromise();
      console.log('Current user:', this.currentUser);

      // Set sender ID in form
      this.form.patchValue({
        sender: this.currentUser.username,
      });

      // Load patients if user is a physiotherapist
      if (this.currentUser.perfil === 'TECHNICAL') {
        this.loadPatients();
      } else {
        // For patients, they can only chat with their assigned physiotherapist
        if (this.currentUser.fisioterapeuta) {
          const minId = Math.min(
            this.currentUser.id,
            this.currentUser.fisioterapeuta.id
          );
          const maxId = Math.max(
            this.currentUser.id,
            this.currentUser.fisioterapeuta.id
          );
          this.chatTopic = `/topic/chat/${minId}/${maxId}`;
          console.log('Subscribing to topic:', this.chatTopic);
          this.setupMessageSubscription();
          // Load chat history for patient
          if (this.currentUser.id && this.currentUser.fisioterapeuta.id) {
            this.loadChatHistory(this.currentUser.id, this.currentUser.fisioterapeuta.id);
          }
        }
      }
    } catch (error) {
      console.error('Error setting up chat:', error);
    }
  }

  private loadPatients() {
    this.apiService.getAllUsers({ perfil: 'USER' }).subscribe({
      next: (patients) => {
        this.patients = patients;
        console.log('Loaded patients:', this.patients);
      },
      error: (error) => {
        console.error('Error loading patients:', error);
      }
    });
  }

  selectPatient(patient: UserDTO) {
    this.selectedPatient = patient;
    this.messages = []; // Clear previous messages
    this.setupChatTopic();
    // Load chat history when selecting a patient
    if (this.currentUser?.id && patient.id) {
      this.loadChatHistory(this.currentUser.id, patient.id);
    }
  }

  private setupChatTopic() {
    if (this.selectedPatient && this.selectedPatient.id && this.currentUser?.id) {
      const minId = Math.min(
        this.currentUser.id,
        this.selectedPatient.id
      );
      const maxId = Math.max(
        this.currentUser.id,
        this.selectedPatient.id
      );
      this.chatTopic = `/topic/chat/${minId}/${maxId}`;
      console.log('Setting up chat topic:', this.chatTopic);
      this.setupMessageSubscription();
    } else {
      console.error('Cannot setup chat topic: missing user IDs');
    }
  }

  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
    this.apiService.disconnect();
    this.messages = [];
    this.selectedPatient = null;
    this.currentUser = null;
  }

  private setupMessageSubscription() {
    if (this.chatTopic) {
      // Unsubscribe from previous subscription if exists
      if (this.messageSubscription) {
        this.messageSubscription.unsubscribe();
      }

      // Subscribe to new topic
      this.messageSubscription = this.apiService.messageSubject.subscribe(
        (message: ChatMessage) => {
          console.log('Received message in subscription:', message);
          console.log('Current user:', this.currentUser.username);
          console.log('Selected patient:', this.selectedPatient?.username);
          console.log('Physiotherapist:', this.currentUser.fisioterapeuta?.username);
          
          // Check if this message is for the current chat
          const isFromCurrentUser = message.sender === this.currentUser.username;
          const isFromSelectedPatient = this.selectedPatient && message.sender === this.selectedPatient.username;
          const isFromPhysiotherapist = this.currentUser.fisioterapeuta && message.sender === this.currentUser.fisioterapeuta.username;
          const isToCurrentUser = message.recipient === this.currentUser.username;
          
          console.log('Message check:', {
            isFromCurrentUser,
            isFromSelectedPatient,
            isFromPhysiotherapist,
            isToCurrentUser
          });

          if (isFromCurrentUser || isFromSelectedPatient || isFromPhysiotherapist || isToCurrentUser) {
            console.log('Adding message to chat:', message);
            this.messages.push(message);
            this.scrollToBottom();
          }
        }
      );
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      // Garante que o chat seja visível antes de rolar
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
    // Força a detecção de mudanças
    this.changeDetectorRef.detectChanges();
  }

  sendMessage() {
    if (this.form.valid && this.form.value.mensagem?.trim()) {
      const recipient = this.currentUser.perfil === 'TECHNICAL' 
        ? this.selectedPatient?.username 
        : this.currentUser.fisioterapeuta?.username;

      if (!recipient) {
        console.error('No recipient found');
        return;
      }

      const message = {
        ...this.form.value,
        content: this.form.value.mensagem,
        timestamp: new Date().toISOString(),
        sender: this.currentUser.username,
        recipient: recipient
      };

      console.log('Sending message:', message);
      this.apiService.sendMessage(message);
      this.form.patchValue({ mensagem: '' });
    }
  }

  private loadChatHistory(user1Id: number, user2Id: number): void {
    if (!user1Id || !user2Id) {
      console.error('Invalid user IDs for chat history:', { user1Id, user2Id });
      return;
    }
    this.apiService.getChatHistory(user1Id, user2Id).subscribe({
      next: (history: ChatMessage[]) => {
        console.log('Chat history loaded:', history);
        this.messages = history.map((msg: ChatMessage) => ({
          sender: msg.sender,
          recipient: msg.recipient,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          mensagem: msg.content
        }));
        this.scrollToBottom();
      },
      error: (error: any) => {
        console.error('Error loading chat history:', error);
      }
    });
  }
}
