import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarItem } from './sidebar.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() perfil: any;
  menuItems: { label: string; icon: string; route: string }[] = [];

  ngOnInit() {
    if (this.perfil === 'ADMIN') {
      this.menuItems = SidebarItem.adminMenu;
    } else if (this.perfil === 'TECHNICAL') {
      this.menuItems = SidebarItem.technicalMenu;
    } else if (this.perfil === 'USER') {
      this.menuItems = SidebarItem.userMenu;
    }
  }
}
