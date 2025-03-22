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
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
sendMessage() {
throw new Error('Method not implemented.');
}
  isOpen = false;
  form: FormGroup;

  constructor(private apiService: ApiService) {
    this.form = new FormGroup({
      mensagem: new FormControl(''),
    });
  }
  ngAfterViewChecked(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    throw new Error('Method not implemented.');
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}
