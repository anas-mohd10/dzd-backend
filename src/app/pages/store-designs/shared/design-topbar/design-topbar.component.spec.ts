import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTopbarComponent } from './design-topbar.component';

describe('DesignTopbarComponent', () => {
  let component: DesignTopbarComponent;
  let fixture: ComponentFixture<DesignTopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignTopbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignTopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
