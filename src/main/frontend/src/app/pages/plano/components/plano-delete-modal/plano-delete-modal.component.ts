import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalGlobalComponent } from '../../../../core/layout/components/modal-global/modal-global.component';
import { PlanDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-plano-delete-modal',
  standalone: true,
  imports: [CommonModule, ModalGlobalComponent],
  templateUrl: './plano-delete-modal.component.html',
})
export class PlanoDeleteModalComponent {
  @Input() plano?: PlanDTO;

  constructor(private activeModal: NgbActiveModal) {}

  onCancel() {
    this.activeModal.dismiss();
  }

  onConfirm() {
    this.activeModal.close(true);
  }
}
