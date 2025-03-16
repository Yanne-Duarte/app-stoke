import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { TEMPRegisterComponent } from '../temp-register/temp-register.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, TEMPRegisterComponent],
  templateUrl: './login.component.html',
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    // Clear all data from local storage
    localStorage.clear();

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value,
      };

      this.apiService.login(loginData).subscribe({
        next: (response) => {
          // Store the token using ApiService
          this.apiService.setToken(response.token);

          // Get additional user data
          this.apiService.getUserLogin().subscribe({
            next: (userData) => {
              // Store complete user data
              localStorage.setItem('user', JSON.stringify(userData));
              // Navigate to dashboard
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              console.error('Error fetching user data:', error);
            },
          });
        },
        error: (error) => {
          this.errorMessage = 'username ou senha inválidos';
        },
      });
    }
  }
}
