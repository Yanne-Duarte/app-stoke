import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanExecutionSummaryDTO, PlanExecutionDetailDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss']
})
export class MetricasComponent implements OnInit {
  summaries: PlanExecutionSummaryDTO[] = [];
  selectedDetails?: PlanExecutionDetailDTO;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadSummaries();
  }

  loadSummaries() {
    this.apiService.getPlanExecutionSummary().subscribe({
      next: (summaries) => {
        this.summaries = summaries;
      },
      error: (error) => {
        console.error('Erro ao carregar resumos:', error);
      }
    });
  }

  showDetails(userId: number, planId: number) {
    this.apiService.getUserPlanExecutions(userId).subscribe({
      next: (executions) => {
        this.selectedDetails = executions.find(e => e.planId === planId);
      },
      error: (error) => {
        console.error('Erro ao carregar detalhes:', error);
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