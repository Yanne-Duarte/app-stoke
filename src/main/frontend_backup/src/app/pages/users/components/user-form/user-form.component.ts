import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserDTO } from '../../../../api/models.dto';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { UpdateUserByAdminDto } from '../../../../api/models.dto';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
})
export class UserFormComponent implements OnInit {
  isEditing = false;
  userForm: FormGroup;
  technicalUsers: { id: number; fullName: string }[] = [];
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      birthdate: ['', Validators.required],
      perfil: ['', Validators.required],
      plano: [''],
      fisioterapeutaId: [''],
    });
  }

  ngOnInit(): void {
    this.loadTechnicalUsers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loading = true;
      this.apiService.getUserById(Number(id)).subscribe({
        next: (user) => {
          this.userForm.patchValue(user);
          if (this.isEditing) {
            this.userForm.get('password')?.clearValidators();
            this.userForm.get('password')?.updateValueAndValidity();
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar usuário:', error);
          this.error = 'Erro ao carregar dados do usuário';
          this.loading = false;
        }
      });
    }
  }

  loadTechnicalUsers(): void {
    this.apiService.getAllTechnicalUsers().subscribe(
      (users) => {
        this.technicalUsers = users;
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        const updateData: UpdateUserByAdminDto = {
          fullName: this.userForm.get('fullName')?.value,
          username: this.userForm.get('username')?.value,
          birthdate: this.userForm.get('birthdate')?.value,
          perfil: this.userForm.get('perfil')?.value,
          plano: this.userForm.get('plano')?.value,
          fisioterapeuta: this.userForm.get('fisioterapeutaId')?.value,
          password: this.userForm.get('password')?.value
        };
        
        this.apiService.updateUserByAdmin(Number(id), updateData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (error) => {
            console.error('Erro ao atualizar usuário:', error);
            this.error = 'Erro ao atualizar usuário';
          }
        });
      } else {
        this.apiService.registerUser(this.userForm.value).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (error) => {
            console.error('Erro ao criar usuário:', error);
            this.error = 'Erro ao criar usuário';
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
