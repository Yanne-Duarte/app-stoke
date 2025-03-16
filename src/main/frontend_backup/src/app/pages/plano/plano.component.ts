import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanoListComponent } from './components/plano-list/plano-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [
    CommonModule,
    PlanoListComponent,
    NgbModule,
  ],
  templateUrl: './plano.component.html',
})
export class PlanoComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
   
  }

  navigateToCreate() {
    this.router.navigate(['/plano/criar']);
  }

  navigateToEdit(plano: any) {
    this.router.navigate(['/plano', plano.id, 'edit']);
  }
}
