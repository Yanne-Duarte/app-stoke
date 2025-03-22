import { Component } from '@angular/core';
import { ContentComponent } from '../content/content.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { ApiService } from '../../../../api/api.service';
import { ChatComponent } from "../../../../pages/chat/chat.component";

@Component({
  selector: 'app-portal',
  standalone: true,
  templateUrl: './portal.component.html',
  imports: [
    HeaderComponent,
    NavbarComponent,
    ContentComponent,
    FooterComponent,
    ChatComponent
],
})
export class PortalComponent {
  fullName: any;
  perfil: any;
  unreadCount: number = 0;
  /**
   *
   */
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    const user = localStorage.getItem('user') || '';

    if (user) {
      const userData = JSON.parse(user);
      this.fullName = this.getFirstAndLastName(userData.fullName);
      this.perfil = userData.perfil;
    }

    this.getUnreadCount();
  }
  getUnreadCount() {
    this.apiService.getUnreadCount().subscribe((count) => {
      this.unreadCount = count;
    });
  }
  getFirstAndLastName(fullName: any): any {
    const nameParts = fullName.trim().split(' ');
    return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
  }
}
