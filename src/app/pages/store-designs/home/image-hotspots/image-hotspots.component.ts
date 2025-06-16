import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface Hotspot {
  xCoords: number;
  yCoords: number;
  label: string;
  productId: string;
}

@Component({
  selector: 'app-image-hotspots',
  templateUrl: './image-hotspots.component.html',
  styleUrls: ['./image-hotspots.component.scss']
})
export class ImageHotspotsComponent implements OnInit {
  imageUrl: string = '';
  @Input('imageItem') imageItem: string | null = null;
  @Input('hotspots') hotspots: Hotspot[] = [];
  @Output() handleHotspots: EventEmitter<Hotspot[]> = new EventEmitter();
  private hotspotChangeSubject = new Subject<{ index: number; field: 'label' | 'productId'; value: string }>();

  ngOnInit(): void {
    this.imageUrl = `${environment.base}${this.imageItem}`;
    this.hotspotChangeSubject.pipe(
      debounceTime(500)
    ).subscribe(({ index, field, value }) => {
      this.hotspots[index][field] = value;
      this.handleHotspots.emit(this.hotspots);
    });
  }

  addHotspot(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const xCoords = event.clientX - rect.left;
    const yCoords = event.clientY - rect.top;
    const label = '', productId = '';
    this.hotspots.push({ xCoords, yCoords, label, productId });
    this.handleHotspots.emit(this.hotspots);
  }

  removeHotspot(index: number): void {
    this.hotspots.splice(index, 1);
    this.handleHotspots.emit(this.hotspots);
  }

  onHotspotChange(index: number, field: 'label' | 'productId', value: Event): void {
    const inputValue = (value.target as HTMLInputElement).value;
    this.hotspotChangeSubject.next({ index, field, value: inputValue });
  }
}
