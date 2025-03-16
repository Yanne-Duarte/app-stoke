import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sessao } from 'src/app/api/models.dto';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lista-sessoes',
  standalone: true,
  imports: [CommonModule, NgbCollapse],
  templateUrl: './lista-sessoes.component.html'
})
export class ListaSessoesComponent {
  @Input() sessoes: Sessao[] = [];
  @Output() editar = new EventEmitter<Sessao>();
  @Output() delete = new EventEmitter<Sessao>();
  isCollapsed = false;
} 