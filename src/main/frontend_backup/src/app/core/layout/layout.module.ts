import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './components/portal/portal.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

const components = [
  PortalComponent,
  HeaderComponent,
  FooterComponent,
  ContentComponent,
  NavbarComponent,
];

@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    RouterOutlet,
    //FormsModule,
  ],
})
export class LayoutModule {}
