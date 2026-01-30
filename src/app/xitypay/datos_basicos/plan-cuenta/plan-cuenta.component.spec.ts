import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCuentaComponent } from './plan-cuenta.component';

describe('PlanCuentaComponent', () => {
  let component: PlanCuentaComponent;
  let fixture: ComponentFixture<PlanCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
