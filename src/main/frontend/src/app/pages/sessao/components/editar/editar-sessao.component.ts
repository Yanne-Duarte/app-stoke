import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sessao } from 'src/app/api/models.dto';
@Component({
  selector: 'app-editar-sessao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-sessao.component.html'
})
export class EditarSessaoComponent {
  @Input() sessao!: Sessao;
  @Output() salvar = new EventEmitter<Sessao>();
  @Output() cancelar = new EventEmitter<void>();

  atualizarSessao() {
    this.salvar.emit(this.sessao);
  }

  cancelarEdicao() {
    this.cancelar.emit();
  }
} 