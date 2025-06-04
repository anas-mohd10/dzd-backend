import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickpulsePanelComponent } from './clickpulse-panel.component';

describe('ClickpulsePanelComponent', () => {
  let component: ClickpulsePanelComponent;
  let fixture: ComponentFixture<ClickpulsePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClickpulsePanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickpulsePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
