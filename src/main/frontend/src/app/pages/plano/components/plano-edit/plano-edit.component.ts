import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO } from '../../../../api/models.dto';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-plano-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Editar Plano</h1>
        <button class="btn btn-secondary" (click)="voltar()">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>

      <div *ngIf="loading" class="loading">Carregando plano...</div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div class="card" *ngIf="!loading && planoForm">
        <div class="card-body">
          <form [formGroup]="planoForm" (ngSubmit)="onSubmit()">
            <div class="form-group mb-3">
              <label for="userId">ID do Utilizador*</label>
              <input 
                id="userId" 
                type="text" 
                class="form-control"
                formControlName="userId"
                placeholder="Digite o ID do utilizador">
              <div class="invalid-feedback" *ngIf="planoForm.get('userId')?.errors?.['required'] && planoForm.get('userId')?.touched">
                O ID do utilizador é obrigatório
              </div>
            </div>

            <div class="form-group mb-3">
              <label for="description">Descrição*</label>
              <textarea 
                id="description" 
                class="form-control"
                formControlName="description"
                placeholder="Digite a descrição do plano"
                rows="4">
              </textarea>
              <div class="invalid-feedback" *ngIf="planoForm.get('description')?.errors?.['required'] && planoForm.get('description')?.touched">
                A descrição é obrigatória
              </div>
              <div class="invalid-feedback" *ngIf="planoForm.get('description')?.errors?.['minlength'] && planoForm.get('description')?.touched">
                A descrição deve ter pelo menos 10 caracteres
              </div>
            </div>

            <div class="form-group mb-3">
              <label>Exercícios</label>
              <div formArrayName="exercises">
                <div *ngFor="let exercise of exercises.controls; let i=index" [formGroupName]="i" class="card mb-2">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <h6 class="mb-0">Exercício {{ i + 1 }}</h6>
                      <button type="button" class="btn btn-sm btn-danger" (click)="removeExercise(i)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>

                    <div class="form-group mb-2">
                      <label>Descrição*</label>
                      <input type="text" class="form-control" formControlName="description">
                    </div>

                    <div class="form-group">
                      <label>Caminho do Vídeo*</label>
                      <input type="text" class="form-control" formControlName="videoPath">
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" class="btn btn-outline-primary mt-2" (click)="addExercise()">
                <i class="fas fa-plus-circle"></i> Adicionar Exercício
              </button>
            </div>

            <div class="form-group mb-3">
              <label>Estado</label>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" formControlName="enabled">
                <label class="form-check-label">{{ planoForm.get('enabled')?.value ? 'Ativo' : 'Inativo' }}</label>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2">
              <button type="button" class="btn btn-secondary" (click)="voltar()">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="!planoForm.valid || saving">
                {{ saving ? 'A guardar...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PlanoEditComponent implements OnInit {
  planoForm!: FormGroup;
  loading = false;
  saving = false;
  error: string | null = null;
  planoId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.initForm();
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planoId = Number(id);
      this.carregarPlano(this.planoId);
    } else {
      this.error = 'ID do plano não fornecido';
    }
  }

  private initForm() {
    this.planoForm = this.fb.group({
      userId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      enabled: [true],
      exercises: this.fb.array([])
    });
  }

  get exercises() {
    return this.planoForm.get('exercises') as FormArray;
  }

  addExercise() {
    const exerciseForm = this.fb.group({
      description: ['', Validators.required],
      videoPath: ['', Validators.required]
    });
    this.exercises.push(exerciseForm);
  }

  removeExercise(index: number) {
    this.exercises.removeAt(index);
  }

  carregarPlano(id: number) {
    this.loading = true;
    this.error = null;

    this.apiService.getPlanById(id).subscribe({
      next: (plano) => {
        this.planoForm.patchValue({
          user: plano.user,
          description: plano.description,
          enabled: plano.enabled
        });

        // Clear existing exercises
        while (this.exercises.length) {
          this.exercises.removeAt(0);
        }

        // Add exercises from plan
        plano.exercises?.forEach(exercise => {
          const exerciseForm = this.fb.group({
            description: [exercise.description, Validators.required],
            videoPath: [exercise.videoPath, Validators.required]
          });
          this.exercises.push(exerciseForm);
        });

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar plano: ' + error.message;
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.planoForm.valid && this.planoId) {
      this.saving = true;
      this.error = null;

      const planData: PlanDTO = {
        ...this.planoForm.value,
        id: this.planoId
      };

      this.apiService.updatePlan(this.planoId, planData).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/plano']);
        },
        error: (error) => {
          this.error = 'Erro ao salvar plano: ' + error.message;
          this.saving = false;
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/plano']);
  }
} 