import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MensagensComponent } from './pages/mensagens/mensagens.component';
import { ChatComponent } from './pages/chat/chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ChatComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  showChat = true;
}
