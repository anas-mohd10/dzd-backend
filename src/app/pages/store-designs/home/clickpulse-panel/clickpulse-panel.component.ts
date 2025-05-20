import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  private tabUpdate$ = new Subject<{ index: number; field: string; value: string }>();
  private tabItemUpdate$ = new Subject<{ index: number; field: string; value: string }>();
  inViewTab: ClickPulsePanel | null = null;
  initialTab: ClickPulsePanel = {
    title: '',
    description: '',
    tabIndex: 0,
    tabItems: [],
    displayType: 'grid',
    gridColumns: 1,
    carouselItems: 1,
    isCollapsed: true
  }

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

  collapseAll() {
    this.tabs.forEach(tab => {
      tab.isCollapsed = true
    })
    this.ChangeDetectorRef.markForCheck()
  }
  
  expandAll() {
    this.tabs.forEach(tab => {
      tab.isCollapsed = false
    })
    this.ChangeDetectorRef.markForCheck()
  }

  saveTab() {
    this.tabs.push({ ...this.initialTab, tabIndex: this.tabs.length })
    this.HotToastService.success('Tab added successfully');
    this.ChangeDetectorRef.markForCheck()
  }

  saveTabItem() {
    if (this.inViewTab && this.inViewTab.tabIndex !== undefined) {
      if (this.tabs[this.inViewTab.tabIndex]) {
        this.tabs[this.inViewTab.tabIndex].tabItems.push({
          title: '',
          description: '',
          tabItemIndex: this.tabs[this.inViewTab.tabIndex].tabItems.length + 1,
          isCollapsed: true,
          type: 'image'
        });
        this.HotToastService.success('Tab item added successfully');
        this.ChangeDetectorRef.markForCheck();
      }
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.HotToastService.success('Tab removed successfully');
    this.ChangeDetectorRef.markForCheck()
  }

  toggleTabCollapse(index: number) {
    console.log(index, "index")
    if (index != undefined) {
      console.log(this.tabs[index], "this.tabs[index]")
      this.tabs[index]['isCollapsed'] = this.tabs[index]['isCollapsed'] ? false : true
      this.ChangeDetectorRef.markForCheck()
    }
    console.log(this.tabs, "this.tabs")
  }

  removeTabItem(index: number) {
    if (this.inViewTab && this.inViewTab.tabIndex) {
      this.tabs[this.inViewTab.tabIndex].tabItems.splice(index, 1);
      this.HotToastService.success('Tab item removed successfully');
      this.ChangeDetectorRef.markForCheck()
    }
  }

  viewTab(index: number) {
    this.inViewTab = this.tabs[index];
    this.ChangeDetectorRef.markForCheck()
  }

  onTabChange(index: number, field: 'title' | 'description', value: Event) {
    this.tabUpdate$.next({ index, field, value: (value.target as HTMLInputElement).value });
  }
}
