import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMonedaXitypayComponent } from './editar-moneda-xitypay.component';

describe('EditarMonedaXitypayComponent', () => {
  let component: EditarMonedaXitypayComponent;
  let fixture: ComponentFixture<EditarMonedaXitypayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarMonedaXitypayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarMonedaXitypayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
