import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocSelectComponent } from './loc-select.component';

describe('LocSelectComponent', () => {
  let component: LocSelectComponent;
  let fixture: ComponentFixture<LocSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
