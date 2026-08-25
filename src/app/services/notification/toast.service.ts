import {Injectable} from '@angular/core';

export type ToastType = 'success' | 'danger' | 'info';

export interface ToastInfo {
  header: string;
  body: string;
  delay?: number;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor() {
  }


  show(header: string, body: string, toastType: ToastType) {
    this.toasts.push({header, body, type: toastType});
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
