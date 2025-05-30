import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanExecutionDetailDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-metricas-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './metricas-detalhe.component.html',
  styleUrls: ['./metricas-detalhe.component.scss']
})
export class MetricasDetalheComponent implements OnInit {
  execution?: PlanExecutionDetailDTO;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const executionId = this.route.snapshot.paramMap.get('id');
    if (executionId) {
      this.loadExecutionDetails(parseInt(executionId));
    }
  }

  loadExecutionDetails(executionId: number) {
    this.loading = true;
    this.error = null;
    
    this.apiService.getPlanExecutionDetails(executionId).subscribe({
      next: (execution: PlanExecutionDetailDTO) => {
        this.execution = execution;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erro ao carregar detalhes da execução'; 
        this.loading = false;
      }
    });
  }

  formatDuration(seconds?: number): string {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }
} 