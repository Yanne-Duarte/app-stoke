import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sessao } from 'src/app/api/models.dto';

@Component({
  selector: 'app-delete-sessao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-sessao.component.html',
})
export class DeleteSessaoComponent {
  @Input() sessao!: Sessao;
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }
}
