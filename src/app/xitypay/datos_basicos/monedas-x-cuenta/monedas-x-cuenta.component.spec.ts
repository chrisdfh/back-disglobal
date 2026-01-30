import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonedasXCuentaComponent } from './monedas-x-cuenta.component';

describe('MonedasXCuentaComponent', () => {
  let component: MonedasXCuentaComponent;
  let fixture: ComponentFixture<MonedasXCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonedasXCuentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonedasXCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
