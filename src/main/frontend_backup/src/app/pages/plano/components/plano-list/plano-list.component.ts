import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCollapse, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../api/api.service';
import { PlanDTO } from '../../../../api/models.dto';
import { PlanoDeleteModalComponent } from '../plano-delete-modal/plano-delete-modal.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-plano-list',
  standalone: true,
  imports: [CommonModule, NgbCollapse, FormsModule, RouterModule],
  templateUrl: './plano-list.component.html',
})
export class PlanoListComponent implements OnInit {
  planos: PlanDTO[] = [];
  loading = false;
  error: string | null = null;
  isCollapsed = false;

  @Output() onEdit = new EventEmitter<PlanDTO>();
  @Output() onView = new EventEmitter<PlanDTO>();

  // Filtros
  filtros = {
    userName: '',
    creationDateStart: '',
    creationDateEnd: '',
    validityDateStart: '',
    validityDateEnd: ''
  };

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.carregarPlanos();
  }

  carregarPlanos() {
    this.loading = true;
    this.error = null;
    
    this.apiService.getAllPlans(this.filtros).subscribe({
      next: (planos) => {
        this.planos = planos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar planos: ' + error.message;
        this.loading = false;
      }
    });
  }

  atualizarValidityDate(plano: PlanDTO, novaData: string) {
    this.apiService.updatePlanValidityDate(plano.id!, novaData).subscribe({
      next: (planoAtualizado) => {
        const index = this.planos.findIndex(p => p.id === planoAtualizado.id);
        if (index !== -1) {
          this.planos[index] = planoAtualizado;
        }
      },
      error: (error) => {
        this.error = 'Erro ao atualizar data de validade: ' + error.message;
      }
    });
  }

  toggleEnabled(plano: PlanDTO) {
    this.apiService.updatePlanEnabled(plano.id!, !plano.enabled).subscribe({
      next: (planoAtualizado) => {
        const index = this.planos.findIndex(p => p.id === planoAtualizado.id);
        if (index !== -1) {
          this.planos[index] = planoAtualizado;
        }
      },
      error: (error) => {
        this.error = 'Erro ao atualizar estado: ' + error.message;
      }
    });
  }

  abrirModalDelete(plano: PlanDTO) {
    const modalRef = this.modalService.open(PlanoDeleteModalComponent);
    modalRef.componentInstance.plano = plano;

    modalRef.result.then((result) => {
      if (result) {
        this.deletarPlano(plano.id!);
      }
    });
  }

  private deletarPlano(id: number) {
    this.apiService.deletePlan(id).subscribe({
      next: () => {
        this.planos = this.planos.filter(p => p.id !== id);
      },
      error: (error) => {
        this.error = 'Erro ao eliminar plano: ' + error.message;
      }
    });
  }

  aplicarFiltros() {
    this.carregarPlanos();
  }

  limparFiltros() {
    this.filtros = {
      userName: '',
      creationDateStart: '',
      creationDateEnd: '',
      validityDateStart: '',
      validityDateEnd: ''
    };
    this.carregarPlanos();
  }
}
