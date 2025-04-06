import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../../api/api.service';
import { SidebarItem } from '../navbar/sidebar.model';
import { PlatformService } from '../../../../api/platform.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() unreadCount = 0;
  @Input() fullName: any;

  isMobile = computed(() => this.platformService.isMobile());
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

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private platformService: PlatformService
  ) {
    effect(() => {
      console.log('***************** Mobile status changed:', this.isMobile());
    });
  }

  ngOnInit() {
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
    // Cleanup se necessário
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['perfil']) {
      this.configureMenuItems();
    }
  }
}
