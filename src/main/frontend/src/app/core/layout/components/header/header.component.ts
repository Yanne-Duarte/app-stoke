import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { SidebarItem } from '../navbar/sidebar.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() unreadCount = 0;
  @Input() fullName: any;

  isMobile: boolean = false;
  isMobileMenuOpen: boolean = false;
  menuItems!: any[];

  @Input() set perfil(value: string) {
    if (value) {
      this._perfil = value;
      this.configureMenuItems();
    }
  }
  get perfil(): string {
    return this._perfil;
  }
  private _perfil: string = '';

  constructor(private router: Router, private apiService: ApiService) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Adicionar listener para mudanças no tamanho da tela
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });

    // Configuração inicial
    this.checkScreenSize();
    this.configureMenuItems();
  }

  configureMenuItems() {
    // Definir um menu padrão caso o perfil ainda não esteja disponível
    this.menuItems = SidebarItem.userMenu; // Menu default

    if (this.perfil === 'ADMIN') {
      this.menuItems = SidebarItem.adminMenu;
    } else if (this.perfil === 'TECHNICAL') {
      this.menuItems = SidebarItem.technicalMenu;
    } else if (this.perfil === 'USER') {
      this.menuItems = SidebarItem.userMenu;
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 778;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevenir scroll quando menu está aberto
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        localStorage.clear();
        this.router.navigate(['/login']);
      },
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['perfil']) {
    }
  }
}
