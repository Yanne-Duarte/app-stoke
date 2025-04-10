import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanExecutionMetricsDTO } from '../../../../api/models.dto';
import { ModalGlobalComponent } from '../../../../core/layout/components/modal-global/modal-global.component';

@Component({
  selector: 'app-congratulations',
  standalone: true,
  imports: [CommonModule, ModalGlobalComponent],
  templateUrl: './congratulations.component.html',
  styleUrl: './congratulations.component.scss'
})
export class CongratulationsComponent implements OnInit, OnDestroy {
  executionMetrics?: PlanExecutionMetricsDTO;
  private autoCloseTimer: any;

  constructor(
    private activeModal: NgbActiveModal,
    private router: Router
  ) {}

  ngOnInit() {
    // Configurar timer para fechar automaticamente após 30 segundos
    this.autoCloseTimer = setTimeout(() => {
      this.closeModal();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
    }
  }

  closeModal() {
    this.activeModal.close();
    this.router.navigate(['/plano']);
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes} minuto(s) e ${remainingSeconds} segundo(s)`;
  }

  getAverageTimePerStep(): number {
    if (!this.executionMetrics?.stepTimings || this.executionMetrics.stepTimings.length === 0) {
      return 0;
    }
    
    const totalTime = this.executionMetrics.stepTimings.reduce((sum, time) => sum + time, 0);
    return totalTime / this.executionMetrics.stepTimings.length;
  }
}
