import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanXCuentaComponent } from './plan-x-cuenta.component';

describe('PlanXCuentaComponent', () => {
  let component: PlanXCuentaComponent;
  let fixture: ComponentFixture<PlanXCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanXCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanXCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
