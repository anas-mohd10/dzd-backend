import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {
  device: string = 'desktop'
  form: FormGroup

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      primary: new FormControl(""),
    })
  }

  //Toggle device
  deviceToggled(event: string) {
    this.device = event;
    this.ChangeDetectorRef.markForCheck()
  }
  //Toggle device

}
