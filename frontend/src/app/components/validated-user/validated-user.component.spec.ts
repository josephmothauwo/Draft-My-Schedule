import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedUserComponent } from './validated-user.component';

describe('ValidatedUserComponent', () => {
  let component: ValidatedUserComponent;
  let fixture: ComponentFixture<ValidatedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
