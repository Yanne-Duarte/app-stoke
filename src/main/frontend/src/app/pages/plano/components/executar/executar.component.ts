import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-executar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executar.component.html',
  styleUrls: ['./executar.component.scss']
})
export class ExecutarComponent implements OnInit {
  plano?: PlanDTO;
  loading = false;
  error: string | null = null;
  currentStep = 0;

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

  getProgressPercentage(): number {
    if (!this.plano?.exercises?.length) {
      return 0;
    }
    return ((this.currentStep + 1) / this.plano.exercises.length) * 100;
  }

  nextStep() {
    if (this.plano?.exercises && this.currentStep < this.plano.exercises.length - 1) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
