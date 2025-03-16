import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-temp-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './temp-register.component.html',
  styleUrls: ['./temp-register.component.scss'],
})
export class TEMPRegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        role: this.registerForm.get('role')?.value,
      };

      this.apiService.register(userData).subscribe({
        next: (response) => {
          console.log('utilizadorregistrado com sucesso:', response);
          this.errorMessage = '';
          // Limpar o formulário
          this.registerForm.reset();
        },
        error: (error) => {
          this.errorMessage = 'Erro ao registrar usuário. Tente novamente.';
          console.error('Erro no registro:', error);
        },
      });
    }
  }
}
