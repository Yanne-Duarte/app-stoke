import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanoListComponent } from './components/plano-list/plano-list.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchResultsComponent } from '../../core/layout/components/search-results/search-results.component';
import { PlanDTO, PlanFilterDTO } from 'src/app/api/models.dto';
import { PlanoDeleteModalComponent } from './components/plano-delete-modal/plano-delete-modal.component';
import {
  FilterField,
  TableHeader,
} from 'src/app/core/layout/components/search-results/search.model';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [CommonModule, SearchResultsComponent],
  templateUrl: './plano.component.html',
})
export class PlanoComponent implements OnInit {
  handlePlay(_t5: any) {
    throw new Error('Method not implemented.');
  }
  headers: TableHeader[] = [
    { key: 'user', label: 'Utente', useTemplate: true },
    { key: 'description', label: 'Descrição' },
    { key: 'creationDate', label: 'Data de Criação', useTemplate: true },
    { key: 'validityDate', label: 'Data de Validade', useTemplate: true },
    { key: 'enabled', label: 'Estado', useTemplate: true },

    { key: 'actions', label: 'Ações', useTemplate: true },
  ];
  filterFields: FilterField[] = [
    { name: 'userName', label: 'Utente', type: 'text' },
    {
      name: 'creationDateStart',
      label: 'Data de Criação Início',
      type: 'date',
    },
    { name: 'creationDateEnd', label: 'Data de Criação Fim', type: 'date' },
    {
      name: 'validityDateStart',
      label: 'Data de Validade Início',
      type: 'date',
    },
    { name: 'validityDateEnd', label: 'Data de Validade Fim', type: 'date' },
  ];

  planos: PlanDTO[] = [];
  loading = false;
  error: string | null = null;
  isCollapsed = false;
  canPlayPlano: string | boolean;

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.canPlayPlano =
      JSON.parse(localStorage.getItem('user') ?? '').perfil === 'USER' || false;
  }

  ngOnInit() {
    this.carregarPlanos();
  }

  handleNew() {
    this.router.navigate(['criar'], { relativeTo: this.route });
  }
  handleDelete(plano: PlanDTO) {
    const modalRef = this.modalService.open(PlanoDeleteModalComponent);
    modalRef.componentInstance.plano = plano;

    modalRef.result.then((result: any) => {
      if (result) {
        this.apagar(plano.id!);
      }
    });
  }
  handleView(plano: PlanDTO) {
    this.router.navigate([plano.id], { relativeTo: this.route });
  }
  handleEdit(plano: PlanDTO) {
    this.router.navigate([plano.id, 'edit'], { relativeTo: this.route });
  }

  handleClear() {
    this.carregarPlanos({});
  }
  handleFilter($event: any) {
    this.carregarPlanos($event);
  }

  carregarPlanos(filter?: PlanFilterDTO) {
    this.loading = true;
    this.error = null;

    this.apiService.getAllPlans(filter).subscribe({
      next: (planos) => {
        this.planos = planos;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erro ao carregar planos: ' + error.message;
        this.loading = false;
      },
    });
  }

  atualizarValidityDate(plano: PlanDTO, novaData: string) {
    this.apiService.updatePlanValidityDate(plano.id!, novaData).subscribe({
      next: (planoAtualizado) => {
        const index = this.planos.findIndex((p) => p.id === planoAtualizado.id);
        if (index !== -1) {
          this.planos[index] = planoAtualizado;
        }
      },
      error: (error: any) => {
        this.error = 'Erro ao atualizar data de validade: ' + error.message;
      },
    });
  }

  toggleEnabled(plano: PlanDTO) {
    this.apiService.updatePlanEnabled(plano.id!, !plano.enabled).subscribe({
      next: (planoAtualizado) => {
        const index = this.planos.findIndex((p) => p.id === planoAtualizado.id);
        if (index !== -1) {
          this.planos[index] = planoAtualizado;
        }
      },
      error: (error) => {
        this.error = 'Erro ao atualizar estado: ' + error.message;
      },
    });
  }

  private apagar(id: number) {
    this.apiService.deletePlan(id).subscribe({
      next: () => {
        this.planos = this.planos.filter((p) => p.id !== id);
      },
      error: (error) => {
        this.error = 'Erro ao eliminar plano: ' + error.message;
      },
    });
  }
}
