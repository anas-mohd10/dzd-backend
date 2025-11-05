import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-media-delete-confirmation',
  templateUrl: './media-delete-confirmation.component.html',
  styleUrls: ['./media-delete-confirmation.component.scss']
})
export class MediaDeleteConfirmationComponent implements OnInit {
  @Input() mediaDetails: any;
  @Input() relatedProducts: any[] = [];
  @Input() isRelatedFromCheck: boolean = false;
  @Output() confirmDelete = new EventEmitter<boolean>();
  @Output() cancelDelete = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onConfirmDelete() {
    this.confirmDelete.emit(true);
  }

  onCancelDelete() {
    this.cancelDelete.emit();
  }
}