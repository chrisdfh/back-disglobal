import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoXpayCuentasComponent } from './listado-xpay-cuentas.component';

describe('ListadoXpayCuentasComponent', () => {
  let component: ListadoXpayCuentasComponent;
  let fixture: ComponentFixture<ListadoXpayCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListadoXpayCuentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoXpayCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
