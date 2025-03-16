import { CommonModule } from '@angular/common';
import { ListaSessoesComponent } from './components/lista/lista-sessoes.component';
import { DeleteSessaoComponent } from './components/delete/delete-sessao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CriarSessaoComponent } from './components/criar/criar-sessao.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { FiltroSessao } from 'src/app/api/models.dto';
import { Sessao } from 'src/app/api/models.dto';

@Component({
  selector: 'app-sessao',
  standalone: true,
  imports: [
    CommonModule,
    ListaSessoesComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './sessao.component.html',
})
export class SessaoComponent {
  constructor(private modalService: NgbModal) {}

  sessoes: Sessao[] = [
    {
      id: 1,
      nomeUtente: 'João Silva',
      titulo: 'Sessão de Fisioterapia',
      dataInicio: new Date('2024-03-20T10:00:00'),
      duracao: 60,
      local: 'Sala 1',
    },
    {
      id: 2,
      nomeUtente: 'Maria Santos',
      titulo: 'Sessão de Reabilitação',
      dataInicio: new Date('2024-03-21T14:00:00'),
      duracao: 45,
      local: 'Sala 2',
    },
  ];

  filtros: FiltroSessao = {
    nomeUtente: '',
    titulo: '',
    dataInicio: null,
    duracao: null,
    local: '',
  };

  onEditarSessao($event: Sessao) {
    throw new Error('Method not implemented.');
  }
  onDeleteSessao($event: Sessao) {
    throw new Error('Method not implemented.');
  }
  openCriarModal() {
    const modalRef = this.modalService.open(CriarSessaoComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.criar.subscribe((novaSessao: Sessao) => {
      novaSessao.id = this.sessoes.length + 1; // Gerar ID temporário
      this.sessoes.push(novaSessao);
      modalRef.close();
    });
  }
  filtrarSessoes(): Sessao[] {
    throw new Error('Method not implemented.');
  }
}
