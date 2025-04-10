import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-plano-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plano-view.component.html'
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