import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedComponent } from './validated.component';

describe('ValidatedComponent', () => {
  let component: ValidatedComponent;
  let fixture: ComponentFixture<ValidatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
