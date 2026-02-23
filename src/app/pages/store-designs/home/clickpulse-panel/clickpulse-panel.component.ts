import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ClickPulsePanel } from '../home.constants';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { cloneDeep } from 'lodash';

interface Hotspot {
  xCoords: number;
  yCoords: number;
  productId: string;
  label: string;
}

interface ShowHotspots {
  tabItemIndex: number;
  isShow: boolean;
}

@Component({
  selector: 'app-clickpulse-panel',
  templateUrl: './clickpulse-panel.component.html',
  styleUrls: ['./clickpulse-panel.component.scss']
})
export class ClickpulsePanelComponent implements OnInit, OnChanges {
  form: FormGroup = new FormGroup({});
  @Input() tabs: Array<ClickPulsePanel> = [];
  @Output() handleClickpulse: EventEmitter<any> = new EventEmitter();
  private tabUpdate$ = new Subject<{ index: number; field: string; value: string }>();
  private tabItemUpdate$ = new Subject<{
    index: number;
    field: 'title' | 'contentItem' | 'videoItem' | 'imageItem' | 'isCoordsEnabled';
    value: string
  }>();
  inViewTab: ClickPulsePanel | null = null;
  inViewTabItem: ClickPulsePanel['tabItems'][0] | null = null;
  showHotspots: ShowHotspots | null = null;
  initialTab: ClickPulsePanel = {
    title: '',
    description: '',
    tabIndex: 0,
    tabItems: [],
    displayType: 'grid',
    gridColumns: 1,
    carouselItems: 1,
    isCollapsed: true,
  }

  initialTabItem: any = {
    title: '',
    blockType: 'image',
    imageItem: null,
    videoItem: null,
    isCollapsed: true,
    isCoordsEnabled: 'no',
    tabItemIndex: 0,
    contentItem: '',
    hotspots: [] as Hotspot[],
  }

  constructor(
    private HotToastService: HotToastService,
    private ChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const tabDocs = changes['tabs']['currentValue'];
    if (tabDocs && tabDocs.length) {
      this.tabs = cloneDeep(tabDocs).map((tab: any, index: number) => ({
        ...tab,
        tabIndex: index,
        isCollapsed: true,
        tabItems: tab.tabItems.map((item: any, itemIndex: number) => ({
          ...item,
          isCollapsed: this.inViewTabItem ? this.inViewTabItem.tabItemIndex == itemIndex ? false : true : true,
          tabItemIndex: itemIndex
        }))
      }));
    }
    this.ChangeDetectorRef.markForCheck();
  }

  ngOnInit(): void {
    this.tabUpdate$.pipe(debounceTime(500)).subscribe(({ index, field, value }) => {
      if (this.tabs[index]) {
        (this.tabs[index] as any)[field] = value;
        this.handleClickpulse.emit(this.tabs);
        this.ChangeDetectorRef.markForCheck();
      }
    });

    this.tabItemUpdate$.pipe(debounceTime(500)).subscribe(({ index, field, value }) => {
      if (this.inViewTab && this.inViewTab.tabIndex !== undefined) {
        if (this.tabs[this.inViewTab.tabIndex]) {
          this.tabs[this.inViewTab.tabIndex].tabItems[index][field] = value;
          this.handleClickpulse.emit(this.tabs);
          this.ChangeDetectorRef.markForCheck();
        }
      }
    });
  }

  collapseAll(type: 'tab' | 'tabItem') {
    if (type == 'tab') {
      this.tabs.forEach(tab => {
        tab.isCollapsed = true
      })
    }

    if (type == 'tabItem') {
      this.tabs.forEach(tab => {
        tab.tabItems.forEach(tabItem => {
          tabItem.isCollapsed = true
        })
      })
    }
    this.ChangeDetectorRef.markForCheck()
  }

  expandAll(type: 'tab' | 'tabItem') {
    if (type == 'tab') {
      this.tabs.forEach(tab => {
        tab.isCollapsed = false
      })
    }

    if (type == 'tabItem') {
      this.tabs.forEach(tab => {
        tab.tabItems.forEach(tabItem => {
          tabItem.isCollapsed = false
        })
      })
    }
    this.ChangeDetectorRef.markForCheck()
  }

  saveTab() {
    const newTab = {
      ...this.initialTab,
      tabIndex: this.tabs.length,
      tabItems: []
    };
    this.tabs.push(newTab);
    this.HotToastService.success('Tab added successfully');
    this.handleClickpulse.emit(this.tabs);
    this.ChangeDetectorRef.markForCheck()
  }

  saveTabItem() {
    if (this.inViewTab && this.inViewTab.tabIndex !== undefined) {
      if (this.tabs[this.inViewTab.tabIndex]) {
        this.tabs[this.inViewTab.tabIndex].tabItems.push(this.initialTabItem);
        this.handleClickpulse.emit(this.tabs);
        this.HotToastService.success('Tab item added successfully');
        this.ChangeDetectorRef.markForCheck();
      }
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.HotToastService.success('Tab removed successfully');
    this.handleClickpulse.emit(this.tabs);
    this.ChangeDetectorRef.markForCheck()
  }

  toggleTabCollapse(index: number) {
    if (index != undefined) {
      this.tabs[index]['isCollapsed'] = this.tabs[index]['isCollapsed'] ? false : true
      this.ChangeDetectorRef.markForCheck()
    }
  }

  toggleTabItemCollapse(tabIndex: number, index: number) {
    if (index != undefined) {
      this.tabs[tabIndex]['tabItems'][index]['isCollapsed'] = this.tabs[tabIndex]['tabItems'][index]['isCollapsed'] ? false : true
      if (this.tabs[tabIndex]['tabItems'][index]['isCollapsed'] == false) {
        this.inViewTabItem = this.tabs[tabIndex]['tabItems'][index];
      }

      this.ChangeDetectorRef.markForCheck()
    }
  }

  removeTabItem(index: number) {
    if (this.inViewTab && this.inViewTab.tabIndex !== undefined) {
      this.tabs[this.inViewTab.tabIndex].tabItems.splice(index, 1);
      this.HotToastService.success('Tab item removed successfully');
      this.handleClickpulse.emit(this.tabs);
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

  onTabItemChange(index: number, field: 'title' | 'contentItem' | 'videoItem' | 'imageItem', value: Event) {
    this.tabItemUpdate$.next({ index, field, value: (value.target as HTMLInputElement).value });
  }

  onTitleImageTriggered(event: { path: string }, index: number) {
    this.tabItemUpdate$.next({ index, field: 'imageItem', value: event.path });
  }

  toggleCoords(event: { toggleState: boolean, switchId: string }, index: number) {
    this.tabItemUpdate$.next({ index, field: 'isCoordsEnabled', value: event.toggleState ? 'yes' : 'no' });
  }

  toggleShowHotspot(tabItemIndex: number, type: 'show' | 'hide') {
    if (type == 'show') {
      this.showHotspots = { tabItemIndex, isShow: true };
    }

    if (type == 'hide') {
      this.showHotspots = null;
    }
  }

  handleHotspots(event: Hotspot[]) {
    if (this.inViewTab && this.inViewTab.tabIndex !== undefined && this.inViewTabItem && this.inViewTabItem.tabItemIndex !== undefined) {
      this.tabs[this.inViewTab.tabIndex].tabItems[this.inViewTabItem.tabItemIndex].hotspots = event;
      this.handleClickpulse.emit(this.tabs);
      this.ChangeDetectorRef.markForCheck();
    }
  }
}

