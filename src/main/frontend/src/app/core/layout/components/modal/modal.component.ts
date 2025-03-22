import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonConfirmLabel: string = 'Confirmar';
  @Input() buttonCancelLabel: string = 'Cancelar';

  @Output() result = new EventEmitter<boolean>();

  constructor(private activeModal: NgbActiveModal) {}
  onConfirm() {
    this.result.emit(true);
    this.activeModal.dismiss();
  }
  onCancel() {
    this.activeModal.dismiss();
  }
}
