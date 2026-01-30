import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioCompartidoComponent } from './servicio-compartido.component';

describe('ServicioCompartidoComponent', () => {
  let component: ServicioCompartidoComponent;
  let fixture: ComponentFixture<ServicioCompartidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicioCompartidoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioCompartidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
