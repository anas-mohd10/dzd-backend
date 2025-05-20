import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ClickPulsePanel } from '../home.constants';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-clickpulse-panel',
  templateUrl: './clickpulse-panel.component.html',
  styleUrls: ['./clickpulse-panel.component.scss']
})
export class ClickpulsePanelComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  @Output() handleClickpulse: EventEmitter<any> = new EventEmitter();
  tabs: Array<ClickPulsePanel> = [];
  tabsForm: FormGroup[] = [];
  private tabUpdate$ = new Subject<{ index: number; field: string; value: string }>();
  private tabItemUpdate$ = new Subject<{ index: number; field: string; value: string }>();
  inViewTab: ClickPulsePanel | null = null;

  constructor(
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.tabUpdate$.pipe(debounceTime(500)).subscribe(({ index, field, value }) => {
      if (this.tabs[index]) {
        (this.tabs[index] as any)[field] = value;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  saveTab() {
    this.tabs.push({ title: '', description: '', tabIndex: this.tabs.length + 1, tabItems: [] })
    this.HotToastService.success('Tab added successfully');
    this.ChangeDetectorRef.markForCheck()
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.HotToastService.success('Tab removed successfully');
    this.ChangeDetectorRef.markForCheck()
  }

  viewTab(index: number) {
    this.inViewTab = this.tabs[index];
    this.ChangeDetectorRef.markForCheck()
  }

  onTabChange(index: number, field: 'title' | 'description', value: Event) {
    this.tabUpdate$.next({ index, field, value: (value.target as HTMLInputElement).value });
  }
}
