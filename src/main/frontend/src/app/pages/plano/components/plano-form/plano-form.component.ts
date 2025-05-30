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
import {
  PlanDTO,
  ExerciseDTO,
  UserDTO,
  VideoRecordDTO,
} from '../../../../api/models.dto';
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
      description: ['', [Validators.required]],
      exercises: this.fb.array([]),
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
          
          // Aguardar que os utilizadors disponíveis sejam carregados antes de definir o valor do utilizador
          if (this.availableUsers.length > 0) {
            this.setFormValues(plano);
          } else {
            // Se os utilizadors ainda não foram carregados, aguardar o próximo ciclo
            setTimeout(() => {
              this.setFormValues(plano);
            }, 100);
          }
          
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Erro ao carregar plano: ' + error.message;
          this.loading = false;
        },
      });
    }

    // Observar mudanças no utilizador selecionado
    this.planoForm.get('user')?.valueChanges.subscribe((userId) => {
      if (userId) {
        this.loadUserVideos(userId);
      } else {
        this.userVideos = [];
      }
    });
  }

  private setFormValues(plano: PlanDTO) {
    try {
      // Encontrar o ID do utilizador nos utilizadors disponíveis
      const userOption = this.availableUsers.find(user => user.descricao === plano.user.fullName);
      
      if (!userOption) {
        // (`utilizador ${plano.user.fullName} não encontrado nos utilizadors disponíveis`);
      }
      
      this.planoForm.patchValue({
        user: userOption ? userOption.id : null,
        description: plano.description,
      });

      // Carregar exercícios existentes
      plano.exercises?.forEach((exercise) => {
        this.addExercise(exercise);
      });
      
      // Carregar vídeos do utilizador
      if (userOption) {
        this.loadUserVideos(userOption.id);
      }
    } catch (error) {
      //TODO: handle error
      this.error = 'Erro ao carregar dados do plano para edição';
    }
  }

  private loadUserVideos(userId: number) {
    if (!userId) {
      this.userVideos = [];
      return;
    }
    
    this.apiService.getVideosByUserId(userId).subscribe({
      next: (videos) => {
        this.userVideos = videos.map((video) => ({
          id: video.name,
          descricao: `${video.name} - ${video.description}`,
        }));
      },
      error: (error) => {
        //TODO: handle error
        this.userVideos = [];
        // Não mostrar erro para o utilizador, apenas registrar no console
      },
    });
  }

  private loadAvailableUsers() {
    this.apiService.getAvailableUsers().subscribe({
      next: (users) => {
        this.availableUsers = users.map((user) => ({
          id: user.id!,
          descricao: user.fullName,
        }));
        
        // Se estiver editando e o plano já foi carregado, definir o valor do utilizador
        if (this.isEdit && this.plano) {
          this.setFormValues(this.plano);
        }
      },
      error: (error) => {
        this.error = 'Erro ao carregar utilizadores: ' + error.message;
      },
    });
  }

  get exercises() {
    return this.planoForm.get('exercises') as FormArray;
  }

  addExercise(exercise?: ExerciseDTO) {
    const exerciseForm = this.fb.group({
      description: [exercise?.description || '', Validators.required],
      videoPath: [exercise?.videoPath || '', Validators.required],
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

      const selectedUser = this.availableUsers.find(user => user.id === this.planoForm.value.user);
      if (!selectedUser) {
        this.error = 'utilizador não encontrado';
        this.loading = false;
        return;
      }

      try {
        const planData: PlanDTO = {
          ...this.planoForm.value,
          id: this.plano?.id,
          user: {
            id: selectedUser.id,
            fullName: selectedUser.descricao,
            username: '', // These fields will be populated by the backend
            birthdate: '',
            perfil: '',
            plano: '',
            fisioterapeuta: null
          },
          creationDate: this.plano?.creationDate || new Date().toISOString(),
          validityDate: this.plano?.validityDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          enabled: this.plano?.enabled !== undefined ? this.plano.enabled : true,
          exercises: this.planoForm.value.exercises
        };

        const request = this.isEdit
          ? this.apiService.updatePlan(this.plano!.id!, planData)
          : this.apiService.createPlan(planData);

        request.subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/plano']);
          },
          error: (error) => {
            this.error = `Erro ao ${this.isEdit ? 'atualizar' : 'criar'} plano: ${error.message}`;
            this.loading = false;
          }
        });
      } catch (error: any) {
        this.error = `Erro ao preparar dados do plano: ${error.message || 'Erro desconhecido'}`;
        this.loading = false;
      }
    }
  }

  onCancel() {
    this.router.navigate(['/plano']);
  }
}
