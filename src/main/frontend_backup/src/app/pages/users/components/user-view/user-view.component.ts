import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { UserDTO } from '../../../../api/models.dto';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  imports: [CommonModule, RouterModule],
  standalone: true
})
export class UserViewComponent implements OnInit {
  user?: UserDTO;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getUserById(Number(id)).subscribe({
        next: (user) => {
          this.user = user;
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

  goBack() {
    this.router.navigate(['/users']);
  }
} 