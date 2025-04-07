import { Component, OnInit } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-datepicker',
  imports: [
    NgbDatepickerModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      data: [null],
    });
  }
}
