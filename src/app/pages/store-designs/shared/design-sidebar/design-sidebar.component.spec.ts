import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSidebarComponent } from './design-sidebar.component';

describe('DesignSidebarComponent', () => {
  let component: DesignSidebarComponent;
  let fixture: ComponentFixture<DesignSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
