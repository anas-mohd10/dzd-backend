import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  positions: any = {
    TOP_LEFT: 'top-left',
    TOP_CENTER: 'top-center',
    TOP_RIGHT: 'top-right',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_CENTER: 'bottom-center',
  };
  duration = 3000;
  id = 'DEMo ID';
  style = {
    borderRadius: '10px',
    background: '#333',
    color: '#fff',
    padding: '14px',
    fontSize: '16px',
  };

  constructor(private toast: HotToastService) {}

  success(
    msg = '',
    duration = this.duration,
    position = this.positions.TOP_CENTER,
    style = this.style
  ) {
    this.toast.success(msg, {
      duration,
      position,
      style,
      id: this.id,
    });
  }

  warning(
    msg = '',
    duration = this.duration,
    position = this.positions.TOP_CENTER,
    style = this.style
  ) {
    this.toast.warning(msg, {
      duration,
      position,
      style,
      id: this.id,
    });
  }

  error(
    msg = '',
    duration = this.duration,
    position = this.positions.TOP_CENTER,
    style = this.style
  ) {
    this.toast.error(msg, {
      duration,
      position,
      style,
      id: this.id,
    });
  }

  info(
    msg = '',
    duration = this.duration,
    position = this.positions.TOP_CENTER,
    style = this.style
  ) {
    this.toast.info(msg, {
      duration,
      position,
      style,
      id: this.id,
    });
  }

  loader(
    msg = '',
    duration = this.duration,
    position = this.positions.TOP_CENTER,
    style = this.style
  ) {
    this.toast.loading(msg, {
      position,
      duration,
      style,
      id: this.id,
    });
  }

  observe(msg = '', success = '', error = '', style = this.style) {
    return this.toast.observe({
      loading: msg,
      success,
      error,
    });
  }
}
