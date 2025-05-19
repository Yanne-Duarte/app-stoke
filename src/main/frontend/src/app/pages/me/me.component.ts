import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinComponent } from './pin/pin.component';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule, PinComponent],
  templateUrl: './me.component.html',
  styleUrl: './me.component.scss',
})
export class MeComponent implements OnInit {
  userData: any;

  ngOnInit() {
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      this.userData = JSON.parse(userDataString);
    }
  }
}
