import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewImagesComponent } from './modal-view-images.component';

describe('ModalViewImagesComponent', () => {
  let component: ModalViewImagesComponent;
  let fixture: ComponentFixture<ModalViewImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalViewImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
