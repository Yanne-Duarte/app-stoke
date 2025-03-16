import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; 
import { Sessao } from 'src/app/api/models.dto';

@Component({
  selector: 'app-criar-sessao',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './criar-sessao.component.html'
})
export class CriarSessaoComponent implements OnInit {
  sessaoForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {
    this.sessaoForm = this.fb.group({
      nomeUtente: ['', Validators.required],
      titulo: ['', Validators.required],
      dataInicio: ['', Validators.required],
      duracao: ['', [Validators.required, Validators.min(1)]],
      local: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  criarSessao() {
    if (this.sessaoForm.valid) {
      this.loading = true;
      this.error = null;

      try {
        const novaSessao: Sessao = {
          ...this.sessaoForm.value,
          dataInicio: new Date(this.sessaoForm.value.dataInicio),
          id: 0 // ID será definido pelo componente pai
        };

        this.activeModal.close(novaSessao);
      } catch (error) {
        this.error = 'Erro ao criar sessão. Tente novamente.';
        this.loading = false;
      }
    }
  }
} 