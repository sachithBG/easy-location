import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocViewComponent } from './loc-view.component';

describe('LocViewComponent', () => {
  let component: LocViewComponent;
  let fixture: ComponentFixture<LocViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
