import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavmobileComponent } from './navmobile.component';

describe('NavmobileComponent', () => {
  let component: NavmobileComponent;
  let fixture: ComponentFixture<NavmobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavmobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
