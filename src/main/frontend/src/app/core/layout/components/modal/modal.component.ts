import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttonConfirmLabel: string = 'Confirmar';
  @Input() buttonCancelLabel: string = 'Cancelar';
  @Input() showConfirmButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() tipo: 'gravar' | 'outros' = 'outros';

  @Output() result = new EventEmitter<boolean | string>();

  pin: string = '';

  constructor(private activeModal: NgbActiveModal) {}

  onConfirm() {
    if (this.tipo === 'gravar') {
      this.result.emit(this.pin);
      this.activeModal.close(this.pin);
    } else {
      this.result.emit(true);
      this.activeModal.close(true);
    }
  }

  onCancel() {
    this.result.emit(false);
    this.activeModal.close(false);
  }
}
