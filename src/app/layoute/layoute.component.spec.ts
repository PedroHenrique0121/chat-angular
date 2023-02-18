import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayouteComponent } from './layoute.component';

describe('LayouteComponent', () => {
  let component: LayouteComponent;
  let fixture: ComponentFixture<LayouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
