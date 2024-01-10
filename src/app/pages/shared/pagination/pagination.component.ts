import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input('pageIndex') pageIndex: number = 1;
  @Input('pageSize') pageSize?: number;
  @Input('totalResults') totalResults: number = 0;
  @Input('totalPages') totalPages: number = 1;
  @Output('pageTrigger') pageTrigger = new EventEmitter<any>();
  limit: FormControl = new FormControl("20");
  limits: Array<string> = ["05", "10", "20", "30", "40", "50", "100", "200"];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.limit.setValue(this.pageSize ? this.pageSize : "20")
  }

  ngOnInit(): void {

  }

  getDisplayRange(): string {
    const startRange = (this.pageIndex - 1) * (this.pageSize || 1) + 1;
    const endRange = Math.min(this.pageIndex * (this.pageSize || 1), this.totalResults);

    return `${startRange} to ${endRange} of ${this.totalResults} results`;
  }

  onPageSizeChange() {
    this.pageSize = this.limit.value;
    this.pageIndex = 1;
    this.pageTrigger.emit({ pageIndex: this.pageIndex, pageSize: this.limit?.value });
  }

  onPageIndexChange(page: number) {
    this.pageIndex = page
    this.pageTrigger.emit({ pageIndex: this.pageIndex, pageSize: this.limit?.value });
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = Math.max(1, this.pageIndex - 1); i <= Math.min(this.totalPages, this.pageIndex + 1); i++) {
      pages.push(i);
    }
    return pages;
  }
}
