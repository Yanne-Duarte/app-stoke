import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../api/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() unreadCount = 0;

  @Input() fullName: any;
  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {}

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        // Clear all data from local storage
        localStorage.clear();
        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error during logout:', error);
        // Even if the server request fails, we should still logout locally
        localStorage.clear();
        this.router.navigate(['/login']);
      },
    });
    // Adicione aqui sua lógica de logout
  }
}
