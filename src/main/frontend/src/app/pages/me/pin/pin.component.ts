import { Component } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrl: './pin.component.scss',
  providers: [DatePipe],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PinComponent {
  pin: string | undefined;
  expiraEm: string | undefined;
  isGenerating = false;

  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {}

  generatePin() {
    if (this.hasActivePin()) {
      alert('Já existe um PIN ativo. Aguarde a expiração do PIN atual.');
      return;
    }

    this.isGenerating = true;
    this.apiService.generatePin().subscribe({
      next: (response) => {
        this.pin = response.pin;
        this.expiraEm = response.expiraEm;
        this.isGenerating = false;
      },
      error: (error) => {
        console.error('Erro ao gerar PIN:', error);
        this.isGenerating = false;
      }
    });
  }

  private hasActivePin(): boolean {
    if (!this.pin || !this.expiraEm) return false;
    
    const expirationDate = new Date(this.expiraEm);
    const now = new Date();
    
    return expirationDate > now;
  }

  canGeneratePin(): boolean {
    return !this.isGenerating && !this.hasActivePin();
  }

  formatPin(pin: string): string {
    if (!pin) return '';
    return pin.match(/.{1,3}/g)?.join(' ') || pin;
  }
}
