import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioContrasenaUsuariosComponent } from './cambio-contrasena-usuarios.component';

describe('CambioContrasenaUsuariosComponent', () => {
  let component: CambioContrasenaUsuariosComponent;
  let fixture: ComponentFixture<CambioContrasenaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioContrasenaUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambioContrasenaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
