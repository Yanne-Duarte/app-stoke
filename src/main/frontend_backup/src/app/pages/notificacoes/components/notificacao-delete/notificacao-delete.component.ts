import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGlobalComponent } from '../../../../core/layout/components/modal-global/modal-global.component';

@Component({
  selector: 'app-notificacao-delete',
  standalone: true,
  imports: [CommonModule, ModalGlobalComponent],
  templateUrl: './notificacao-delete.component.html'
})
export class NotificacaoDeleteComponent {
  @Input() notificacao: any;

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
} 