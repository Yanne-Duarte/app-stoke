import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsDTO } from '../../../../api/models.dto';
 
@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class DeleteConfirmationComponent {
  @Input() news?: NewsDTO;

  constructor(public activeModal: NgbActiveModal) {}
} 