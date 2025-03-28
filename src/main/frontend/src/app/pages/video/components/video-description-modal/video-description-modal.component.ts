import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video-description-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Descrição do Vídeo</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="onCancel()"></button>
    </div>

    <div class="modal-body">
      <form [formGroup]="descriptionForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="description">Descrição*</label>
          <input 
            type="text" 
            class="form-control" 
            id="description"
            formControlName="description"
            placeholder="Digite uma descrição para o vídeo">
          <div class="invalid-feedback" *ngIf="descriptionForm.get('description')?.errors?.['required'] && descriptionForm.get('description')?.touched">
            A descrição é obrigatória
          </div>
        </div>
      </form>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancelar</button>
      <button type="button" class="btn btn-primary" (click)="onSubmit()" [disabled]="!descriptionForm.valid">
        Salvar
      </button>
    </div>
  `
})
export class VideoDescriptionModalComponent {
  descriptionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal
  ) {
    this.descriptionForm = this.fb.group({
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.descriptionForm.valid) {
      this.activeModal.close(this.descriptionForm.value.description);
    }
  }

  onCancel() {
    this.activeModal.dismiss();
  }
} 