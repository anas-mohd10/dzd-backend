import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalisationComponent } from './internationalisation.component';

describe('InternationalisationComponent', () => {
  let component: InternationalisationComponent;
  let fixture: ComponentFixture<InternationalisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
