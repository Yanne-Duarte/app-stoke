import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-plano-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Detalhes do Plano</h1>
        <button class="btn btn-secondary" (click)="voltar()">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>

      <div *ngIf="loading" class="loading">Carregando detalhes do plano...</div>

      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

      <div *ngIf="plano && !loading" class="card">
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-6">
              <h5>Utente</h5>
              <div>
                <strong>Nome:</strong> {{ plano.user.fullName }}<br>
                <strong>Username:</strong> {{ plano.user.username }}<br>
                <strong>Perfil:</strong> {{ plano.user.perfil }}
              </div>
            </div>
            <div class="col-md-6">
              <h5>Estado</h5>
              <p>
                <span class="badge-notificacao" [ngClass]="plano.enabled ? 'read' : 'unread'">
                  {{ plano.enabled ? 'Ativo' : 'Inativo' }}
                </span>
              </p>
            </div>
          </div>

          <div class="mb-3">
            <h5>Descrição</h5>
            <p>{{ plano.description }}</p>
          </div>

          <div class="row mb-3">
            <div class="col-md-6">
              <h5>Data de Criação</h5>
              <p>{{ plano.creationDate | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
            <div class="col-md-6">
              <h5>Data de Validade</h5>
              <p>{{ plano.validityDate | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
          </div>

          <div class="mb-3">
            <h5>Exercícios ({{ plano.exercises?.length || 0 }})</h5>
            <div class="table-responsive" *ngIf="plano.exercises?.length">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Caminho do Vídeo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let exercise of plano.exercises">
                    <td>{{ exercise.description }}</td>
                    <td>{{ exercise.videoPath }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p *ngIf="!plano.exercises?.length" class="text-muted">
              Nenhum exercício cadastrado.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlanoViewComponent implements OnInit {
  plano?: PlanDTO;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarPlano(Number(id));
    } else {
      this.error = 'ID do plano não fornecido';
    }
  }

  carregarPlano(id: number) {
    this.loading = true;
    this.error = null;

    this.apiService.getPlanById(id).subscribe({
      next: (plano) => {
        this.plano = plano;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar plano: ' + error.message;
        this.loading = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/plano']);
  }
} 