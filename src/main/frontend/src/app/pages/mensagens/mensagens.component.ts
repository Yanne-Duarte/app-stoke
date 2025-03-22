import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { ApiService } from '../../api/api.service'; 

@Component({
  selector: 'app-mensagens',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './mensagens.component.html',
  styleUrls: ['./mensagens.component.scss'],
})
export class MensagensComponent implements OnInit, OnDestroy {
  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
