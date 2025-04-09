import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO, ExerciseDTO, UserDTO, VideoRecordDTO } from '../../../../api/models.dto';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectComponent } from '../../../../core/layout/components/select/select.component';

@Component({
  selector: 'app-plano-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './plano-form.component.html',
})
export class PlanoFormComponent implements OnInit {
  plano?: PlanDTO;
  planoForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEdit = false;
  availableUsers: { id: number; descricao: string }[] = [];
  userVideos: { id: string; descricao: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.planoForm = this.fb.group({
      user: [null, Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      exercises: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadAvailableUsers();
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    if (id) {
      this.loading = true;
      this.apiService.getPlanById(parseInt(id)).subscribe({
        next: (plano) => {
          this.plano = plano;
          this.planoForm.patchValue({
            user: plano.user,
            description: plano.description,
          });

          // Carregar exercícios existentes
          plano.exercises?.forEach(exercise => {
            this.addExercise(exercise);
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar plano: ' + error.message;
          this.loading = false;
        }
      });
    }

    // Observar mudanças no usuário selecionado
    this.planoForm.get('user')?.valueChanges.subscribe(user => {
      if (user?.id) {
        this.loadUserVideos(user.id);
      } else {
        this.userVideos = [];
      }
    });
  }

  private loadUserVideos(userId: number) {
    this.apiService.getVideosByUserId(userId).subscribe({
      next: (videos) => {
        this.userVideos = videos.map(video => ({
          id: video.name,
          descricao: `${video.name} - ${video.description}`
        }));
      },
      error: (error) => {
        this.error = 'Erro ao carregar vídeos do usuário: ' + error.message;
      }
    });
  }

  private loadAvailableUsers() {
    this.apiService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users.map(user => ({
          id: user.id!,
          descricao: user.fullName
        }));
      },
      error: (error) => {
        this.error = 'Erro ao carregar utilizadores: ' + error.message;
      }
    });
  }

  get exercises() {
    return this.planoForm.get('exercises') as FormArray;
  }

  addExercise(exercise?: ExerciseDTO) {
    const exerciseForm = this.fb.group({
      description: [exercise?.description || '', Validators.required],
      videoPath: [exercise?.videoPath || '', Validators.required]
    });

    this.exercises.push(exerciseForm);
  }

  removeExercise(index: number) {
    this.exercises.removeAt(index);
  }

  onSubmit() {
    if (this.planoForm.valid) {
      this.loading = true;
      this.error = null;

      const planData: PlanDTO = {
        ...this.planoForm.value,
        id: this.plano?.id
      };

      // Apenas incluir datas e enabled se for edição
      if (this.isEdit) {
        planData.creationDate = this.plano!.creationDate;
        planData.validityDate = this.plano!.validityDate;
        planData.enabled = this.plano!.enabled;
      }

      const request = this.isEdit
        ? this.apiService.updatePlan(this.plano!.id!, planData)
        : this.apiService.createPlan(planData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/plano']);
        },
        error: (error) => {
          this.error = 'Erro ao Guardar plano: ' + error.message;
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/plano']);
  }
}
