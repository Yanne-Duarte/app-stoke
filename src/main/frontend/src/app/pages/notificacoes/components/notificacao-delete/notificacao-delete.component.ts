import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGlobalComponent } from '../../../../core/layout/components/modal-global/modal-global.component';
import { NotificationDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-notificacao-delete',
  standalone: true,
  imports: [CommonModule, ModalGlobalComponent],
  templateUrl: './notificacao-delete.component.html',
  styleUrls: ['./notificacao-delete.component.scss']
})
export class NotificacaoDeleteComponent {
  @Input() notificacao!: NotificationDTO;

  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
} 