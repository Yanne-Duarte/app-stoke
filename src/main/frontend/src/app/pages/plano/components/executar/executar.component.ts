import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO, PlanExecutionMetricsDTO } from '../../../../api/models.dto';
import { PlayVideoComponent } from '../../../gravacoes/play-video/play-video.component';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-executar',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  templateUrl: './executar.component.html',
  styleUrls: ['./executar.component.scss'],
})
export class ExecutarComponent implements OnInit, OnDestroy {
  plano?: PlanDTO;
  loading = false;
  error: string | null = null;
  currentStep = 0;
  executionMetrics?: PlanExecutionMetricsDTO;
  stepStartTime: number = 0;
  private stepTimings: { stepNumber: number; timeSpent: number }[] = [];
  perfil: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarPlano(Number(id));
    } else {
      this.error = 'ID do plano não fornecido';
    }

    this.perfil = JSON.parse(localStorage.getItem('user') ?? '').perfil;
  }

  ngOnDestroy() {
    if (this.executionMetrics) {
      this.finalizarExecucao();
    }
  }

  carregarPlano(id: number) {
    this.loading = true;
    this.error = null;

    this.apiService.getPlanById(id).subscribe({
      next: (plano) => {
        console.log('Plano carregado:', plano);
        this.plano = plano;
        this.loading = false;
        this.iniciarExecucao(id);
      },
      error: (error) => {
        this.error = 'Erro ao carregar plano: ' + error.message;
        this.loading = false;
      },
    });
  }

  iniciarExecucao(planId: number) {
    this.apiService.startPlanExecution(planId).subscribe({
      next: (metrics) => {
        this.executionMetrics = metrics;
        this.stepStartTime = Date.now();
      },
      error: (error) => {
        console.error('Erro ao iniciar execução:', error);
      },
    });
  }

  atualizarMetricas() {
    if (!this.executionMetrics) return;

    const currentTime = Date.now();
    const timeSpent = (currentTime - this.stepStartTime) / 1000; // Convert to seconds

    // Record timing for current step
    this.stepTimings.push({
      stepNumber: this.currentStep,
      timeSpent: timeSpent,
    });

    // Update metrics
    this.executionMetrics.currentStep = this.currentStep;
    this.executionMetrics.nextStepClicks = this.nextStepClicks;
    this.executionMetrics.previousStepClicks = this.previousStepClicks;
    this.executionMetrics.totalSteps = this.plano?.exercises?.length || 0;
    this.executionMetrics.stepTimings = this.stepTimings.map(
      (timing) => timing.timeSpent
    );

    this.apiService
      .updatePlanExecution(this.executionMetrics.id!, {
        currentStep: this.currentStep,
        nextStepClicks: this.nextStepClicks,
        previousStepClicks: this.previousStepClicks,
        totalSteps: this.plano?.exercises?.length || 0,
        stepTimings: this.stepTimings.map((timing) => timing.timeSpent),
      })
      .subscribe({
        error: (error) => {
          console.error('Erro ao atualizar métricas:', error);
        },
      });

    this.stepStartTime = currentTime;
  }

  nextStepClicks = 0;
  previousStepClicks = 0;

  nextStep() {
    if (
      this.plano?.exercises &&
      this.currentStep < this.plano.exercises.length - 1
    ) {
      this.nextStepClicks++;
      this.currentStep++;
      this.atualizarMetricas();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.previousStepClicks++;
      this.currentStep--;
      this.atualizarMetricas();
    }
  }

  finalizarExecucao() {
    if (!this.executionMetrics) return;

    const endTime = new Date().toISOString();
    const totalDuration =
      (Date.now() - new Date(this.executionMetrics.startTime).getTime()) / 1000;

    this.apiService
      .updatePlanExecution(this.executionMetrics.id!, {
        endTime,
        totalDuration,
        completed: true,
        currentStep: this.currentStep,
        nextStepClicks: this.nextStepClicks,
        previousStepClicks: this.previousStepClicks,
        totalSteps: this.plano?.exercises?.length || 0,
        stepTimings: this.stepTimings.map((timing) => timing.timeSpent),
      })
      .subscribe({
        error: (error) => {
          console.error('Erro ao finalizar execução:', error);
        },
      });
  }

  finalizar() {
    this.finalizarExecucao();
    this.router.navigate(['/plano']);
  }

  getProgressPercentage(): number {
    if (!this.plano?.exercises?.length) {
      return 0;
    }
    return ((this.currentStep + 1) / this.plano.exercises.length) * 100;
  }

  isEnabled(): boolean {
    return this.plano?.enabled ?? false;
  }

  handlePlay(exercise: any) {
    const modalRef = this.modalService.open(PlayVideoComponent, {
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.videoName = exercise.videoPath;
    modalRef.componentInstance.perfil = this.perfil;

    modalRef.componentInstance.result.subscribe((result: boolean) => {
      if (result) {
        // Video was successfully played
        console.log('Video played successfully');
      } else {
        // User cancelled or there was an error
        console.log('Video playback cancelled or failed');
      }
    });
  }
}
