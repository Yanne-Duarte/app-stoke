import { Component, Input, OnInit, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { NgbAlertModule, NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datepicker',
  imports: [
    CommonModule,
    NgbDatepickerModule,
    NgbAlertModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent implements OnInit, ControlValueAccessor, OnChanges {
  control = new FormControl<NgbDate | null>(null);
  private onChange: any = () => {};
  private onTouched: any = () => {};
  @Input() value: any;

  constructor(private dateParser: NgbDateParserFormatter) {}

  ngOnInit() {
    // Subscribe to form value changes
    this.control.valueChanges.subscribe(value => {
      if (value) {
        // Convert NgbDate to string format (YYYY-MM-DD)
        const dateStr = this.dateParser.format(value);
        this.onChange(dateStr);
      } else {
        this.onChange(null);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].currentValue) {
      // Convert string date to NgbDate
      const dateStr = changes['value'].currentValue;
      const date = this.parseDate(dateStr);
      this.control.setValue(date, { emitEvent: false });
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      // Convert string date to NgbDate
      const date = this.parseDate(value);
      this.control.setValue(date, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  private parseDate(dateStr: string): NgbDate | null {
    if (!dateStr) return null;
    
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new NgbDate(
        parseInt(parts[0], 10), // year
        parseInt(parts[1], 10), // month
        parseInt(parts[2], 10)  // day
      );
    }
    return null;
  }
}
