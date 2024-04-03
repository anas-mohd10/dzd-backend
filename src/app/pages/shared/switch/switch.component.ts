import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnInit, OnChanges {
  isToggled: boolean = false
  @Input('isToggledProps') isToggledProps: boolean = false
  @Input('switchId') switchId?: string = ''
  @Output('switchToggled') toggleEmitter: any = new EventEmitter<any>()

  ngOnChanges(changes: SimpleChanges): void {
    this.isToggled = this.isToggledProps
    this.ChangeDetectorRef.markForCheck()
  }

  constructor(
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  toggleSwitch() {
    this.isToggled = !this.isToggled    
    this.toggleEmitter.emit({ switchId: this.switchId, toggleState: this.isToggled })
  }

}
