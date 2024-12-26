import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalMenuMobileServiceService {

  constructor() { }

  private isOpen = new BehaviorSubject<boolean>(false);
  modalState$ = this.isOpen.asObservable();

  openModal() {
    this.isOpen.next(true);
  }

  closeModal() {
    this.isOpen.next(false);
  }
}
