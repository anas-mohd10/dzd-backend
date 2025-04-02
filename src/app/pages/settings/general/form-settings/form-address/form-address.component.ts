import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FieldMap } from '../fieldsMap';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form-address',
  templateUrl: './form-address.component.html',
  styleUrls: ['./form-address.component.scss']
})
export class FormAddressComponent implements OnInit, OnDestroy {
  @Input() fields: FieldMap[] = []
  @Output() fieldsChange = new EventEmitter<FieldMap[]>()

  private labelChangeSubject = new Subject<{ value: string, index: number }>();
  private destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    this.labelChangeSubject.pipe(
      debounceTime(600),
      distinctUntilChanged((prev, curr) => prev.value === curr.value && prev.index === curr.index),
      takeUntil(this.destroy$)
    ).subscribe(({ value, index }) => {
      const updatedFields = [...this.fields];
      updatedFields[index] = {
        ...updatedFields[index],
        title: value
      };
      this.fieldsChange.emit(updatedFields);
    });
  }

  formatWord(word: string) {
    return word.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())
  }

  formatIndex(index: number) {
    const lastDigit = index % 10;
    const lastTwoDigits = index % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${index}th`;
    }
    switch (lastDigit) {
      case 1: return `${index}st`;
      case 2: return `${index}nd`;
      case 3: return `${index}rd`;
      default: return `${index}th`;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSwitchChange(event: { toggleState: boolean, switchId: string }, index: number, type: 'isRequired' | 'isVisible', fieldMap: string) {
    const updatedFields = [...this.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [type]: event.toggleState
    };

    if (type === 'isRequired' && event.toggleState == true) {
      updatedFields[index].isVisible = true;
    }

    if (type === 'isVisible' && event.toggleState == false) {
      updatedFields[index].isRequired = false;
    }

    // If the country isVisible is false, then the state and city areVisible should be false
    if (fieldMap === 'country') {
      if (type == 'isVisible' && event.toggleState == false) {
        this.hideDependentFiels(updatedFields, ['state', 'city']);
      }
    }

    if (fieldMap == 'mobile' || fieldMap == 'countryCode') {
      if (type == 'isVisible' && event.toggleState == false) {
        this.hideDependentFiels(updatedFields, [fieldMap == 'mobile' ? 'countryCode' : 'mobile']);
      }else if(type == 'isVisible' && event.toggleState == true){
        this.showDependentFiels(updatedFields, [fieldMap == 'mobile' ? 'countryCode' : 'mobile']);
      }
    }

    this.fieldsChange.emit(updatedFields);
  }

  hideDependentFiels(updatedFields: FieldMap[], fields: string[]) {
    fields.forEach(field => {
      const index = updatedFields.findIndex(f => f.fieldMap === field);
      if (index !== -1) {
        updatedFields[index].isVisible = false;
        updatedFields[index].isRequired = false;
      }
    });
  }

  showDependentFiels(updatedFields: FieldMap[], fields: string[]) {
    fields.forEach(field => {
      const index = updatedFields.findIndex(f => f.fieldMap === field);
      if (index !== -1) {
        updatedFields[index].isVisible = true;
      }
    });
  }

  onLabelChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    this.labelChangeSubject.next({ value: input.value, index });
  }
}
