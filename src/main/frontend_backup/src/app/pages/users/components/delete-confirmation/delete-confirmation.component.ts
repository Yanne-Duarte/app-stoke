import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  imports: [CommonModule],
  standalone: true
})
export class DeleteConfirmationComponent {
  @Input() user?: UserDTO;

  constructor(public activeModal: NgbActiveModal) {}
}