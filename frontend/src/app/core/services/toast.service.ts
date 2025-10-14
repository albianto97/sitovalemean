import { Injectable } from '@angular/core';
import { Toast } from 'bootstrap';

@Injectable({ providedIn: 'root' })
export class ToastService {
  show(message: string, isError = false): void {
    const toastEl = document.getElementById('mainToast');
    const msgEl = document.getElementById('toastMessage');

    if (toastEl && msgEl) {
      msgEl.innerText = message;

      // Cambia colore in base al tipo
      toastEl.classList.remove('text-bg-success', 'text-bg-danger');
      toastEl.classList.add(isError ? 'text-bg-danger' : 'text-bg-success');

      const toast = new Toast(toastEl);
      toast.show();
    }
  }
}
