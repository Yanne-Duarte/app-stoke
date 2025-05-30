import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { PlatformService } from 'src/app/api/platform.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  errorMessage: string = '';
  private formSubscription: Subscription | null = null;

  isMobileSignal = computed(() => this.platformService.isMobile());
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private platformService: PlatformService
  ) {
    // Clear all data from local storage
    localStorage.clear();

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Subscribe to form changes to clear error message
    this.formSubscription = this.loginForm.valueChanges.subscribe(() => {
      if (this.errorMessage) {
        this.errorMessage = '';
      }
    });
  }

  ngOnDestroy() {
    // Clean up subscription
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
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
              // Navigate to inicio
              this.router.navigate(['/inicio']);
            },
            error: (error) => {
              this.error = 'Error fetching user data: ' + error;
            },
          });
        },
        error: (error) => {
          this.errorMessage = 'Nome de utilizador ou palavra-passe inválidos';
        },
      });
    }
  }
}
