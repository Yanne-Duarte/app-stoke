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
  templateUrl: './plano-edit.component.html',
  styleUrl: './plano-edit.component.scss'
   
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
          this.error = 'Erro ao Guardar plano: ' + error.message;
          this.saving = false;
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['/plano']);
  }
} 