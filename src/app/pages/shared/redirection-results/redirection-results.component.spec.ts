import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionResultsComponent } from './redirection-results.component';

describe('RedirectionResultsComponent', () => {
  let component: RedirectionResultsComponent;
  let fixture: ComponentFixture<RedirectionResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectionResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
