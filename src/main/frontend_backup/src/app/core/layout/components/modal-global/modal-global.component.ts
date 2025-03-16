import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-global',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-global.component.html',
  styleUrls: ['./modal-global.component.scss'],
})
export class ModalGlobalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  onClose() {
    this.activeModal.dismiss('Cross click');
  }
}
