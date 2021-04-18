import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocComponent } from './select-loc.component';

describe('SelectLocComponent', () => {
  let component: SelectLocComponent;
  let fixture: ComponentFixture<SelectLocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
