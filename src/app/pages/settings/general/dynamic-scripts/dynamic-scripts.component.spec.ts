import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicScriptsComponent } from './dynamic-scripts.component';

describe('DynamicScriptsComponent', () => {
  let component: DynamicScriptsComponent;
  let fixture: ComponentFixture<DynamicScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
