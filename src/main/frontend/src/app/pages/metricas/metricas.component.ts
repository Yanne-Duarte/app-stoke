import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { PlanExecutionSummaryDTO } from '../../api/models.dto';
import { SearchResultsComponent } from '../../core/layout/components/search-results/search-results.component';
import { TableHeader } from '../../core/layout/components/search-results/search.model';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchResultsComponent],
  templateUrl: './metricas.component.html',
})
export class MetricasComponent implements OnInit {
  summaries: PlanExecutionSummaryDTO[] = [];
  loading = false;
  error: string | null = null;

  headers: TableHeader[] = [
    { key: 'userName', label: 'Utente' },
    { key: 'planDescription', label: 'Plano' },
    { key: 'totalExecutions', label: 'Total de Execuções' },
    {
      key: 'averageDuration',
      label: 'Duração Média',
    },
    {
      key: 'lastExecutionDate',
      label: 'Última Execução',
      useTemplate: true,
    },
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadSummaries();
  }

  loadSummaries() {
    this.loading = true;
    this.error = null;

    this.apiService.getPlanExecutionSummary().subscribe({
      next: (summaries) => {
        this.summaries = summaries;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar resumos das execuções';
        console.error('Erro:', error);
        this.loading = false;
      },
    });
  }

  showDetails(userId: number, planId: number, executionId: number) {
    this.router.navigate(['/metricas', executionId]);
  }
}
